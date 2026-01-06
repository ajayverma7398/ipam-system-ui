"use client";

import { useState } from "react";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";
import { LoadingSpinner } from "@/components/common/feedback";

interface BulkAllocationData {
  poolId: string;
  count: number;
  allocationMode: "sequential" | "random";
  startingIP?: string;
  namingPattern: string;
  deviceType: string;
  description: string;
  tags: string[];
  metadata: Record<string, string>;
}

export function BulkAllocate() {
  const { showToast } = useToast();
  const [isAllocating, setIsAllocating] = useState(false);
  const [formData, setFormData] = useState<BulkAllocationData>({
    poolId: "",
    count: 10,
    allocationMode: "sequential",
    namingPattern: "device-{n}",
    deviceType: "server",
    description: "",
    tags: [],
    metadata: {},
  });

  const [tagInput, setTagInput] = useState("");
  const [metaKey, setMetaKey] = useState("");
  const [metaValue, setMetaValue] = useState("");

  const selectedPool = pools.find((p) => p.id === formData.poolId);

  const handleAllocate = async () => {
    if (!formData.poolId) {
      showToast("Please select a pool", "warning");
      return;
    }

    if (formData.count < 1 || formData.count > 1000) {
      showToast("Count must be between 1 and 1000", "warning");
      return;
    }

    setIsAllocating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      showToast(`Successfully allocated ${formData.count} IP address(es)`, "success");
      
      setFormData({
        ...formData,
        count: 10,
        startingIP: "",
        description: "",
        tags: [],
        metadata: {},
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast("Failed to allocate IPs", "error");
    } finally {
      setIsAllocating(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const addMetadata = () => {
    if (metaKey && metaValue) {
      setFormData({
        ...formData,
        metadata: { ...formData.metadata, [metaKey]: metaValue },
      });
      setMetaKey("");
      setMetaValue("");
    }
  };

  const removeMetadata = (key: string) => {
    const newMetadata = { ...formData.metadata };
    delete newMetadata[key];
    setFormData({ ...formData, metadata: newMetadata });
  };

  const generatePreview = () => {
    if (!formData.poolId || formData.count === 0) return [];

    const preview: Array<{ ip: string; hostname: string }> = [];
    const baseIP = formData.startingIP || selectedPool?.network_address || "192.168.1.1";
    const baseParts = baseIP.split(".").map(Number);

    for (let i = 0; i < Math.min(formData.count, 5); i++) {
      const ipParts = [...baseParts];
      ipParts[3] += i;
      const ip = ipParts.join(".");
      const hostname = formData.namingPattern.replace("{n}", String(i + 1).padStart(2, "0"));
      preview.push({ ip, hostname });
    }

    return preview;
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Bulk Allocate IPs</h3>
          <p className="text-sm text-slate-600">Allocate multiple IP addresses at once</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Pool <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.poolId}
            onChange={(e) => setFormData({ ...formData, poolId: e.target.value })}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Number of IPs <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.count}
              onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) || 0 })}
              min={1}
              max={1000}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Allocation Mode</label>
            <select
              value={formData.allocationMode}
              onChange={(e) =>
                setFormData({ ...formData, allocationMode: e.target.value as "sequential" | "random" })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sequential">Sequential (First Available)</option>
              <option value="random">Random</option>
            </select>
          </div>
        </div>

        {formData.allocationMode === "sequential" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Starting IP (Optional)</label>
            <input
              type="text"
              value={formData.startingIP || ""}
              onChange={(e) => setFormData({ ...formData, startingIP: e.target.value })}
              placeholder="e.g., 192.168.1.10 (leave empty for auto)"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            />
            <p className="mt-1 text-xs text-slate-500">
              If not specified, allocation starts from the next available IP
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Hostname Pattern</label>
          <input
            type="text"
            value={formData.namingPattern}
            onChange={(e) => setFormData({ ...formData, namingPattern: e.target.value })}
            placeholder="e.g., web-{n}, server-{n}, db-{n:03}"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-slate-500">
            Use {"{n}"} for sequential number (e.g., web-01, web-02) or {"{n:03}"} for zero-padded (e.g., web-001)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Device Type</label>
          <select
            value={formData.deviceType}
            onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="server">Server</option>
            <option value="router">Router</option>
            <option value="switch">Switch</option>
            <option value="firewall">Firewall</option>
            <option value="vm">Virtual Machine</option>
            <option value="container">Container</option>
            <option value="iot">IoT Device</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Common description for all allocated IPs..."
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="Add a tag..."
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addTag}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Add
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
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

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Common Metadata</label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="text"
              value={metaKey}
              onChange={(e) => setMetaKey(e.target.value)}
              placeholder="Key (e.g., department)"
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={metaValue}
                onChange={(e) => setMetaValue(e.target.value)}
                placeholder="Value"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addMetadata}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
          {Object.keys(formData.metadata).length > 0 && (
            <div className="space-y-2">
              {Object.entries(formData.metadata).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-sm">
                    <span className="font-medium text-slate-900">{key}:</span>{" "}
                    <span className="text-slate-600">{value}</span>
                  </span>
                  <button
                    onClick={() => removeMetadata(key)}
                    className="text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {formData.poolId && formData.count > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">Preview (First 5)</p>
            <div className="space-y-1 text-xs font-mono">
              {generatePreview().map((item, index) => (
                <div key={index} className="text-blue-700">
                  {item.ip} → {item.hostname}
                </div>
              ))}
              {formData.count > 5 && (
                <div className="text-blue-600 italic">... and {formData.count - 5} more</div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={handleAllocate}
            disabled={!formData.poolId || formData.count < 1 || isAllocating}
            className="px-6 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAllocating ? (
              <>
                <LoadingSpinner size="sm" />
                Allocating...
              </>
            ) : (
              `Allocate ${formData.count} IP(s)`
            )}
          </button>
        </div>
      </div>
    </Card>
  );
}

