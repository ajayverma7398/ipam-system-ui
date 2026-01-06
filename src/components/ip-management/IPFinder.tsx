"use client";

import { useState, useMemo } from "react";
import { allocations } from "@/lib/data/allocations";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/common/data-display";
import { useToast } from "@/components/ui";

interface SearchFilters {
  query: string;
  searchType: "ip" | "hostname" | "device_id" | "mac" | "all";
  poolId: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

export function IPFinder() {
  const { showToast } = useToast();
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    searchType: "all",
    poolId: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [savedQueries, setSavedQueries] = useState<string[]>([]);

  const searchResults = useMemo(() => {
    if (!filters.query && filters.poolId === "all" && filters.status === "all") {
      return [];
    }

    return allocations.filter((alloc) => {
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const matchesQuery =
          filters.searchType === "all" ||
          filters.searchType === "ip"
            ? alloc.ip_address.toLowerCase().includes(query)
            : filters.searchType === "hostname"
            ? alloc.hostname?.toLowerCase().includes(query) || false
            : filters.searchType === "device_id"
            ? alloc.device_id?.toLowerCase().includes(query) || false
            : filters.searchType === "mac"
            ? alloc.metadata.mac_address?.toLowerCase().includes(query) || false
            : false;

        if (!matchesQuery) return false;
      }

      if (filters.poolId !== "all" && alloc.pool_id !== filters.poolId) {
        return false;
      }

      if (filters.status !== "all" && alloc.status !== filters.status) {
        return false;
      }

      if (filters.dateFrom && alloc.allocated_at) {
        if (new Date(alloc.allocated_at) < new Date(filters.dateFrom)) {
          return false;
        }
      }
      if (filters.dateTo && alloc.allocated_at) {
        if (new Date(alloc.allocated_at) > new Date(filters.dateTo)) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const saveQuery = () => {
    if (!filters.query) {
      showToast("Please enter a search query", "warning");
      return;
    }
    setSavedQueries([...savedQueries, filters.query]);
    showToast("Query saved", "success");
  };

  const loadQuery = (query: string) => {
    setFilters({ ...filters, query });
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
      key: "device_id",
      label: "Device",
      sortable: true,
      render: (_: unknown, row: typeof allocations[0]) => (
        <div>
          <div className="text-sm text-slate-900">{row.device_id || "-"}</div>
          {row.device_type && (
            <div className="text-xs text-slate-500">{row.device_type}</div>
          )}
        </div>
      ),
    },
    {
      key: "pool_id",
      label: "Pool",
      sortable: true,
      render: (value: unknown) => {
        const pool = pools.find((p) => p.id === value);
        return <span className="text-sm text-slate-900">{pool?.cidr || value as string}</span>;
      },
    },
    {
      key: "allocated_at",
      label: "Allocated",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-slate-900">
          {value ? new Date(value as string).toLocaleDateString() : "-"}
        </span>
      ),
    },
  ];

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">IP Finder</h3>
          <p className="text-sm text-slate-600">Search for IP addresses across all pools</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                placeholder="Enter IP address, hostname, device ID, or MAC address..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={filters.searchType}
                onChange={(e) => setFilters({ ...filters, searchType: e.target.value as SearchFilters["searchType"] })}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Fields</option>
                <option value="ip">IP Address</option>
                <option value="hostname">Hostname</option>
                <option value="device_id">Device ID</option>
                <option value="mac">MAC Address</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Pool</label>
            <select
              value={filters.poolId}
              onChange={(e) => setFilters({ ...filters, poolId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="allocated">Allocated</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {savedQueries.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">Saved Queries</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {savedQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => loadQuery(query)}
                  className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={saveQuery}
            className="px-4 py-2 text-sm text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Save Query
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">
              {searchResults.length} result(s) found
            </span>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div>
            <DataTable
              columns={columns as unknown as Column<Record<string, unknown>>[]}
              data={searchResults as unknown as Record<string, unknown>[]}
              pagination={{ pageSize: 10 }}
              emptyMessage="No results found"
            />
          </div>
        )}

        {searchResults.length === 0 && filters.query && (
          <div className="text-center py-8 text-slate-500">
            No IP addresses found matching your criteria
          </div>
        )}
      </div>
    </Card>
  );
}

