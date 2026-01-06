"use client";

import { useMemo, useState } from "react";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { UtilizationBar } from "@/components/common/data-display";

type SortBy = "utilization" | "allocated" | "available" | "name";
type FilterType = "all" | "top" | "underutilized";

export function PoolUtilization() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortBy>("utilization");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const sortedPools = useMemo(() => {
    let filtered = [...pools];

    if (filterType === "top") {
      filtered = filtered
        .sort((a, b) => b.utilization.percentage - a.utilization.percentage)
        .slice(0, 10);
    } else if (filterType === "underutilized") {
      filtered = filtered.filter((pool) => pool.utilization.percentage < 25);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (pool) =>
          pool.cidr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pool.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "utilization":
          return b.utilization.percentage - a.utilization.percentage;
        case "allocated":
          return b.utilization.allocated - a.utilization.allocated;
        case "available":
          return b.utilization.available - a.utilization.available;
        case "name":
          return a.cidr.localeCompare(b.cidr);
        default:
          return 0;
      }
    });

    return filtered;
  }, [sortBy, filterType, searchTerm]);

  const utilizationDistribution = useMemo(() => {
    const ranges = [
      { label: "0-25%", min: 0, max: 25, count: 0 },
      { label: "26-50%", min: 26, max: 50, count: 0 },
      { label: "51-75%", min: 51, max: 75, count: 0 },
      { label: "76-100%", min: 76, max: 100, count: 0 },
    ];

    pools.forEach((pool) => {
      const util = pool.utilization.percentage;
      const range = ranges.find((r) => util >= r.min && util <= r.max);
      if (range) range.count++;
    });

    return ranges;
  }, []);

  const getUtilizationColor = (percentage: number) => {
    if (percentage < 25) return "bg-green-500";
    if (percentage < 50) return "bg-yellow-500";
    if (percentage < 75) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Pool-wise Utilization</h3>
            <p className="text-sm text-slate-600">Detailed utilization metrics by pool</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pools..."
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Pools</option>
              <option value="top">Top 10 Utilized</option>
              <option value="underutilized">Underutilized (&lt;25%)</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="utilization">Sort by Utilization</option>
              <option value="allocated">Sort by Allocated</option>
              <option value="available">Sort by Available</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Utilization Distribution</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {utilizationDistribution.map((range) => (
              <div key={range.label} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{range.label}</span>
                  <span className="text-sm font-semibold text-slate-900">{range.count} pools</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getUtilizationColor((range.min + range.max) / 2)}`}
                    style={{
                      width: `${(range.count / pools.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Pool Details</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedPools.map((pool) => (
              <div
                key={pool.id}
                className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => router.push(`/dashboard/pools/${encodeURIComponent(pool.cidr)}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="text-sm font-semibold text-slate-900 font-mono">{pool.cidr}</h5>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          pool.type === "private"
                            ? "bg-blue-100 text-blue-800"
                            : pool.type === "public"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {pool.type}
                      </span>
                    </div>
                    {pool.description && (
                      <p className="text-xs text-slate-600 mb-2">{pool.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Total: {pool.total_hosts.toLocaleString()}</span>
                      <span>Allocated: {pool.utilization.allocated.toLocaleString()}</span>
                      <span>Available: {pool.utilization.available.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-lg font-bold text-slate-900 mb-1">
                      {pool.utilization.percentage.toFixed(1)}%
                    </div>
                    <div className="w-32">
                      <UtilizationBar
                        used={pool.utilization.allocated}
                        total={pool.total_hosts}
                        showPercentage={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Utilization Heat Map</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {pools.slice(0, 24).map((pool) => (
              <div
                key={pool.id}
                className={`aspect-square rounded-lg flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity ${getUtilizationColor(pool.utilization.percentage)}`}
                title={`${pool.cidr}: ${pool.utilization.percentage.toFixed(1)}%`}
                onClick={() => router.push(`/dashboard/pools/${encodeURIComponent(pool.cidr)}`)}
              >
                {pool.utilization.percentage.toFixed(0)}%
              </div>
            ))}
          </div>
          {pools.length > 24 && (
            <p className="text-xs text-slate-500 mt-2 text-center">
              Showing first 24 pools. Use filters to see more.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

