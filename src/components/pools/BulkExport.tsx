/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";
import { LoadingSpinner } from "@/components/common/feedback";

interface ExportOptions {
  format: "csv" | "json" | "xml";
  includeAllocations: boolean;
  includeStatistics: boolean;
  includeMetadata: boolean;
  selectedPoolIds: Set<string>;
}

export function BulkExport() {
  const { showToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: "json",
    includeAllocations: false,
    includeStatistics: true,
    includeMetadata: true,
    selectedPoolIds: new Set(pools.map((p) => p.id)),
  });

  const handleExport = async () => {
    if (options.selectedPoolIds.size === 0) {
      showToast("Please select at least one pool to export", "warning");
      return;
    }

    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const selectedPools = pools.filter((p) => options.selectedPoolIds.has(p.id));
      let content = "";
      let mimeType = "";
      let extension = "";

      if (options.format === "json") {
        content = JSON.stringify(selectedPools, null, 2);
        mimeType = "application/json";
        extension = "json";
      } else if (options.format === "csv") {
        const headers = ["CIDR", "Network", "Type", "Total Hosts", "Allocated", "Available", "Utilization %"];
        const rows = selectedPools.map((p) => [
          p.cidr,
          p.network_address,
          p.type,
          p.total_hosts.toString(),
          p.utilization.allocated.toString(),
          p.utilization.available.toString(),
          p.utilization.percentage.toFixed(2),
        ]);
        content = [headers, ...rows].map((row) => row.join(",")).join("\n");
        mimeType = "text/csv";
        extension = "csv";
      } else {
        content = `<?xml version="1.0" encoding="UTF-8"?>\n<pools>\n${selectedPools
          .map(
            (p) => `  <pool>
    <cidr>${p.cidr}</cidr>
    <network>${p.network_address}</network>
    <type>${p.type}</type>
    <totalHosts>${p.total_hosts}</totalHosts>
    <allocated>${p.utilization.allocated}</allocated>
    <available>${p.utilization.available}</available>
    <utilization>${p.utilization.percentage}</utilization>
  </pool>`
          )
          .join("\n")}\n</pools>`;
        mimeType = "application/xml";
        extension = "xml";
      }

      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pools-export-${new Date().toISOString().split("T")[0]}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showToast(`Exported ${selectedPools.length} pool(s) as ${options.format.toUpperCase()}`, "success");
    } catch (error) {
      showToast("Export failed", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const togglePoolSelection = (poolId: string) => {
    const newSelected = new Set(options.selectedPoolIds);
    if (newSelected.has(poolId)) {
      newSelected.delete(poolId);
    } else {
      newSelected.add(poolId);
    }
    setOptions({ ...options, selectedPoolIds: newSelected });
  };

  const selectAll = () => {
    setOptions({ ...options, selectedPoolIds: new Set(pools.map((p) => p.id)) });
  };

  const selectNone = () => {
    setOptions({ ...options, selectedPoolIds: new Set() });
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Bulk Export Pools</h3>
          <p className="text-sm text-slate-600">Export selected pools to various formats</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Export Format</label>
          <div className="flex gap-4">
            {(["csv", "json", "xml"] as const).map((format) => (
              <label key={format} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value={format}
                  checked={options.format === format}
                  onChange={(e) => setOptions({ ...options, format: e.target.value as ExportOptions["format"] })}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 uppercase">{format}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700 mb-2">Include Options</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeAllocations}
                onChange={(e) => setOptions({ ...options, includeAllocations: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Include IP Allocations</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeStatistics}
                onChange={(e) => setOptions({ ...options, includeStatistics: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Include Statistics</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeMetadata}
                onChange={(e) => setOptions({ ...options, includeMetadata: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Include Metadata</span>
            </label>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">Select Pools</label>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Select All
              </button>
              <span className="text-slate-400">|</span>
              <button
                onClick={selectNone}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Select None
              </button>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left w-12">
                    <input
                      type="checkbox"
                      checked={options.selectedPoolIds.size === pools.length}
                      onChange={(e) => (e.target.checked ? selectAll() : selectNone())}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">CIDR</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">Type</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pools.map((pool) => (
                  <tr key={pool.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={options.selectedPoolIds.has(pool.id)}
                        onChange={() => togglePoolSelection(pool.id)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-900">{pool.cidr}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        pool.type === "public" ? "bg-green-100 text-green-800" :
                        pool.type === "private" ? "bg-blue-100 text-blue-800" :
                        "bg-purple-100 text-purple-800"
                      }`}>
                        {pool.type}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-900">{pool.utilization.percentage.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {options.selectedPoolIds.size} of {pools.length} pools selected
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={handleExport}
            disabled={options.selectedPoolIds.size === 0 || isExporting}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <LoadingSpinner size="sm" />
                Exporting...
              </>
            ) : (
              "Export Pools"
            )}
          </button>
        </div>
      </div>
    </Card>
  );
}

