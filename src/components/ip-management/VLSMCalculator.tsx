"use client";

import { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface VLSMSubnet {
  id: string;
  name: string;
  requiredHosts: number;
  cidr: string;
  network: string;
  broadcast: string;
  subnetMask: string;
  usableHosts: number;
  efficiency: number;
}

export function VLSMCalculator() {
  const { showToast } = useToast();
  const [baseCIDR, setBaseCIDR] = useState("192.168.1.0/24");
  const [subnets, setSubnets] = useState<Array<{ name: string; hosts: number }>>([
    { name: "Subnet 1", hosts: 50 },
  ]);
  const [calculatedSubnets, setCalculatedSubnets] = useState<VLSMSubnet[]>([]);

  const calculateVLSM = () => {
    if (!baseCIDR || !baseCIDR.includes("/")) {
      showToast("Please enter a valid CIDR notation", "warning");
      return;
    }

    try {
      const [ip] = baseCIDR.split("/");
      const ipParts = ip.split(".").map(Number);

      const sortedSubnets = [...subnets].sort((a, b) => b.hosts - a.hosts);

      const results: VLSMSubnet[] = [];
      let currentIP = [...ipParts];

      sortedSubnets.forEach((subnet, index) => {
        const requiredBits = Math.ceil(Math.log2(subnet.hosts + 2));
        const subnetPrefix = 32 - requiredBits;
        const subnetHosts = Math.pow(2, requiredBits);

        const subnetMask = Array.from({ length: 4 }, (_, i) => {
          const bits = Math.min(8, Math.max(0, subnetPrefix - i * 8));
          return (0xff << (8 - bits)) & 0xff;
        });

        const network = currentIP.map((part, i) => part & subnetMask[i]);

        const wildcard = subnetMask.map((mask) => 255 - mask);
        const broadcast = network.map((part, i) => part | wildcard[i]);

        const efficiency = ((subnet.hosts / (subnetHosts - 2)) * 100).toFixed(1);

        results.push({
          id: `subnet-${index}`,
          name: subnet.name,
          requiredHosts: subnet.hosts,
          cidr: `${network.join(".")}/${subnetPrefix}`,
          network: network.join("."),
          broadcast: broadcast.join("."),
          subnetMask: subnetMask.join("."),
          usableHosts: subnetHosts - 2,
          efficiency: parseFloat(efficiency),
        });

        const nextIP = [...broadcast];
        for (let i = 3; i >= 0; i--) {
          nextIP[i]++;
          if (nextIP[i] > 255) {
            nextIP[i] = 0;
          } else {
            break;
          }
        }
        currentIP = nextIP;
      });

      setCalculatedSubnets(results);
      showToast("VLSM calculation completed", "success");
    } catch {
      showToast("Failed to calculate VLSM", "error");
    }
  };

  const addSubnet = () => {
    setSubnets([...subnets, { name: `Subnet ${subnets.length + 1}`, hosts: 10 }]);
  };

  const removeSubnet = (index: number) => {
    setSubnets(subnets.filter((_, i) => i !== index));
  };

  const updateSubnet = (index: number, field: "name" | "hosts", value: string | number) => {
    const updated = [...subnets];
    updated[index] = { ...updated[index], [field]: value };
    setSubnets(updated);
  };

  const totalRequired = useMemo(() => {
    return subnets.reduce((sum, s) => sum + s.hosts, 0);
  }, [subnets]);

  const totalAllocated = useMemo(() => {
    return calculatedSubnets.reduce((sum, s) => sum + s.usableHosts + 2, 0);
  }, [calculatedSubnets]);

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">VLSM Calculator</h3>
          <p className="text-sm text-slate-600">Variable Length Subnet Masking for optimal subnet allocation</p>
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
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">Subnet Requirements</label>
            <button
              onClick={addSubnet}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Subnet
            </button>
          </div>
          <div className="space-y-2">
            {subnets.map((subnet, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={subnet.name}
                  onChange={(e) => updateSubnet(index, "name", e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Subnet name"
                />
                <input
                  type="number"
                  value={subnet.hosts}
                  onChange={(e) => updateSubnet(index, "hosts", parseInt(e.target.value) || 0)}
                  min={1}
                  className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Hosts"
                />
                <button
                  onClick={() => removeSubnet(index)}
                  className="px-3 py-1.5 text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-slate-600">
            Total Required: <span className="font-semibold text-slate-900">{totalRequired}</span> hosts
          </div>
        </div>

        <button
          onClick={calculateVLSM}
          className="w-full px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
        >
          Calculate VLSM
        </button>

        {calculatedSubnets.length > 0 && (
          <div className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-green-700">Total Allocated:</span>{" "}
                  <span className="font-semibold text-green-900">{totalAllocated}</span>
                </div>
                <div>
                  <span className="text-green-700">Efficiency:</span>{" "}
                  <span className="font-semibold text-green-900">
                    {((totalRequired / totalAllocated) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {calculatedSubnets.map((subnet) => (
                <div
                  key={subnet.id}
                  className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{subnet.name}</p>
                      <p className="text-xs text-slate-600">
                        Required: {subnet.requiredHosts} hosts | Efficiency: {subnet.efficiency}%
                      </p>
                    </div>
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

