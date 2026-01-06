"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface AllocationTemplate {
  id: string;
  name: string;
  description: string;
  deviceType: string;
  hostnamePrefix: string;
}

const templates: AllocationTemplate[] = [
  { id: "web", name: "Web Server", description: "Standard web server allocation", deviceType: "server", hostnamePrefix: "web" },
  { id: "db", name: "Database Server", description: "Database server allocation", deviceType: "server", hostnamePrefix: "db" },
  { id: "router", name: "Router", description: "Network router allocation", deviceType: "router", hostnamePrefix: "router" },
  { id: "switch", name: "Switch", description: "Network switch allocation", deviceType: "switch", hostnamePrefix: "switch" },
];

export function QuickAllocate() {
  const { showToast } = useToast();
  const router = useRouter();
  const [selectedPool, setSelectedPool] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const handleQuickAllocate = () => {
    if (!selectedPool) {
      showToast("Please select a pool", "warning");
      return;
    }
    router.push(`/dashboard/ip-management/allocate?pool=${encodeURIComponent(selectedPool)}`);
  };

  const applyTemplate = (template: AllocationTemplate) => {
    setSelectedTemplate(template.id);
    showToast(`Template "${template.name}" applied`, "success");
  };

  return (
    <>
      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Quick Allocate IP</h3>
            <p className="text-sm text-slate-600">Quickly allocate an IP address from a pool</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Pool <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedPool}
              onChange={(e) => setSelectedPool(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a pool...</option>
              {pools.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {pool.cidr} ({pool.utilization.available} available)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Quick Templates</label>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedTemplate === template.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{template.name}</p>
                  <p className="text-xs text-slate-600 mt-1">{template.description}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedPool && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">Available IPs in Pool</p>
              <p className="text-xs text-blue-700">
                The system will automatically suggest the next available IP address when you click &quot;Allocate IP&quot;
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={handleQuickAllocate}
              disabled={!selectedPool}
              className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Allocate IP
            </button>
          </div>
        </div>
      </Card>
    </>
  );
}

