"use client";

import { useState, useMemo } from "react";
import { pools } from "@/lib/data/pools";
import { UtilizationBar } from "@/components/common/data-display";

interface PoolSelectorProps {
  selectedPoolId: string;
  onSelect: (poolId: string) => void;
  suggestedPools?: string[];
}

export function PoolSelector({ selectedPoolId, onSelect, suggestedPools = [] }: PoolSelectorProps) {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "available" | "utilization">("available");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPools = useMemo(() => {
    const filtered = pools.filter((pool) => {
      const matchesType = typeFilter === "all" || pool.type === typeFilter;
      const matchesSearch =
        !searchTerm ||
        pool.cidr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pool.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesType && matchesSearch;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "available":
          return b.utilization.available - a.utilization.available;
        case "utilization":
          return b.utilization.percentage - a.utilization.percentage;
        default:
          return a.cidr.localeCompare(b.cidr);
      }
    });

    return filtered;
  }, [typeFilter, searchTerm, sortBy]);

  const suggestedPoolsList = useMemo(() => {
    return pools.filter((pool) => suggestedPools.includes(pool.id));
  }, [suggestedPools]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Select Pool</h3>
        <p className="text-sm text-slate-600">Choose a pool to allocate IP from</p>
      </div>

      {suggestedPoolsList.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Suggested Pools</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedPoolsList.map((pool) => (
              <button
                key={pool.id}
                onClick={() => onSelect(pool.id)}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  selectedPoolId === pool.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-semibold text-slate-900">{pool.cidr}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      pool.type === "public"
                        ? "bg-green-100 text-green-800"
                        : pool.type === "private"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {pool.type}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-2">{pool.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-600">Available:</span>
                  <span className="font-semibold text-green-600">{pool.utilization.available}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search pools..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
            <option value="multicast">Multicast</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="available">Most Available</option>
            <option value="utilization">Highest Utilization</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredPools.map((pool) => (
          <button
            key={pool.id}
            onClick={() => onSelect(pool.id)}
            className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
              selectedPoolId === pool.id
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-mono font-semibold text-slate-900">{pool.cidr}</span>
                <span
                  className={`ml-2 px-2 py-0.5 rounded text-xs ${
                    pool.type === "public"
                      ? "bg-green-100 text-green-800"
                      : pool.type === "private"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {pool.type}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-900">
                  {pool.utilization.available} available
                </div>
                <div className="text-xs text-slate-500">
                  {pool.utilization.percentage.toFixed(1)}% utilized
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-2">{pool.description}</p>
            <div className="mb-2">
              <UtilizationBar
                used={pool.utilization.allocated}
                total={pool.total_hosts}
                showPercentage={false}
              />
            </div>
            {pool.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {pool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

