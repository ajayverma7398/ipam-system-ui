"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/ui/Card";

interface FilterPreset {
  id: string;
  name: string;
  filters: {
    search?: string;
    type?: string;
    ipClass?: string;
    minUtilization?: number;
    maxUtilization?: number;
    dateFrom?: string;
    dateTo?: string;
  };
}

interface PoolSearchFilterProps {
  onFilterChange?: (filters: Record<string, string>) => void;
}

export function PoolSearchFilter({ onFilterChange }: PoolSearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "all");
  const [ipClassFilter, setIpClassFilter] = useState(searchParams.get("ipClass") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "cidr");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("order") as "asc" | "desc") || "asc"
  );

  const presets: FilterPreset[] = [
    {
      id: "high-utilization",
      name: "High Utilization (>75%)",
      filters: { minUtilization: 75 },
    },
    {
      id: "recent",
      name: "Recently Created",
      // eslint-disable-next-line react-hooks/purity
      filters: { dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] },
    },
    {
      id: "public-pools",
      name: "Public Pools",
      filters: { type: "public" },
    },
  ];

  const updateURL = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/dashboard/pools?${params.toString()}`);
    onFilterChange?.(updates);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateURL({ search: value });
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    updateURL({ type: value });
  };

  const handleIpClassChange = (value: string) => {
    setIpClassFilter(value);
    updateURL({ ipClass: value });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateURL({ sort: value });
  };

  const handleSortOrderChange = (value: "asc" | "desc") => {
    setSortOrder(value);
    updateURL({ order: value });
  };

  const applyPreset = (preset: FilterPreset) => {
    const updates: Record<string, string> = {};
    if (preset.filters.search) updates.search = preset.filters.search;
    if (preset.filters.type) updates.type = preset.filters.type;
    if (preset.filters.ipClass) updates.ipClass = preset.filters.ipClass;
    if (preset.filters.minUtilization) updates.minUtilization = preset.filters.minUtilization.toString();
    if (preset.filters.maxUtilization) updates.maxUtilization = preset.filters.maxUtilization.toString();
    if (preset.filters.dateFrom) updates.dateFrom = preset.filters.dateFrom;
    if (preset.filters.dateTo) updates.dateTo = preset.filters.dateTo;
    
    if (preset.filters.search) setSearchTerm(preset.filters.search);
    if (preset.filters.type) setTypeFilter(preset.filters.type);
    if (preset.filters.ipClass) setIpClassFilter(preset.filters.ipClass);
    
    updateURL(updates);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setIpClassFilter("all");
    setSortBy("cidr");
    setSortOrder("asc");
    router.push("/dashboard/pools");
    onFilterChange?.({});
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (typeFilter !== "all") count++;
    if (ipClassFilter !== "all") count++;
    return count;
  }, [searchTerm, typeFilter, ipClassFilter]);

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
          <input
            type="text"
            placeholder="Search by CIDR, description, or tags..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="multicast">Multicast</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">IP Class</label>
            <select
              value={ipClassFilter}
              onChange={(e) => handleIpClassChange(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Classes</option>
              <option value="A">Class A</option>
              <option value="B">Class B</option>
              <option value="C">Class C</option>
              <option value="D">Class D</option>
              <option value="E">Class E</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="cidr">CIDR</option>
                <option value="utilization">Utilization</option>
                <option value="created_at">Created Date</option>
                <option value="total_hosts">Size</option>
              </select>
              <button
                onClick={() => handleSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
                className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
              >
                <svg
                  className={`w-4 h-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Presets:</span>
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="text-xs px-2 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <span className="text-xs text-slate-500">
                {activeFiltersCount} filter(s) active
              </span>
            )}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs px-2 py-1 text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

