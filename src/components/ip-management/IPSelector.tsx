"use client";

import { useState, useMemo } from "react";
import { pools } from "@/lib/data/pools";
import { allocations } from "@/lib/data/allocations";
import { useToast } from "@/components/ui";

interface IPSelectorProps {
  poolId: string;
  allocationMode: "auto" | "manual" | "range";
  ipAddress: string;
  ipRange?: { start: string; end: string };
  onModeChange: (mode: "auto" | "manual" | "range") => void;
  onIPSelect: (ip: string) => void;
  onRangeSelect: (range: { start: string; end: string }) => void;
}

export function IPSelector({
  poolId,
  allocationMode,
  ipAddress,
  ipRange,
  onModeChange,
  onIPSelect,
  onRangeSelect,
}: IPSelectorProps) {
  const { showToast } = useToast();
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availableIPs, setAvailableIPs] = useState<string[]>([]);

  const pool = useMemo(() => pools.find((p) => p.id === poolId), [poolId]);

  const poolAllocations = useMemo(() => {
    if (!pool) return [];
    return allocations.filter((alloc) => alloc.pool_id === pool.id);
  }, [pool]);

  const allocatedIPs = useMemo(() => {
    return new Set(poolAllocations.filter((a) => a.status === "allocated").map((a) => a.ip_address));
  }, [poolAllocations]);

  const getNextAvailableIP = () => {
    if (!pool) return "";

    const networkParts = pool.network_address.split(".").map(Number);
    const broadcastParts = pool.broadcast_address.split(".").map(Number);

    for (let i = 0; i < 4; i++) {
      for (let j = networkParts[i] + (i === 3 ? 1 : 0); j <= broadcastParts[i]; j++) {
        const testIP = `${networkParts[0]}.${networkParts[1]}.${networkParts[2]}.${j}`;
        if (!allocatedIPs.has(testIP)) {
          return testIP;
        }
      }
    }

    return "";
  };

  const handleAutoAssign = () => {
    const nextIP = getNextAvailableIP();
    if (nextIP) {
      onIPSelect(nextIP);
      showToast(`Auto-assigned: ${nextIP}`, "success");
    } else {
      showToast("No available IPs in this pool", "error");
    }
  };

  const checkAvailability = async (ip: string) => {
    setIsCheckingAvailability(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const isAvailable = !allocatedIPs.has(ip);
    setIsCheckingAvailability(false);
    return isAvailable;
  };

  const handleIPCheck = async () => {
    if (!ipAddress) {
      showToast("Please enter an IP address", "warning");
      return;
    }

    const isAvailable = await checkAvailability(ipAddress);
    if (isAvailable) {
      showToast("IP address is available", "success");
    } else {
      showToast("IP address is already allocated", "error");
    }
  };

  const generateAvailableIPs = () => {
    if (!pool) return [];

    const networkParts = pool.network_address.split(".").map(Number);
    const broadcastParts = pool.broadcast_address.split(".").map(Number);
    const ips: string[] = [];

    let count = 0;
    for (let j = networkParts[3] + 1; j < broadcastParts[3] && count < 20; j++) {
      const testIP = `${networkParts[0]}.${networkParts[1]}.${networkParts[2]}.${j}`;
      if (!allocatedIPs.has(testIP)) {
        ips.push(testIP);
        count++;
      }
    }

    return ips;
  };

  const loadAvailableIPs = () => {
    const ips = generateAvailableIPs();
    setAvailableIPs(ips);
    showToast(`Loaded ${ips.length} available IPs`, "success");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Choose IP Address</h3>
        <p className="text-sm text-slate-600">Select how you want to allocate the IP address</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Allocation Mode</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onModeChange("auto")}
            className={`p-4 border-2 rounded-lg text-center transition-colors ${
              allocationMode === "auto"
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 hover:border-blue-300"
            }`}
          >
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-sm font-semibold text-slate-900">Auto-Assign</div>
            <div className="text-xs text-slate-600 mt-1">Next available IP</div>
          </button>
          <button
            onClick={() => onModeChange("manual")}
            className={`p-4 border-2 rounded-lg text-center transition-colors ${
              allocationMode === "manual"
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 hover:border-blue-300"
            }`}
          >
            <div className="text-2xl mb-2">✋</div>
            <div className="text-sm font-semibold text-slate-900">Manual</div>
            <div className="text-xs text-slate-600 mt-1">Choose specific IP</div>
          </button>
          <button
            onClick={() => onModeChange("range")}
            className={`p-4 border-2 rounded-lg text-center transition-colors ${
              allocationMode === "range"
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 hover:border-blue-300"
            }`}
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-semibold text-slate-900">Range</div>
            <div className="text-xs text-slate-600 mt-1">Select IP range</div>
          </button>
        </div>
      </div>

      {allocationMode === "auto" && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Auto-Assign Next Available IP</p>
              <p className="text-xs text-blue-700">
                The system will automatically assign the next available IP from the pool
              </p>
            </div>
            <button
              onClick={handleAutoAssign}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Assign Now
            </button>
          </div>
          {ipAddress && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-sm text-blue-900">
                Selected: <span className="font-mono font-semibold">{ipAddress}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {allocationMode === "manual" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">IP Address</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => onIPSelect(e.target.value)}
                placeholder="e.g., 192.168.1.10"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
              <button
                onClick={handleIPCheck}
                disabled={!ipAddress || isCheckingAvailability}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingAvailability ? "Checking..." : "Check"}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">Available IPs</label>
              <button
                onClick={loadAvailableIPs}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Load Available IPs
              </button>
            </div>
            {availableIPs.length > 0 && (
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-lg">
                {availableIPs.map((ip) => (
                  <button
                    key={ip}
                    onClick={() => onIPSelect(ip)}
                    className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                      ipAddress === ip
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-blue-100"
                    }`}
                  >
                    {ip}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {allocationMode === "range" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start IP</label>
              <input
                type="text"
                value={ipRange?.start || ""}
                onChange={(e) =>
                  onRangeSelect({
                    start: e.target.value,
                    end: ipRange?.end || "",
                  })
                }
                placeholder="e.g., 192.168.1.10"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End IP</label>
              <input
                type="text"
                value={ipRange?.end || ""}
                onChange={(e) =>
                  onRangeSelect({
                    start: ipRange?.start || "",
                    end: e.target.value,
                  })
                }
                placeholder="e.g., 192.168.1.20"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
            </div>
          </div>
          {ipRange?.start && ipRange?.end && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                Range: <span className="font-mono font-semibold">{ipRange.start}</span> to{" "}
                <span className="font-mono font-semibold">{ipRange.end}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

