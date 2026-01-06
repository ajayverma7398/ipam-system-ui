"use client";

import { useState, useMemo } from "react";
import { allocations } from "@/lib/data/allocations";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";
import { LoadingSpinner } from "@/components/common/feedback";
import { DataTable, type Column } from "@/components/common/data-display";

type UpdateType = "metadata" | "lease" | "tags" | "device";

export function BulkUpdate() {
  const { showToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedIPs, setSelectedIPs] = useState<Set<string>>(new Set());
  const [updateType, setUpdateType] = useState<UpdateType>("metadata");
  
  const [filters, setFilters] = useState({
    poolId: "all",
    status: "all",
  });

  const [updateData, setUpdateData] = useState({
    leaseDays: 30,
    tags: [] as string[],
    tagInput: "",
    deviceType: "server",
    metadata: {} as Record<string, string>,
    metaKey: "",
    metaValue: "",
  });

  const filteredAllocations = useMemo(() => {
    return allocations.filter((alloc) => {
      if (filters.poolId !== "all" && alloc.pool_id !== filters.poolId) return false;
      if (filters.status !== "all" && alloc.status !== filters.status) return false;
      return true;
    });
  }, [filters]);

  const handleUpdate = async () => {
    if (selectedIPs.size === 0) {
      showToast("Please select at least one IP", "warning");
      return;
    }

    setIsUpdating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      showToast(`Successfully updated ${selectedIPs.size} IP address(es)`, "success");
      setSelectedIPs(new Set());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast("Failed to update IPs", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const addTag = () => {
    if (updateData.tagInput.trim() && !updateData.tags.includes(updateData.tagInput.trim())) {
      setUpdateData({ ...updateData, tags: [...updateData.tags, updateData.tagInput.trim()], tagInput: "" });
    }
  };

  const removeTag = (tag: string) => {
    setUpdateData({ ...updateData, tags: updateData.tags.filter((t) => t !== tag) });
  };

  const addMetadata = () => {
    if (updateData.metaKey && updateData.metaValue) {
      setUpdateData({
        ...updateData,
        metadata: { ...updateData.metadata, [updateData.metaKey]: updateData.metaValue },
        metaKey: "",
        metaValue: "",
      });
    }
  };

  const removeMetadata = (key: string) => {
    const newMetadata = { ...updateData.metadata };
    delete newMetadata[key];
    setUpdateData({ ...updateData, metadata: newMetadata });
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, { bg: string; text: string }> = {
      allocated: { bg: "bg-red-100", text: "text-red-800" },
      available: { bg: "bg-green-100", text: "text-green-800" },
      reserved: { bg: "bg-yellow-100", text: "text-yellow-800" },
    };
    const config = statusColors[status] || { bg: "bg-slate-100", text: "text-slate-800" };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status}
      </span>
    );
  };

  const columns: Column<typeof allocations[0]>[] = [
    {
      key: "ip_address",
      label: "IP Address",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm font-mono text-slate-900">{value as string}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: unknown) => getStatusBadge(value as string),
    },
    {
      key: "hostname",
      label: "Hostname",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900">{(value as string) || "-"}</span>
      ),
    },
    {
      key: "device_type",
      label: "Device Type",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900 capitalize">{value as string}</span>
      ),
    },
  ];

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Bulk Update IPs</h3>
          <p className="text-sm text-slate-600">Update metadata, tags, and device information for multiple IPs</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Update Type</label>
          <select
            value={updateType}
            onChange={(e) => setUpdateType(e.target.value as UpdateType)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="metadata">Update Metadata</option>
            <option value="lease">Change Lease Duration</option>
            <option value="tags">Add/Remove Tags</option>
            <option value="device">Update Device Information</option>
          </select>
        </div>

        {updateType === "lease" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">New Lease Duration (Days)</label>
            <input
              type="number"
              value={updateData.leaseDays}
              onChange={(e) => setUpdateData({ ...updateData, leaseDays: parseInt(e.target.value) || 30 })}
              min={1}
              max={365}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {updateType === "tags" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={updateData.tagInput}
                onChange={(e) => setUpdateData({ ...updateData, tagInput: e.target.value })}
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
            {updateData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {updateData.tags.map((tag) => (
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

        {updateType === "device" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Device Type</label>
            <select
              value={updateData.deviceType}
              onChange={(e) => setUpdateData({ ...updateData, deviceType: e.target.value })}
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
        )}

        {updateType === "metadata" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Metadata</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                value={updateData.metaKey}
                onChange={(e) => setUpdateData({ ...updateData, metaKey: e.target.value })}
                placeholder="Key"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={updateData.metaValue}
                  onChange={(e) => setUpdateData({ ...updateData, metaValue: e.target.value })}
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
            {Object.keys(updateData.metadata).length > 0 && (
              <div className="space-y-2">
                {Object.entries(updateData.metadata).map(([key, value]) => (
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
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Pool</label>
            <select
              value={filters.poolId}
              onChange={(e) => setFilters({ ...filters, poolId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Pools</option>
              {pools.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {pool.cidr}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="allocated">Allocated</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">
            {selectedIPs.size} of {filteredAllocations.length} selected
          </span>
        </div>

        <DataTable
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          data={filteredAllocations as unknown as Record<string, unknown>[]}
          selectable
          pagination={{ pageSize: 10 }}
          onSelectionChange={(selected) => {
            const selectedIds = new Set(
              Array.from(selected).map((index) => filteredAllocations[index]?.id || "")
            );
            setSelectedIPs(selectedIds);
          }}
          emptyMessage="No IPs found matching the filters"
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={() => setSelectedIPs(new Set())}
            className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Clear Selection
          </button>
          <button
            onClick={handleUpdate}
            disabled={selectedIPs.size === 0 || isUpdating}
            className="px-6 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <LoadingSpinner size="sm" />
                Updating...
              </>
            ) : (
              `Update ${selectedIPs.size} IP(s)`
            )}
          </button>
        </div>
      </div>
    </Card>
  );
}

