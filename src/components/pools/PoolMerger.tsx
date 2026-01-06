/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useMemo } from "react";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";
import { ConfirmationModal } from "@/components/common/modals";
import { LoadingSpinner } from "@/components/common/feedback";

type MergeStrategy = "largest-first" | "smallest-first" | "custom";

export function PoolMerger() {
  const { showToast } = useToast();
  const [selectedPoolIds, setSelectedPoolIds] = useState<Set<string>>(new Set());
  const [mergeStrategy, setMergeStrategy] = useState<MergeStrategy>("largest-first");
  const [isMerging, setIsMerging] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const selectedPools = useMemo(() => {
    return pools.filter((p) => selectedPoolIds.has(p.id));
  }, [selectedPoolIds]);

  const mergedCIDR = useMemo(() => {
    if (selectedPools.length < 2) return null;

    const sortedPools = [...selectedPools].sort((a, b) => {
      const aPrefix = parseInt(a.cidr.split("/")[1]);
      const bPrefix = parseInt(b.cidr.split("/")[1]);
      return aPrefix - bPrefix;
    });

    return sortedPools[0].cidr;
  }, [selectedPools]);

  const conflicts = useMemo(() => {
    if (selectedPools.length < 2) return [];

    const conflictsList: Array<{ pool1: string; pool2: string; reason: string }> = [];
    
    for (let i = 0; i < selectedPools.length; i++) {
      for (let j = i + 1; j < selectedPools.length; j++) {
        const pool1 = selectedPools[i];
        const pool2 = selectedPools[j];
        
        if (pool1.network_address === pool2.network_address) {
          conflictsList.push({
            pool1: pool1.cidr,
            pool2: pool2.cidr,
            reason: "Same network address",
          });
        }
      }
    }

    return conflictsList;
  }, [selectedPools]);

  const togglePoolSelection = (poolId: string) => {
    const newSelected = new Set(selectedPoolIds);
    if (newSelected.has(poolId)) {
      newSelected.delete(poolId);
    } else {
      newSelected.add(poolId);
    }
    setSelectedPoolIds(newSelected);
  };

  const handleMerge = async () => {
    if (selectedPools.length < 2) {
      showToast("Please select at least 2 pools to merge", "warning");
      return;
    }

    if (conflicts.length > 0) {
      showToast("Cannot merge pools with conflicts", "error");
      return;
    }

    setIsMerging(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      showToast(`Successfully merged ${selectedPools.length} pools`, "success");
      setSelectedPoolIds(new Set());
      setConfirmModalOpen(false);
    } catch (error) {
      showToast("Merge failed", "error");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <>
      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Merge Pools</h3>
            <p className="text-sm text-slate-600">Combine multiple pools into a single pool</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Merge Strategy</label>
            <select
              value={mergeStrategy}
              onChange={(e) => setMergeStrategy(e.target.value as MergeStrategy)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="largest-first">Largest Network First</option>
              <option value="smallest-first">Smallest Network First</option>
              <option value="custom">Custom CIDR</option>
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Determines which network will be used as the base for the merged pool
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Pools to Merge (Minimum 2)
            </label>
            <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left w-12"></th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">CIDR</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">Type</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">Total Hosts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pools.map((pool) => (
                    <tr key={pool.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedPoolIds.has(pool.id)}
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
                      <td className="px-3 py-2 text-slate-900">{pool.total_hosts.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {selectedPoolIds.size} pool(s) selected
            </p>
          </div>

          {selectedPools.length >= 2 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">Merge Preview</p>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-slate-600">Merged CIDR:</p>
                  <p className="font-mono font-semibold text-slate-900">{mergedCIDR || "Calculating..."}</p>
                </div>
                <div>
                  <p className="text-slate-600">Total Hosts:</p>
                  <p className="font-semibold text-slate-900">
                    {selectedPools.reduce((sum, p) => sum + p.total_hosts, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {conflicts.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-900 mb-2">Conflicts Detected</p>
              <div className="space-y-1">
                {conflicts.map((conflict, index) => (
                  <p key={index} className="text-xs text-red-700">
                    {conflict.pool1} and {conflict.pool2}: {conflict.reason}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setSelectedPoolIds(new Set())}
              className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Clear Selection
            </button>
            <button
              onClick={() => setConfirmModalOpen(true)}
              disabled={selectedPools.length < 2 || conflicts.length > 0}
              className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Merge Pools
            </button>
          </div>
        </div>
      </Card>

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleMerge}
        title="Confirm Pool Merge"
        message={`Are you sure you want to merge ${selectedPools.length} pools? This action cannot be undone. All IP allocations will be transferred to the merged pool.`}
        confirmText={isMerging ? "Merging..." : "Merge"}
        variant="warning"
        isLoading={isMerging}
      />
    </>
  );
}

