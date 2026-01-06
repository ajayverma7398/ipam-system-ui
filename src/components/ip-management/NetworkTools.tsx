"use client";

import { useState, useMemo } from "react";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";

export function NetworkTools() {
  const [cidr1, setCidr1] = useState("192.168.1.0/24");
  const [cidr2, setCidr2] = useState("192.168.2.0/24");
  const [cidrList, setCidrList] = useState("192.168.1.0/24\n192.168.2.0/24\n192.168.3.0/24");

  const parseCIDR = (cidr: string) => {
    if (!cidr || !cidr.includes("/")) return null;

    try {
      const [ip, prefixStr] = cidr.split("/");
      const prefix = parseInt(prefixStr, 10);
      const ipParts = ip.split(".").map(Number);

      const subnetMask = Array.from({ length: 4 }, (_, i) => {
        const bits = Math.min(8, Math.max(0, prefix - i * 8));
        return (0xff << (8 - bits)) & 0xff;
      });

      const network = ipParts.map((part, i) => part & subnetMask[i]);
      const wildcard = subnetMask.map((mask) => 255 - mask);
      const broadcast = network.map((part, i) => part | wildcard[i]);

      return {
        network: network.join("."),
        broadcast: broadcast.join("."),
        prefix,
        subnetMask: subnetMask.join("."),
      };
    } catch {
      return null;
    }
  };

  const overlapResult = useMemo(() => {
    const net1 = parseCIDR(cidr1);
    const net2 = parseCIDR(cidr2);

    if (!net1 || !net2) {
      return null;
    }

    const net1Parts = net1.network.split(".").map(Number);
    const net2Parts = net2.network.split(".").map(Number);
    const net1Broadcast = net1.broadcast.split(".").map(Number);
    const net2Broadcast = net2.broadcast.split(".").map(Number);

    const overlaps =
      (net1Parts[0] <= net2Broadcast[0] && net1Broadcast[0] >= net2Parts[0]) &&
      (net1Parts[1] <= net2Broadcast[1] && net1Broadcast[1] >= net2Parts[1]) &&
      (net1Parts[2] <= net2Broadcast[2] && net1Broadcast[2] >= net2Parts[2]) &&
      (net1Parts[3] <= net2Broadcast[3] && net1Broadcast[3] >= net2Parts[3]);

    return {
      overlaps,
      net1,
      net2,
    };
  }, [cidr1, cidr2]);

  const supernetResult = useMemo(() => {
    const cidrs = cidrList.split("\n").filter(Boolean);
    if (cidrs.length < 2) return null;

    const networks = cidrs.map(parseCIDR).filter(Boolean);
    if (networks.length < 2) return null;

    const firstNetwork = networks[0]!.network.split(".").map(Number);
    const lastNetwork = networks[networks.length - 1]!.network.split(".").map(Number);

    let commonPrefix = 0;
    for (let i = 0; i < 4; i++) {
      if (firstNetwork[i] === lastNetwork[i]) {
        commonPrefix += 8;
      } else {
        const diff = firstNetwork[i] ^ lastNetwork[i];
        let bits = 0;
        while (diff >> bits) bits++;
        commonPrefix += 8 - bits;
        break;
      }
    }

    return {
      network: firstNetwork.join("."),
      prefix: commonPrefix,
      cidr: `${firstNetwork.join(".")}/${commonPrefix}`,
    };
  }, [cidrList]);

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Network Tools</h3>
          <p className="text-sm text-slate-600">Overlap detection, supernet calculation, and route aggregation</p>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Overlap Detection</h4>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Network 1</label>
              <input
                type="text"
                value={cidr1}
                onChange={(e) => setCidr1(e.target.value)}
                placeholder="192.168.1.0/24"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Network 2</label>
              <input
                type="text"
                value={cidr2}
                onChange={(e) => setCidr2(e.target.value)}
                placeholder="192.168.2.0/24"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
            </div>
          </div>
          {overlapResult && (
            <div
              className={`p-3 rounded-lg ${
                overlapResult.overlaps
                  ? "bg-red-50 border border-red-200"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  overlapResult.overlaps ? "text-red-900" : "text-green-900"
                }`}
              >
                {overlapResult.overlaps ? "⚠️ Networks Overlap" : "✓ No Overlap Detected"}
              </p>
              {overlapResult.overlaps && (
                <p className="text-xs text-red-700 mt-1">
                  These networks have overlapping address ranges
                </p>
              )}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200">
          <h4 className="text-md font-semibold text-slate-900 mb-3">Supernet Calculation</h4>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              CIDR List (one per line)
            </label>
            <textarea
              value={cidrList}
              onChange={(e) => setCidrList(e.target.value)}
              placeholder="192.168.1.0/24&#10;192.168.2.0/24&#10;192.168.3.0/24"
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>
          {supernetResult && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-1">Supernet Result</p>
              <p className="text-sm font-mono font-semibold text-blue-900">{supernetResult.cidr}</p>
              <p className="text-xs text-blue-700 mt-1">
                This supernet covers all listed networks
              </p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200">
          <h4 className="text-md font-semibold text-slate-900 mb-3">Check Against Existing Pools</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {(() => {
              const testNet = parseCIDR(cidr1);
              if (!testNet) return null;

              const testParts = testNet.network.split(".").map(Number);
              const testBroadcast = testNet.broadcast.split(".").map(Number);

              return pools
                .map((pool) => {
                  const poolNet = parseCIDR(pool.cidr);
                  if (!poolNet) return null;

                  const poolParts = poolNet.network.split(".").map(Number);
                  const poolBroadcast = poolNet.broadcast.split(".").map(Number);

                  const poolOverlap =
                    (testParts[0] <= poolBroadcast[0] && testBroadcast[0] >= poolParts[0]) &&
                    (testParts[1] <= poolBroadcast[1] && testBroadcast[1] >= poolParts[1]) &&
                    (testParts[2] <= poolBroadcast[2] && testBroadcast[2] >= poolParts[2]) &&
                    (testParts[3] <= poolBroadcast[3] && testBroadcast[3] >= poolParts[3]);

                  if (!poolOverlap) return null;

                  return (
                    <div key={pool.id} className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                      <p className="font-semibold text-yellow-900">{pool.cidr}</p>
                      <p className="text-xs text-yellow-700">Overlaps with your network</p>
                    </div>
                  );
                })
                .filter(Boolean);
            })()}
          </div>
        </div>
      </div>
    </Card>
  );
}

