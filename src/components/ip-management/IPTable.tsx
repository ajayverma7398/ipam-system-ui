"use client";

import { useState, useMemo } from "react";
import { DataTable, type Column } from "@/components/common/data-display";
import { AllocateIPModal, BulkAllocateModal } from "@/components/modals";
import Card from "@/components/ui/Card";
import { type IPAllocation } from "@/lib/data/allocations";

interface IPTableProps {
  allocations: IPAllocation[];
  poolId: string;
  onAllocateIP?: (ipData: {
    ip_address: string;
    hostname?: string;
    device_id?: string;
    description?: string;
  }) => Promise<void>;
  onBulkAllocate?: (count: number, pattern: {
    starting_ip?: string;
    mode: "sequential" | "random";
  }) => Promise<void>;
  onReleaseIP?: (ipAddress: string) => Promise<void>;
}

export function IPTable({
  allocations,
  poolId,
  onAllocateIP,
  onBulkAllocate,
  onReleaseIP,
}: IPTableProps) {
  void onAllocateIP;
  void onBulkAllocate;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [allocateModalOpen, setAllocateModalOpen] = useState(false);
  const [bulkAllocateModalOpen, setBulkAllocateModalOpen] = useState(false);

  const filteredAllocations = useMemo(() => {
    return allocations.filter((alloc) => {
      const matchesSearch =
        !searchTerm ||
        alloc.ip_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (alloc.hostname && alloc.hostname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (alloc.device_id && alloc.device_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (alloc.description && alloc.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === "all" || alloc.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allocations, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, { bg: string; text: string }> = {
      allocated: { bg: "bg-red-100", text: "text-red-800" },
      available: { bg: "bg-green-100", text: "text-green-800" },
      reserved: { bg: "bg-yellow-100", text: "text-yellow-800" },
      expired: { bg: "bg-slate-100", text: "text-slate-800" },
      pending: { bg: "bg-orange-100", text: "text-orange-800" },
      system: { bg: "bg-purple-100", text: "text-purple-800" },
    };
    const config = statusColors[status] || { bg: "bg-slate-100", text: "text-slate-800" };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status}
      </span>
    );
  };

  const columns: Column<IPAllocation>[] = [
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
      key: "device_id",
      label: "Device",
      sortable: true,
      render: (_: unknown, row: IPAllocation) => (
        <div>
          <div className="text-sm text-slate-900">{row.device_id || "-"}</div>
          {row.device_type && (
            <div className="text-xs text-slate-500">{row.device_type}</div>
          )}
        </div>
      ),
    },
    {
      key: "allocated_at",
      label: "Allocated Date",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900">
          {value ? new Date(value as string).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_: unknown, row: IPAllocation) => (
        <div className="flex items-center gap-2">
          {row.status === "allocated" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReleaseIP?.(row.ip_address);
              }}
              className="text-xs text-red-600 hover:text-red-700"
              title="Release IP"
            >
              Release
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <input
              type="text"
              placeholder="Search by IP, hostname, device ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="allocated">Allocated</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBulkAllocateModalOpen(true)}
              className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-sm"
            >
              Bulk Allocate
            </button>
            <button
              onClick={() => setAllocateModalOpen(true)}
              className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors text-sm"
            >
              Allocate IP
            </button>
          </div>
        </div>

        <DataTable
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          data={filteredAllocations as unknown as Record<string, unknown>[]}
          pagination={{ pageSize: 10 }}
          emptyMessage="No IP addresses found"
        />
      </Card>

      <AllocateIPModal
        isOpen={allocateModalOpen}
        onClose={() => setAllocateModalOpen(false)}
        poolCidr={poolId}
      />
      <BulkAllocateModal
        isOpen={bulkAllocateModalOpen}
        onClose={() => setBulkAllocateModalOpen(false)}
        poolCidr={poolId}
      />
    </>
  );
}

