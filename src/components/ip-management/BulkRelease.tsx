"use client";

import { useState, useMemo } from "react";
import { allocations } from "@/lib/data/allocations";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";
import { ConfirmationModal } from "@/components/common/modals";
import { DataTable, type Column } from "@/components/common/data-display";

export function BulkRelease() {
  const { showToast } = useToast();
  const [isReleasing, setIsReleasing] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedIPs, setSelectedIPs] = useState<Set<string>>(new Set());
  
  const [filters, setFilters] = useState({
    poolId: "all",
    deviceType: "all",
    ageDays: "",
    status: "allocated",
  });

  const [scheduleRelease, setScheduleRelease] = useState(false);
  const [releaseDate, setReleaseDate] = useState("");

  const filteredAllocations = useMemo(() => {
    return allocations.filter((alloc) => {
      if (filters.poolId !== "all" && alloc.pool_id !== filters.poolId) return false;
      if (filters.deviceType !== "all" && alloc.device_type !== filters.deviceType) return false;
      if (filters.status !== "all" && alloc.status !== filters.status) return false;
      
      if (filters.ageDays) {
        if (!alloc.allocated_at) return false;
        const age = Math.floor(
          (Date.now() - new Date(alloc.allocated_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (age < parseInt(filters.ageDays)) return false;
      }

      return true;
    });
  }, [filters]);

  const impactAnalysis = useMemo(() => {
    const selected = filteredAllocations.filter((alloc) => selectedIPs.has(alloc.id));
    const poolsAffected = new Set(selected.map((a) => a.pool_id));
    const deviceTypes = new Set(selected.map((a) => a.device_type));

    return {
      count: selected.length,
      poolsAffected: poolsAffected.size,
      deviceTypes: Array.from(deviceTypes),
    };
  }, [selectedIPs, filteredAllocations]);

  const handleRelease = async () => {
    setIsReleasing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      showToast(`Successfully released ${selectedIPs.size} IP address(es)`, "success");
      setSelectedIPs(new Set());
      setConfirmModalOpen(false);
    } catch {
      showToast("Failed to release IPs", "error");
    } finally {
      setIsReleasing(false);
    }
  };

  const selectAll = () => {
    setSelectedIPs(new Set(filteredAllocations.map((a) => a.id)));
  };

  const selectNone = () => {
    setSelectedIPs(new Set());
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, { bg: string; text: string }> = {
      allocated: { bg: "bg-red-100", text: "text-red-800" },
      available: { bg: "bg-green-100", text: "text-green-800" },
      reserved: { bg: "bg-yellow-100", text: "text-yellow-800" },
      expired: { bg: "bg-slate-100", text: "text-slate-800" },
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
    {
      key: "allocated_at",
      label: "Allocated",
      sortable: true,
      render: (value: unknown) => {
        if (!value) return <span className="text-sm text-slate-900">-</span>;
        const date = new Date(value as string);
        const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
        return (
          <span className="text-sm text-slate-900">
            {date.toLocaleDateString()} ({daysAgo} days ago)
          </span>
        );
      },
    },
  ];

  return (
    <>
      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Bulk Release IPs</h3>
            <p className="text-sm text-slate-600">Release multiple IP addresses at once</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Device Type</label>
              <select
                value={filters.deviceType}
                onChange={(e) => setFilters({ ...filters, deviceType: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Types</option>
                <option value="server">Server</option>
                <option value="router">Router</option>
                <option value="switch">Switch</option>
                <option value="firewall">Firewall</option>
                <option value="vm">VM</option>
                <option value="container">Container</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Age (Days)</label>
              <input
                type="number"
                value={filters.ageDays}
                onChange={(e) => setFilters({ ...filters, ageDays: e.target.value })}
                placeholder="e.g., 30"
                min={0}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
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

          <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <input
              type="checkbox"
              id="scheduleRelease"
              checked={scheduleRelease}
              onChange={(e) => setScheduleRelease(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="scheduleRelease" className="text-sm font-medium text-slate-700 cursor-pointer">
              Schedule Release for Future
            </label>
            {scheduleRelease && (
              <input
                type="datetime-local"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="ml-auto px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={selectAll}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Select All
              </button>
              <span className="text-slate-400">|</span>
              <button
                onClick={selectNone}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Select None
              </button>
            </div>
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

          {selectedIPs.size > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-900 mb-2">Impact Analysis</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-yellow-700">IPs to Release:</span>{" "}
                  <span className="font-semibold text-yellow-900">{impactAnalysis.count}</span>
                </div>
                <div>
                  <span className="text-yellow-700">Pools Affected:</span>{" "}
                  <span className="font-semibold text-yellow-900">{impactAnalysis.poolsAffected}</span>
                </div>
                <div>
                  <span className="text-yellow-700">Device Types:</span>{" "}
                  <span className="font-semibold text-yellow-900">
                    {impactAnalysis.deviceTypes.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setSelectedIPs(new Set())}
              className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Clear Selection
            </button>
            <button
              onClick={() => setConfirmModalOpen(true)}
              disabled={selectedIPs.size === 0}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Release Selected IPs
            </button>
          </div>
        </div>
      </Card>

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleRelease}
        title="Confirm Bulk Release"
        message={`Are you sure you want to release ${selectedIPs.size} IP address(es)? This action will make these IPs available for re-allocation.`}
        confirmText={isReleasing ? "Releasing..." : "Release"}
        variant="danger"
        isLoading={isReleasing}
      />
    </>
  );
}

