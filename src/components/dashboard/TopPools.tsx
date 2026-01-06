"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { UtilizationBar } from "@/components/common/data-display";
import Card from "@/components/ui/Card";

interface TopPool {
  cidr: string;
  utilization: number;
  allocated: number;
  total: number;
  type: string;
  pool_id: string;
}

interface TopPoolsProps {
  pools: TopPool[];
  maxItems?: number;
}

type SortOption = "utilization" | "allocated" | "total";

export function TopPools({ pools, maxItems = 5 }: TopPoolsProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortOption>("utilization");

  const sortedPools = useMemo(() => {
    const sorted = [...pools].sort((a, b) => {
      switch (sortBy) {
        case "utilization":
          return b.utilization - a.utilization;
        case "allocated":
          return b.allocated - a.allocated;
        case "total":
          return b.total - a.total;
        default:
          return 0;
      }
    });
    return sorted.slice(0, maxItems);
  }, [pools, sortBy, maxItems]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "public":
        return "text-green-600 bg-green-50";
      case "private":
        return "text-blue-600 bg-blue-50";
      case "multicast":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Top {maxItems} Utilized Pools</h3>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xs border border-slate-300 rounded px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Sort pools"
          >
            <option value="utilization">By Utilization</option>
            <option value="allocated">By Allocated</option>
            <option value="total">By Pool Size</option>
          </select>
          <button
            onClick={() => router.push("/dashboard/pools")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {sortedPools.map((pool, index) => (
          <div
            key={pool.pool_id}
            onClick={() => router.push(`/dashboard/pools/${encodeURIComponent(pool.cidr)}`)}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-sm font-semibold text-slate-600 shrink-0">#{index + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-slate-900 truncate">{pool.cidr}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded shrink-0 ${getTypeColor(pool.type)}`}>
                    {pool.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {pool.allocated.toLocaleString()} / {pool.total.toLocaleString()} IPs
                </p>
              </div>
            </div>
            <div className="ml-4 w-32 shrink-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-900">{pool.utilization.toFixed(1)}%</span>
              </div>
              <UtilizationBar used={pool.allocated} total={pool.total} showPercentage={false} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
