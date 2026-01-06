/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";
import { ConfirmationModal } from "@/components/common/modals";
import { LoadingSpinner } from "@/components/common/feedback";

type OperationType = "tags" | "type" | "settings" | "delete";

export function BatchOperations() {
  const { showToast } = useToast();
  const [selectedPoolIds, setSelectedPoolIds] = useState<Set<string>>(new Set());
  const [operationType, setOperationType] = useState<OperationType>("tags");
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [poolType, setPoolType] = useState<"public" | "private" | "multicast">("private");

  const selectedPools = pools.filter((p) => selectedPoolIds.has(p.id));

  const togglePoolSelection = (poolId: string) => {
    const newSelected = new Set(selectedPoolIds);
    if (newSelected.has(poolId)) {
      newSelected.delete(poolId);
    } else {
      newSelected.add(poolId);
    }
    setSelectedPoolIds(newSelected);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleOperation = async () => {
    if (selectedPoolIds.size === 0) {
      showToast("Please select at least one pool", "warning");
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let message = "";
      switch (operationType) {
        case "tags":
          message = `Updated tags for ${selectedPoolIds.size} pool(s)`;
          break;
        case "type":
          message = `Changed type to ${poolType} for ${selectedPoolIds.size} pool(s)`;
          break;
        case "settings":
          message = `Updated settings for ${selectedPoolIds.size} pool(s)`;
          break;
        case "delete":
          message = `Deleted ${selectedPoolIds.size} pool(s)`;
          break;
      }

      showToast(message, "success");
      setSelectedPoolIds(new Set());
      setConfirmModalOpen(false);
    } catch (error) {
      showToast("Operation failed", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const getOperationMessage = () => {
    switch (operationType) {
      case "tags":
        return `Update tags for ${selectedPoolIds.size} pool(s)?`;
      case "type":
        return `Change type to ${poolType} for ${selectedPoolIds.size} pool(s)?`;
      case "settings":
        return `Update settings for ${selectedPoolIds.size} pool(s)?`;
      case "delete":
        return `Delete ${selectedPoolIds.size} pool(s)? This action cannot be undone.`;
      default:
        return "";
    }
  };

  return (
    <>
      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Batch Operations</h3>
            <p className="text-sm text-slate-600">Perform operations on multiple pools at once</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Operation Type</label>
            <select
              value={operationType}
              onChange={(e) => setOperationType(e.target.value as OperationType)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="tags">Update Tags</option>
              <option value="type">Change Pool Type</option>
              <option value="settings">Update Settings</option>
              <option value="delete">Delete Pools</option>
            </select>
          </div>

          {operationType === "tags" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Add Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Enter a tag..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-900"
                        type="button"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {operationType === "type" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">New Pool Type</label>
              <select
                value={poolType}
                onChange={(e) => setPoolType(e.target.value as typeof poolType)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="multicast">Multicast</option>
              </select>
            </div>
          )}

          {operationType === "settings" && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-sm text-slate-600">
                Default settings will be applied to all selected pools. This includes allocation policy, lease duration, and integration settings.
              </p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">Select Pools</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedPoolIds(new Set(pools.map((p) => p.id)))}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Select All
                </button>
                <span className="text-slate-400">|</span>
                <button
                  onClick={() => setSelectedPoolIds(new Set())}
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
                        checked={selectedPoolIds.size === pools.length}
                        onChange={(e) =>
                          setSelectedPoolIds(e.target.checked ? new Set(pools.map((p) => p.id)) : new Set())
                        }
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
                      <td className="px-3 py-2 text-slate-900">{pool.utilization.percentage.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {selectedPoolIds.size} of {pools.length} pools selected
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setSelectedPoolIds(new Set())}
              className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Clear Selection
            </button>
            <button
              onClick={() => setConfirmModalOpen(true)}
              disabled={selectedPoolIds.size === 0}
              className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner size="sm" />
                  Processing...
                </>
              ) : (
                `Apply ${operationType === "delete" ? "Delete" : "Operation"}`
              )}
            </button>
          </div>
        </div>
      </Card>

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleOperation}
        title={`Confirm ${operationType === "delete" ? "Delete" : "Operation"}`}
        message={getOperationMessage()}
        confirmText={isProcessing ? "Processing..." : "Confirm"}
        variant={operationType === "delete" ? "danger" : "warning"}
        isLoading={isProcessing}
      />
    </>
  );
}

