"use client";

import { useState, useMemo } from "react";
import { allocations } from "@/lib/data/allocations";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

export function RecentAllocations() {
  const { showToast } = useToast();
  const [filterUser, setFilterUser] = useState<string>("all");
  const [filterPool, setFilterPool] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "all">("7d");

  const recentAllocations = useMemo(() => {
    let filtered = [...allocations]
      .filter((alloc) => alloc.allocated_at !== null)
      .sort((a, b) => {
        const dateA = new Date(a.allocated_at || 0).getTime();
        const dateB = new Date(b.allocated_at || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 20);

    if (filterUser !== "all") {
      filtered = filtered.filter((alloc) => alloc.allocated_by === filterUser);
    }

    if (filterPool !== "all") {
      filtered = filtered.filter((alloc) => alloc.pool_id === filterPool);
    }

    if (timeRange !== "all") {
      const now = new Date();
      const cutoff = new Date();
      switch (timeRange) {
        case "24h":
          cutoff.setHours(now.getHours() - 24);
          break;
        case "7d":
          cutoff.setDate(now.getDate() - 7);
          break;
        case "30d":
          cutoff.setDate(now.getDate() - 30);
          break;
      }
      filtered = filtered.filter((alloc) => {
        if (!alloc.allocated_at) return false;
        return new Date(alloc.allocated_at) >= cutoff;
      });
    }

    return filtered;
  }, [filterUser, filterPool, timeRange]);

  const uniqueUsers = useMemo(() => {
    const users = new Set(
      allocations
        .map((a) => a.allocated_by)
        .filter((user): user is string => user != null)
    );
    return Array.from(users);
  }, []);

  const handleRelease = (ipAddress: string) => {
    showToast(`Release IP ${ipAddress}`, "info");
  };

  const handleEdit = (allocation: typeof allocations[0]) => {
    showToast(`Edit allocation for ${allocation.ip_address}`, "info");
  };

  const handleRenew = (allocation: typeof allocations[0]) => {
    showToast(`Renew allocation for ${allocation.ip_address}`, "info");
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Recent Allocations</h3>
            <p className="text-sm text-slate-600">Last 20 IP allocations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">User</label>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Users</option>
              {uniqueUsers.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Pool</label>
            <select
              value={filterPool}
              onChange={(e) => setFilterPool(e.target.value)}
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
            <label className="block text-sm font-medium text-slate-700 mb-2">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {recentAllocations.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No allocations found
            </div>
          ) : (
            recentAllocations.map((alloc) => {
              const pool = pools.find((p) => p.id === alloc.pool_id);
              return (
                <div
                  key={alloc.id}
                  className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono font-semibold text-slate-900">
                          {alloc.ip_address}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            alloc.status === "allocated"
                              ? "bg-red-100 text-red-800"
                              : alloc.status === "available"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {alloc.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                        <div>
                          <span className="font-medium">Hostname:</span> {alloc.hostname || "-"}
                        </div>
                        <div>
                          <span className="font-medium">Device:</span> {alloc.device_id || "-"}
                        </div>
                        <div>
                          <span className="font-medium">Pool:</span> {pool?.cidr || "-"}
                        </div>
                        <div>
                          <span className="font-medium">Allocated:</span>{" "}
                          {alloc.allocated_at
                            ? new Date(alloc.allocated_at).toLocaleDateString()
                            : "-"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(alloc)}
                        className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRenew(alloc)}
                        className="px-2 py-1 text-xs text-green-600 hover:text-green-700"
                        title="Renew"
                      >
                        Renew
                      </button>
                      <button
                        onClick={() => handleRelease(alloc.ip_address)}
                        className="px-2 py-1 text-xs text-red-600 hover:text-red-700"
                        title="Release"
                      >
                        Release
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={() => showToast("Subscription feature coming soon", "info")}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Subscribe to allocation alerts →
          </button>
        </div>
      </div>
    </Card>
  );
}

