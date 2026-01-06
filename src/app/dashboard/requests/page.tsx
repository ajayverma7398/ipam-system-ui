"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { DataTable, type Column } from "@/components/common/data-display";
import { StatusBadge } from "@/components/common/data-display";
import { useToast } from "@/components/ui";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

interface Request {
  id: string;
  type: "allocation" | "release" | "modification";
  status: "pending" | "approved" | "rejected" | "completed";
  requester: string;
  ip_address?: string;
  pool_id?: string;
  description: string;
  requested_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

const mockRequests: Request[] = [
  {
    id: "req-001",
    type: "allocation",
    status: "pending",
    requester: "user@example.com",
    ip_address: "192.168.1.50",
    pool_id: "pool-001",
    description: "Request for new server IP allocation",
    requested_at: "2024-03-15T09:00:00Z",
  },
  {
    id: "req-002",
    type: "allocation",
    status: "approved",
    requester: "admin@example.com",
    ip_address: "10.0.0.20",
    pool_id: "pool-009",
    description: "IP allocation for new network device",
    requested_at: "2024-03-14T14:30:00Z",
    reviewed_by: "admin@ipam.local",
    reviewed_at: "2024-03-14T15:00:00Z",
  },
  {
    id: "req-003",
    type: "release",
    status: "completed",
    requester: "operator@example.com",
    ip_address: "192.168.1.25",
    pool_id: "pool-001",
    description: "Release IP address from decommissioned device",
    requested_at: "2024-03-13T10:15:00Z",
    reviewed_by: "admin@ipam.local",
    reviewed_at: "2024-03-13T10:30:00Z",
  },
  {
    id: "req-004",
    type: "modification",
    status: "pending",
    requester: "engineer@example.com",
    ip_address: "10.0.0.15",
    pool_id: "pool-009",
    description: "Update hostname for existing IP allocation",
    requested_at: "2024-03-15T08:45:00Z",
  },
  {
    id: "req-005",
    type: "allocation",
    status: "rejected",
    requester: "user@example.com",
    ip_address: "192.168.1.200",
    pool_id: "pool-001",
    description: "IP allocation request - insufficient pool capacity",
    requested_at: "2024-03-12T11:20:00Z",
    reviewed_by: "admin@ipam.local",
    reviewed_at: "2024-03-12T11:45:00Z",
  },
];

export default function RequestsPage() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredRequests = mockRequests.filter((request) => {
    const matchesSearch =
      !searchTerm ||
      request.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.ip_address?.includes(searchTerm) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesType = typeFilter === "all" || request.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadgeType = (status: string) => {
    switch (status) {
      case "pending":
        return "pending";
      case "approved":
        return "available";
      case "rejected":
        return "expired";
      case "completed":
        return "allocated";
      default:
        return "pending";
    }
  };

  const handleViewRequest = (request: Request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleApproveRequest = (request: Request) => {
    console.log("Approving request:", request.id);
    showToast(`Request ${request.id} approved successfully`, "success");
  };

  const handleRejectRequest = (request: Request) => {
    console.log("Rejecting request:", request.id);
    showToast(`Request ${request.id} rejected`, "info");
  };

  const columns: Column<Request>[] = [
    {
      key: "id",
      label: "Request ID",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm font-mono text-slate-900">{value as string}</span>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-700 capitalize">{value as string}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: unknown) => (
        <StatusBadge status={getStatusBadgeType(value as string)} type="pool" />
      ),
    },
    {
      key: "requester",
      label: "Requester",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900">{value as string}</span>
      ),
    },
    {
      key: "ip_address",
      label: "IP Address",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm font-mono text-slate-600">{value as string || "—"}</span>
      ),
    },
    {
      key: "description",
      label: "Description",
      sortable: false,
      render: (value: unknown) => (
        <span className="text-sm text-slate-700">{value as string}</span>
      ),
    },
    {
      key: "requested_at",
      label: "Requested",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-600">
          {new Date(value as string).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_: unknown, row: Request) => (
        <div className="flex items-center gap-2">
          {row.status === "pending" && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApproveRequest(row);
                }}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Approve
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRejectRequest(row);
                }}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Reject
              </button>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewRequest(row);
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col min-h-full">
        <div className="mb-4">
          <Breadcrumb />
        </div>
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by requester, IP, or description..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="allocation">Allocation</option>
                <option value="release">Release</option>
                <option value="modification">Modification</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="overflow-x-auto">
          <div className="min-w-full">
            <DataTable
              columns={columns as unknown as Column<Record<string, unknown>>[]}
              data={filteredRequests as unknown as Record<string, unknown>[]}
              pagination={{ pageSize: 10 }}
              emptyMessage="No requests found."
            />
          </div>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Request Details"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Request ID</label>
                <p className="text-sm text-slate-900 font-mono mt-1">{selectedRequest.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Type</label>
                <p className="text-sm text-slate-900 capitalize mt-1">{selectedRequest.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Status</label>
                <div className="mt-1">
                  <StatusBadge status={getStatusBadgeType(selectedRequest.status)} type="pool" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Requester</label>
                <p className="text-sm text-slate-900 mt-1">{selectedRequest.requester}</p>
              </div>
              {selectedRequest.ip_address && (
                <div>
                  <label className="text-sm font-medium text-slate-600">IP Address</label>
                  <p className="text-sm text-slate-900 font-mono mt-1">{selectedRequest.ip_address}</p>
                </div>
              )}
              {selectedRequest.pool_id && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Pool ID</label>
                  <p className="text-sm text-slate-900 font-mono mt-1">{selectedRequest.pool_id}</p>
                </div>
              )}
              <div className="col-span-2">
                <label className="text-sm font-medium text-slate-600">Description</label>
                <p className="text-sm text-slate-900 mt-1">{selectedRequest.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Requested At</label>
                <p className="text-sm text-slate-900 mt-1">
                  {new Date(selectedRequest.requested_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {selectedRequest.reviewed_at && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Reviewed At</label>
                  <p className="text-sm text-slate-900 mt-1">
                    {new Date(selectedRequest.reviewed_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
              {selectedRequest.reviewed_by && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Reviewed By</label>
                  <p className="text-sm text-slate-900 mt-1">{selectedRequest.reviewed_by}</p>
                </div>
              )}
            </div>
            {selectedRequest.status === "pending" && (
              <div className="flex gap-2 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    handleApproveRequest(selectedRequest);
                    setIsModalOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Approve Request
                </button>
                <button
                  onClick={() => {
                    handleRejectRequest(selectedRequest);
                    setIsModalOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Reject Request
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}

