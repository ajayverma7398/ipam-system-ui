"use client";

import { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface Subnet {
  id: string;
  name: string;
  requiredHosts: number;
  cidr: string;
  network: string;
  broadcast: string;
  subnetMask: string;
  usableHosts: number;
  allocated: boolean;
}

export function SubnetPlanner() {
  const { showToast } = useToast();
  const [baseCIDR, setBaseCIDR] = useState("192.168.1.0/24");
  const [subnets, setSubnets] = useState<Subnet[]>([]);
  const [subnetName, setSubnetName] = useState("");
  const [requiredHosts, setRequiredHosts] = useState("");

  const baseNetwork = useMemo(() => {
    if (!baseCIDR || !baseCIDR.includes("/")) return null;

    try {
      const [ip, prefixStr] = baseCIDR.split("/");
      const prefix = parseInt(prefixStr, 10);
      const ipParts = ip.split(".").map(Number);

      const hostBits = 32 - prefix;
      const totalHosts = Math.pow(2, hostBits);

      const subnetMask = Array.from({ length: 4 }, (_, i) => {
        const bits = Math.min(8, Math.max(0, prefix - i * 8));
        return (0xff << (8 - bits)) & 0xff;
      });

      const network = ipParts.map((part, i) => part & subnetMask[i]);

      return {
        network: network.join("."),
        prefix,
        totalHosts,
        subnetMask: subnetMask.join("."),
      };
    } catch {
      return null;
    }
  }, [baseCIDR]);

  const calculateSubnet = (requiredHosts: number, startIP: string): Subnet | null => {
    if (!baseNetwork) return null;

    const requiredBits = Math.ceil(Math.log2(requiredHosts + 2)); // +2 for network and broadcast
    const subnetPrefix = 32 - requiredBits;
    const subnetHosts = Math.pow(2, requiredBits);

    const subnetMask = Array.from({ length: 4 }, (_, i) => {
      const bits = Math.min(8, Math.max(0, subnetPrefix - i * 8));
      return (0xff << (8 - bits)) & 0xff;
    });

    const startParts = startIP.split(".").map(Number);
    const network = startParts.map((part, i) => part & subnetMask[i]);

    const wildcard = subnetMask.map((mask) => 255 - mask);
    const broadcast = network.map((part, i) => part | wildcard[i]);

    const nextIP = [...broadcast];
    for (let i = 3; i >= 0; i--) {
      nextIP[i]++;
      if (nextIP[i] > 255) {
        nextIP[i] = 0;
      } else {
        break;
      }
    }

    return {
      id: Date.now().toString() + Math.random(),
      name: subnetName || `Subnet ${subnets.length + 1}`,
      requiredHosts,
      cidr: `${network.join(".")}/${subnetPrefix}`,
      network: network.join("."),
      broadcast: broadcast.join("."),
      subnetMask: subnetMask.join("."),
      usableHosts: subnetHosts - 2,
      allocated: false,
    };
  };

  const addSubnet = () => {
    const hosts = parseInt(requiredHosts, 10);
    if (!hosts || hosts < 1) {
      showToast("Please enter a valid number of hosts", "warning");
      return;
    }

    let startIP = baseNetwork?.network || "192.168.1.0";
    if (subnets.length > 0) {
      const lastSubnet = subnets[subnets.length - 1];
      const broadcastParts = lastSubnet.broadcast.split(".").map(Number);
      const nextIP = [...broadcastParts];
      for (let i = 3; i >= 0; i--) {
        nextIP[i]++;
        if (nextIP[i] > 255) {
          nextIP[i] = 0;
        } else {
          break;
        }
      }
      startIP = nextIP.join(".");
    }

    const subnet = calculateSubnet(hosts, startIP);
    if (subnet) {
      setSubnets([...subnets, subnet]);
      setSubnetName("");
      setRequiredHosts("");
      showToast("Subnet added", "success");
    } else {
      showToast("Failed to calculate subnet", "error");
    }
  };

  const removeSubnet = (id: string) => {
    setSubnets(subnets.filter((s) => s.id !== id));
  };

  const totalAllocated = useMemo(() => {
    return subnets.reduce((sum, subnet) => sum + subnet.usableHosts + 2, 0);
  }, [subnets]);

  const remainingHosts = useMemo(() => {
    if (!baseNetwork) return 0;
    return baseNetwork.totalHosts - totalAllocated;
  }, [baseNetwork, totalAllocated]);

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Subnet Planner</h3>
          <p className="text-sm text-slate-600">Divide a network into subnets using VLSM</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Base Network (CIDR)</label>
          <input
            type="text"
            value={baseCIDR}
            onChange={(e) => setBaseCIDR(e.target.value)}
            placeholder="e.g., 192.168.1.0/24"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
          />
          {baseNetwork && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-blue-700">Network:</span>{" "}
                  <span className="font-mono font-semibold text-blue-900">{baseNetwork.network}</span>
                </div>
                <div>
                  <span className="text-blue-700">Total Hosts:</span>{" "}
                  <span className="font-semibold text-blue-900">{baseNetwork.totalHosts}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Subnet Name</label>
            <input
              type="text"
              value={subnetName}
              onChange={(e) => setSubnetName(e.target.value)}
              placeholder="e.g., Sales Department"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Required Hosts</label>
            <input
              type="number"
              value={requiredHosts}
              onChange={(e) => setRequiredHosts(e.target.value)}
              placeholder="e.g., 50"
              min={1}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={addSubnet}
              className="w-full px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
            >
              Add Subnet
            </button>
          </div>
        </div>

        {subnets.length > 0 && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Total Subnets:</span>{" "}
                <span className="font-semibold text-slate-900">{subnets.length}</span>
              </div>
              <div>
                <span className="text-slate-600">Allocated Hosts:</span>{" "}
                <span className="font-semibold text-slate-900">{totalAllocated}</span>
              </div>
              <div>
                <span className="text-slate-600">Remaining:</span>{" "}
                <span className={`font-semibold ${remainingHosts < 0 ? "text-red-600" : "text-green-600"}`}>
                  {remainingHosts}
                </span>
              </div>
            </div>
            {remainingHosts < 0 && (
              <p className="mt-2 text-xs text-red-600">Warning: Exceeded available hosts</p>
            )}
          </div>
        )}

        {subnets.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-md font-semibold text-slate-900">Planned Subnets</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {subnets.map((subnet) => (
                <div
                  key={subnet.id}
                  className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{subnet.name}</p>
                      <p className="text-xs text-slate-600">Requires: {subnet.requiredHosts} hosts</p>
                    </div>
                    <button
                      onClick={() => removeSubnet(subnet.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-slate-600">CIDR:</span>{" "}
                      <span className="font-mono font-semibold text-slate-900">{subnet.cidr}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Network:</span>{" "}
                      <span className="font-mono text-slate-900">{subnet.network}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Broadcast:</span>{" "}
                      <span className="font-mono text-slate-900">{subnet.broadcast}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Usable:</span>{" "}
                      <span className="font-semibold text-slate-900">{subnet.usableHosts}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

