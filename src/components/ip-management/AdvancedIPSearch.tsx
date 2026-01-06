"use client";

import { useState, useMemo } from "react";
import { allocations } from "@/lib/data/allocations";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/common/data-display";
import { useToast } from "@/components/ui";

interface SearchCriteria {
  query: string;
  searchType: "ip" | "hostname" | "device" | "mac" | "all" | "regex";
  useRegex: boolean;
  booleanOperator: "AND" | "OR" | "NOT";
  ipRange?: { start: string; end: string };
}

interface SearchFilters {
  status: string[];
  dateRange: { allocatedFrom?: string; allocatedTo?: string; expiresBefore?: string };
  metadata: Record<string, string>;
  poolIds: string[];
  deviceTypes: string[];
}

interface SavedSearch {
  id: string;
  name: string;
  criteria: SearchCriteria;
  filters: SearchFilters;
  createdAt: string;
}

export function AdvancedIPSearch() {
  const { showToast } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [groupBy, setGroupBy] = useState<"none" | "pool" | "status" | "deviceType">("none");
  const [sortBy, setSortBy] = useState<string>("allocated_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());
  
  const [criteria, setCriteria] = useState<SearchCriteria>({
    query: "",
    searchType: "all",
    useRegex: false,
    booleanOperator: "AND",
  });

  const [filters, setFilters] = useState<SearchFilters>({
    status: [],
    dateRange: {},
    metadata: {},
    poolIds: [],
    deviceTypes: [],
  });

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [searchName, setSearchName] = useState("");

  const searchResults = useMemo(() => {
    let results = [...allocations];

    if (criteria.query) {
      const query = criteria.query.toLowerCase();
      const regex = criteria.useRegex ? new RegExp(query, "i") : null;

      results = results.filter((alloc) => {
        if (criteria.useRegex && regex) {
          switch (criteria.searchType) {
            case "ip":
              return regex.test(alloc.ip_address);
            case "hostname":
              return alloc.hostname ? regex.test(alloc.hostname) : false;
            case "device":
              return alloc.device_id ? regex.test(alloc.device_id) : false;
            case "mac":
              return alloc.metadata.mac_address ? regex.test(alloc.metadata.mac_address) : false;
            case "all":
              return (
                regex.test(alloc.ip_address) ||
                (alloc.hostname && regex.test(alloc.hostname)) ||
                (alloc.device_id && regex.test(alloc.device_id)) ||
                (alloc.metadata.mac_address && regex.test(alloc.metadata.mac_address))
              );
            default:
              return false;
          }
        } else {
          switch (criteria.searchType) {
            case "ip":
              return alloc.ip_address.toLowerCase().includes(query);
            case "hostname":
              return alloc.hostname?.toLowerCase().includes(query) || false;
            case "device":
              return alloc.device_id?.toLowerCase().includes(query) || false;
            case "mac":
              return alloc.metadata.mac_address?.toLowerCase().includes(query) || false;
            case "all":
              return (
                alloc.ip_address.toLowerCase().includes(query) ||
                alloc.hostname?.toLowerCase().includes(query) ||
                alloc.device_id?.toLowerCase().includes(query) ||
                alloc.metadata.mac_address?.toLowerCase().includes(query) ||
                alloc.description?.toLowerCase().includes(query)
              );
            default:
              return false;
          }
        }
      });
    }

    if (criteria.ipRange?.start && criteria.ipRange?.end) {
      results = results.filter((alloc) => {
        const ipParts = alloc.ip_address.split(".").map(Number);
        const startParts = criteria.ipRange!.start.split(".").map(Number);
        const endParts = criteria.ipRange!.end.split(".").map(Number);
        
        for (let i = 0; i < 4; i++) {
          if (ipParts[i] < startParts[i] || ipParts[i] > endParts[i]) {
            return false;
          }
        }
        return true;
      });
    }

    if (filters.status.length > 0) {
      results = results.filter((alloc) => filters.status.includes(alloc.status));
    }

    if (filters.dateRange.allocatedFrom) {
      results = results.filter((alloc) => {
        if (!alloc.allocated_at) return false;
        return new Date(alloc.allocated_at) >= new Date(filters.dateRange.allocatedFrom!);
      });
    }
    if (filters.dateRange.allocatedTo) {
      results = results.filter((alloc) => {
        if (!alloc.allocated_at) return false;
        return new Date(alloc.allocated_at) <= new Date(filters.dateRange.allocatedTo!);
      });
    }
    if (filters.dateRange.expiresBefore) {
      results = results.filter((alloc) => {
        if (!alloc.expires_at) return false;
        return new Date(alloc.expires_at) <= new Date(filters.dateRange.expiresBefore!);
      });
    }

    if (filters.poolIds.length > 0) {
      results = results.filter((alloc) => filters.poolIds.includes(alloc.pool_id));
    }

    if (filters.deviceTypes.length > 0) {
      results = results.filter((alloc) => filters.deviceTypes.includes(alloc.device_type));
    }

    Object.entries(filters.metadata).forEach(([key, value]) => {
      if (value) {
        results = results.filter((alloc) => {
          const metaValue = alloc.metadata[key as keyof typeof alloc.metadata];
          return metaValue && String(metaValue).toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    results.sort((a, b) => {
      let comparison = 0;
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];
      
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      
      if (aValue === bValue) return 0;
      comparison = aValue > bValue ? 1 : -1;
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return results;
  }, [criteria, filters, sortBy, sortOrder]);

  const groupedResults = useMemo(() => {
    if (groupBy === "none") {
      return { "All": searchResults };
    }

    const groups: Record<string, typeof searchResults> = {};
    searchResults.forEach((result) => {
      let key = "";
      switch (groupBy) {
        case "pool":
          key = result.pool_id;
          break;
        case "status":
          key = result.status;
          break;
        case "deviceType":
          key = result.device_type;
          break;
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(result);
    });

    return groups;
  }, [searchResults, groupBy]);

  const saveSearch = () => {
    if (!searchName) {
      showToast("Please enter a name for this search", "warning");
      return;
    }

    const saved: SavedSearch = {
      id: Date.now().toString(),
      name: searchName,
      criteria,
      filters,
      createdAt: new Date().toISOString(),
    };

    setSavedSearches([...savedSearches, saved]);
    setSearchName("");
    setShowSavedSearches(false);
    showToast("Search saved successfully", "success");
  };

  const loadSearch = (saved: SavedSearch) => {
    setCriteria(saved.criteria);
    setFilters(saved.filters);
    setShowSavedSearches(false);
    showToast(`Loaded search: ${saved.name}`, "success");
  };

  const deleteSearch = (id: string) => {
    setSavedSearches(savedSearches.filter((s) => s.id !== id));
    showToast("Search deleted", "success");
  };

  const toggleStatusFilter = (status: string) => {
    setFilters({
      ...filters,
      status: filters.status.includes(status)
        ? filters.status.filter((s) => s !== status)
        : [...filters.status, status],
    });
  };

  const togglePoolFilter = (poolId: string) => {
    setFilters({
      ...filters,
      poolIds: filters.poolIds.includes(poolId)
        ? filters.poolIds.filter((p) => p !== poolId)
        : [...filters.poolIds, poolId],
    });
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
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Advanced IP Search</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSavedSearches(!showSavedSearches)}
                className="px-3 py-1.5 text-sm text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Saved Searches ({savedSearches.length})
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-1.5 text-sm text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                {showFilters ? "Hide" : "Show"} Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                value={criteria.query}
                onChange={(e) => setCriteria({ ...criteria, query: e.target.value })}
                placeholder="Enter IP, hostname, device ID, MAC address, or use regex..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={criteria.searchType}
                onChange={(e) => setCriteria({ ...criteria, searchType: e.target.value as SearchCriteria["searchType"] })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Fields</option>
                <option value="ip">IP Address</option>
                <option value="hostname">Hostname</option>
                <option value="device">Device ID</option>
                <option value="mac">MAC Address</option>
                <option value="regex">Regular Expression</option>
              </select>
            </div>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.useRegex}
                  onChange={(e) => setCriteria({ ...criteria, useRegex: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Regex</span>
              </label>
              <button
                onClick={saveSearch}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">IP Range Start</label>
              <input
                type="text"
                value={criteria.ipRange?.start || ""}
                onChange={(e) =>
                  setCriteria({
                    ...criteria,
                    ipRange: { ...criteria.ipRange, start: e.target.value, end: criteria.ipRange?.end || "" },
                  })
                }
                placeholder="e.g., 192.168.1.1"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">IP Range End</label>
              <input
                type="text"
                value={criteria.ipRange?.end || ""}
                onChange={(e) =>
                  setCriteria({
                    ...criteria,
                    ipRange: { ...criteria.ipRange, start: criteria.ipRange?.start || "", end: e.target.value },
                  })
                }
                placeholder="e.g., 192.168.1.100"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
            </div>
          </div>

          {showSavedSearches && (
            <div className="flex gap-2">
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Enter search name..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </Card>

      {showFilters && (
        <Card>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Filters</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <div className="space-y-2">
                {["allocated", "available", "reserved", "expired"].map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => toggleStatusFilter(status)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Allocated From</label>
                  <input
                    type="date"
                    value={filters.dateRange.allocatedFrom || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        dateRange: { ...filters.dateRange, allocatedFrom: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Allocated To</label>
                  <input
                    type="date"
                    value={filters.dateRange.allocatedTo || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        dateRange: { ...filters.dateRange, allocatedTo: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Expires Before</label>
                  <input
                    type="date"
                    value={filters.dateRange.expiresBefore || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        dateRange: { ...filters.dateRange, expiresBefore: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Pools</label>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {pools.map((pool) => (
                  <label key={pool.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.poolIds.includes(pool.id)}
                      onChange={() => togglePoolFilter(pool.id)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 font-mono">{pool.cidr}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {showSavedSearches && savedSearches.length > 0 && (
        <Card>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Saved Searches</h4>
          <div className="space-y-2">
            {savedSearches.map((saved) => (
              <div
                key={saved.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{saved.name}</p>
                  <p className="text-xs text-slate-500">
                    Created: {new Date(saved.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadSearch(saved)}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deleteSearch(saved.id)}
                    className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between bg-linear-to-r from-[#2b6cb0] to-[#2563eb] rounded-lg px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-white">
            {searchResults.length} result(s) found
          </p>
          {selectedResults.size > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
              {selectedResults.size} selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-white/50 rounded-lg px-3 py-2 shadow-sm hover:bg-white transition-colors">
            <svg className="w-4 h-4 text-[#2b6cb0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as typeof groupBy)}
              className="bg-transparent text-slate-700 text-sm font-medium border-none outline-none cursor-pointer appearance-none pr-6 focus:ring-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%232b6cb0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0 center",
                backgroundSize: "16px",
              }}
            >
              <option value="none" className="text-slate-900">No Grouping</option>
              <option value="pool" className="text-slate-900">Group by Pool</option>
              <option value="status" className="text-slate-900">Group by Status</option>
              <option value="deviceType" className="text-slate-900">Group by Device Type</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-white/50 rounded-lg px-3 py-2 shadow-sm hover:bg-white transition-colors">
            <svg className="w-4 h-4 text-[#2b6cb0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-700 text-sm font-medium border-none outline-none cursor-pointer appearance-none pr-6 focus:ring-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%232b6cb0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0 center",
                backgroundSize: "16px",
              }}
            >
              <option value="ip_address" className="text-slate-900">Sort by IP</option>
              <option value="hostname" className="text-slate-900">Sort by Hostname</option>
              <option value="allocated_at" className="text-slate-900">Sort by Allocated Date</option>
              <option value="status" className="text-slate-900">Sort by Status</option>
            </select>
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center justify-center w-10 h-10 bg-white/95 backdrop-blur-sm border border-white/50 rounded-lg hover:bg-white transition-all duration-200 shadow-sm group"
            title={sortOrder === "asc" ? "Ascending" : "Descending"}
          >
            {sortOrder === "asc" ? (
              <svg className="w-5 h-5 text-[#2b6cb0] group-hover:text-[#2563eb] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-[#2b6cb0] group-hover:text-[#2563eb] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {Object.entries(groupedResults).map(([groupName, results]) => (
        <Card key={groupName}>
          {groupBy !== "none" && (
            <h4 className="text-md font-semibold text-slate-900 mb-4">
              {groupName} ({results.length})
            </h4>
          )}
          <DataTable
            columns={columns as unknown as Column<Record<string, unknown>>[]}
            data={results as unknown as Record<string, unknown>[]}
            selectable
            pagination={{ pageSize: 10 }}
            onSelectionChange={(selected) => {
              const selectedIds = new Set(
                Array.from(selected).map((index) => results[index]?.id || "")
              );
              setSelectedResults(selectedIds);
            }}
            emptyMessage="No results found"
          />
        </Card>
      ))}

      {selectedResults.size > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedResults.size} result(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Export
              </button>
              <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Release
              </button>
              <button className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

