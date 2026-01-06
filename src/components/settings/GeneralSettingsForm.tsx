"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface IPAMBehavior {
  defaultLeaseDays: number;
  autoAllocation: boolean;
  autoAllocationMode: "sequential" | "random" | "optimized";
  reservationRules: {
    reserveNetworkAddress: boolean;
    reserveBroadcastAddress: boolean;
    reserveGatewayAddress: boolean;
    reserveFirstAvailable: boolean;
  };
  conflictResolution: "prevent" | "warn" | "auto-resolve";
  allowOverlap: boolean;
  strictValidation: boolean;
}

export function GeneralSettingsForm() {
  const { showToast } = useToast();
  const [behavior, setBehavior] = useState<IPAMBehavior>({
    defaultLeaseDays: 30,
    autoAllocation: true,
    autoAllocationMode: "optimized",
    reservationRules: {
      reserveNetworkAddress: true,
      reserveBroadcastAddress: true,
      reserveGatewayAddress: true,
      reserveFirstAvailable: false,
    },
    conflictResolution: "prevent",
    allowOverlap: false,
    strictValidation: true,
  });

  const handleSave = () => {
    showToast("IPAM behavior settings saved successfully", "success");
  };

  const allocationModes = [
    { value: "sequential", label: "Sequential", description: "Allocate IPs in order" },
    { value: "random", label: "Random", description: "Allocate from available IPs randomly" },
    { value: "optimized", label: "Optimized", description: "Smart allocation based on usage patterns" },
  ];

  const conflictResolutions = [
    { value: "prevent", label: "Prevent", description: "Block allocation if conflict detected" },
    { value: "warn", label: "Warn", description: "Allow but show warning" },
    { value: "auto-resolve", label: "Auto-resolve", description: "Automatically resolve conflicts" },
  ];

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">IPAM Behavior</h3>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Save Changes
          </button>
        </div>
        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Default Lease Duration</h4>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              max="365"
              value={behavior.defaultLeaseDays}
              onChange={(e) => setBehavior({ ...behavior, defaultLeaseDays: Number(e.target.value) })}
              className="w-24 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-sm text-slate-700">days</span>
            <p className="text-xs text-slate-500">
              Default lease duration for newly allocated IP addresses
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Auto-Allocation</h4>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={behavior.autoAllocation}
                onChange={(e) => setBehavior({ ...behavior, autoAllocation: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-medium text-slate-900">Enable Auto-Allocation</p>
                <p className="text-xs text-slate-600">
                  Automatically assign IP addresses when requested without manual selection
                </p>
              </div>
            </label>
          </div>

          {behavior.autoAllocation && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Allocation Mode</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {allocationModes.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() =>
                      setBehavior({
                        ...behavior,
                        autoAllocationMode: mode.value as IPAMBehavior["autoAllocationMode"],
                      })
                    }
                    className={`p-3 border-2 rounded-lg text-left transition-all ${
                      behavior.autoAllocationMode === mode.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-3 h-3 rounded-full border-2 ${
                          behavior.autoAllocationMode === mode.value
                            ? "border-blue-600 bg-blue-600"
                            : "border-slate-300"
                        }`}
                      />
                      <span className="text-sm font-semibold text-slate-900">{mode.label}</span>
                    </div>
                    <p className="text-xs text-slate-600">{mode.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">IP Reservation Rules</h4>
          <p className="text-sm text-slate-600 mb-4">
            Configure which IP addresses should be automatically reserved and not allocated
          </p>
          <div className="space-y-3">
            {Object.entries(behavior.reservationRules).map(([rule, enabled]) => {
              const ruleLabels: Record<string, string> = {
                reserveNetworkAddress: "Reserve Network Address",
                reserveBroadcastAddress: "Reserve Broadcast Address",
                reserveGatewayAddress: "Reserve Gateway Address",
                reserveFirstAvailable: "Reserve First Available IP",
              };
              const ruleDescriptions: Record<string, string> = {
                reserveNetworkAddress: "Prevent allocation of the network address (first IP in range)",
                reserveBroadcastAddress: "Prevent allocation of the broadcast address (last IP in range)",
                reserveGatewayAddress: "Reserve the gateway IP address (typically .1 or .254)",
                reserveFirstAvailable: "Reserve the first available IP address after network/broadcast",
              };
              return (
                <label
                  key={rule}
                  className="flex items-start justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <span className="text-sm font-medium text-slate-900 block mb-1">
                      {ruleLabels[rule] || rule}
                    </span>
                    <span className="text-xs text-slate-600">{ruleDescriptions[rule] || ""}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      setBehavior({
                        ...behavior,
                        reservationRules: {
                          ...behavior.reservationRules,
                          [rule]: e.target.checked,
                        },
                      })
                    }
                    className="ml-4 w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </label>
              );
            })}
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Conflict Resolution</h4>
          <div className="space-y-3">
            {conflictResolutions.map((resolution) => (
              <label
                key={resolution.value}
                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  behavior.conflictResolution === resolution.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <input
                  type="radio"
                  name="conflictResolution"
                  value={resolution.value}
                  checked={behavior.conflictResolution === resolution.value}
                  onChange={(e) =>
                    setBehavior({
                      ...behavior,
                      conflictResolution: e.target.value as IPAMBehavior["conflictResolution"],
                    })
                  }
                  className="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-slate-900 block mb-1">
                    {resolution.label}
                  </span>
                  <span className="text-xs text-slate-600">{resolution.description}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Advanced Settings</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
              <div>
                <span className="text-sm font-medium text-slate-900 block mb-1">
                  Allow Pool Overlaps
                </span>
                <span className="text-xs text-slate-600">
                  Allow creation of pools with overlapping IP ranges (not recommended)
                </span>
              </div>
              <input
                type="checkbox"
                checked={behavior.allowOverlap}
                onChange={(e) => setBehavior({ ...behavior, allowOverlap: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
              <div>
                <span className="text-sm font-medium text-slate-900 block mb-1">
                  Strict Validation
                </span>
                <span className="text-xs text-slate-600">
                  Enforce strict validation rules for all IP operations
                </span>
              </div>
              <input
                type="checkbox"
                checked={behavior.strictValidation}
                onChange={(e) => setBehavior({ ...behavior, strictValidation: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>
      </div>
    </Card>
  );
}

