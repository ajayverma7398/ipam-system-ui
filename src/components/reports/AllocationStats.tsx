"use client";

import { useMemo, useState } from "react";
import { activities } from "@/lib/data/activities";
import { allocations } from "@/lib/data/allocations";
import { allocationStats } from "@/lib/data/allocation-stats";
import Card from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { ClientOnlyChart } from "@/components/common/data-display";

type Period = "7d" | "30d" | "90d" | "1y";

export function AllocationStats() {
  const [period, setPeriod] = useState<Period>("30d");

  const allocationData = useMemo(() => {
    return allocationStats[period] || [];
  }, [period]);

  const totalAllocations = useMemo(() => {
    return allocationData.reduce((sum, day) => sum + day.allocations, 0);
  }, [allocationData]);

  const allocationRate = useMemo(() => {
    const days = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365;
    return Math.round((totalAllocations / days) * 10) / 10;
  }, [totalAllocations, period]);

  const mostActiveAllocators = useMemo(() => {
    const allocatorCounts: Record<string, number> = {};
    
    activities
      .filter((activity) => activity.type === "ip_allocation")
      .forEach((activity) => {
        allocatorCounts[activity.user] = (allocatorCounts[activity.user] || 0) + 1;
      });

    return Object.entries(allocatorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([user, count]) => ({ user, count }));
  }, []);

  const commonAllocationSizes = useMemo(() => {
    const sizeCategories: Record<string, number> = {
      "1 IP": 0,
      "2-10 IPs": 0,
      "11-50 IPs": 0,
      "51-100 IPs": 0,
      "100+ IPs": 0,
    };

    allocations.forEach((alloc) => {
      const pseudoSize = ((alloc.ip_address.split(".").pop() || "0").charCodeAt(0) % 5);
      if (pseudoSize === 0) sizeCategories["1 IP"]++;
      else if (pseudoSize === 1) sizeCategories["2-10 IPs"]++;
      else if (pseudoSize === 2) sizeCategories["11-50 IPs"]++;
      else if (pseudoSize === 3) sizeCategories["51-100 IPs"]++;
      else sizeCategories["100+ IPs"]++;
    });

    return Object.entries(sizeCategories)
      .map(([size, count]) => ({ size, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-1">Total Allocations</p>
            <p className="text-2xl font-bold text-blue-900">{totalAllocations}</p>
            <p className="text-xs text-blue-600 mt-1">In selected period</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-700 mb-1">Allocation Rate</p>
            <p className="text-2xl font-bold text-green-900">{allocationRate} IPs/day</p>
            <p className="text-xs text-green-600 mt-1">Average daily rate</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-medium text-purple-700 mb-1">Active Allocators</p>
            <p className="text-2xl font-bold text-purple-900">{mostActiveAllocators.length}</p>
            <p className="text-xs text-purple-600 mt-1">Unique users</p>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Allocation Trend</h4>
          <ClientOnlyChart className="h-64" style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={allocationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="allocations"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Allocations"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Most Active Allocators</h4>
          <div className="space-y-2">
            {mostActiveAllocators.map((allocator, index) => (
              <div
                key={allocator.user}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-900">{allocator.user}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(allocator.count / mostActiveAllocators[0]!.count) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 w-12 text-right">
                    {allocator.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Common Allocation Sizes</h4>
          <ClientOnlyChart className="h-48" style={{ minHeight: 192 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commonAllocationSizes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="size"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" name="Allocations" />
              </BarChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        </div>
      </div>
    </Card>
  );
}

