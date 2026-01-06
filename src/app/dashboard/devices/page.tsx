"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/common/data-display";
import { StatusBadge } from "@/components/common/data-display";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

interface Device {
  id: string;
  name: string;
  ip_address: string;
  mac_address: string;
  type: string;
  status: "online" | "offline" | "unknown";
  location?: string;
  description?: string;
  last_seen: string;
}

const mockDevices: Device[] = [
  {
    id: "dev-001",
    name: "Router-01",
    ip_address: "192.168.1.1",
    mac_address: "00:1B:44:11:3A:B7",
    type: "Router",
    status: "online",
    location: "Data Center A",
    description: "Main network router",
    last_seen: "2024-03-15T10:30:00Z",
  },
  {
    id: "dev-002",
    name: "Switch-01",
    ip_address: "192.168.1.2",
    mac_address: "00:1B:44:11:3A:B8",
    type: "Switch",
    status: "online",
    location: "Data Center A",
    description: "Core switch",
    last_seen: "2024-03-15T10:29:00Z",
  },
  {
    id: "dev-003",
    name: "Firewall-01",
    ip_address: "192.168.1.3",
    mac_address: "00:1B:44:11:3A:B9",
    type: "Firewall",
    status: "online",
    location: "Data Center A",
    description: "Perimeter firewall",
    last_seen: "2024-03-15T10:28:00Z",
  },
  {
    id: "dev-004",
    name: "Server-01",
    ip_address: "10.0.0.10",
    mac_address: "00:1D:60:AB:CD:EF",
    type: "Server",
    status: "online",
    location: "Server Room B",
    description: "Web server",
    last_seen: "2024-03-15T10:25:00Z",
  },
  {
    id: "dev-005",
    name: "Printer-01",
    ip_address: "192.168.1.100",
    mac_address: "00:1E:5C:9A:7B:8C",
    type: "Printer",
    status: "offline",
    location: "Office Floor 2",
    description: "Network printer",
    last_seen: "2024-03-14T15:20:00Z",
  },
];

export default function DevicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredDevices = mockDevices.filter((device) => {
    const matchesSearch =
      !searchTerm ||
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ip_address.includes(searchTerm) ||
      device.mac_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || device.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns: Column<Device>[] = [
    {
      key: "name",
      label: "Device Name",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm font-medium text-slate-900">{value as string}</span>
      ),
    },
    {
      key: "ip_address",
      label: "IP Address",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm font-mono text-slate-900">{value as string}</span>
      ),
    },
    {
      key: "mac_address",
      label: "MAC Address",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm font-mono text-slate-600">{value as string}</span>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-700">{value as string}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: unknown) => (
        <StatusBadge
          status={
            value === "online"
              ? "available"
              : value === "offline"
              ? "expired"
              : "pending"
          }
          type="pool"
        />
      ),
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-600">{value as string || "—"}</span>
      ),
    },
    {
      key: "last_seen",
      label: "Last Seen",
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
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, IP, MAC, or location..."
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
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <DataTable
            columns={columns as unknown as Column<Record<string, unknown>>[]}
            data={filteredDevices as unknown as Record<string, unknown>[]}
            pagination={{ pageSize: 10 }}
            emptyMessage="No devices found. Add devices to start monitoring."
          />
        </Card>
      </div>
  );
}

