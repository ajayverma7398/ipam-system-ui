"use client";

import { useMemo } from "react";
import { activities } from "@/lib/data/activities";
import { allocations } from "@/lib/data/allocations";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ClientOnlyChart } from "@/components/common/data-display";

export function Statistics() {
  const allocationTrends = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    return last30Days.map((date) => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayActivities = activities.filter((activity) => {
        const activityDate = new Date(activity.timestamp);
        return activityDate >= date && activityDate < nextDate;
      });

      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        allocations: dayActivities.filter((a) => a.type === "ip_allocation").length,
        releases: dayActivities.filter((a) => a.type === "ip_release").length,
        netChange: dayActivities.filter((a) => a.type === "ip_allocation").length -
          dayActivities.filter((a) => a.type === "ip_release").length,
      };
    });
  }, []);

  const peakUsagePeriods = useMemo(() => {
    const hourlyCounts: Record<number, number> = {};
    activities
      .filter((a) => a.type === "ip_allocation")
      .forEach((activity) => {
        const hour = new Date(activity.timestamp).getHours();
        hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
      });

    return Object.entries(hourlyCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, []);

  const averageLeaseDuration = useMemo(() => {
    const leasesWithDuration = allocations.filter((alloc) => {
      return alloc.allocated_at && alloc.expires_at;
    });

    if (leasesWithDuration.length === 0) return 0;

    const totalDays = leasesWithDuration.reduce((sum, alloc) => {
      const allocated = new Date(alloc.allocated_at!);
      const expires = new Date(alloc.expires_at!);
      const days = Math.floor((expires.getTime() - allocated.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);

    return Math.round(totalDays / leasesWithDuration.length);
  }, []);

  const utilizationForecast = useMemo(() => {
    const currentUtilization = pools.reduce((sum, pool) => sum + pool.utilization.percentage, 0) / pools.length;
    const growthRate = allocationTrends.slice(-7).reduce((sum, day) => sum + day.netChange, 0) / 7;
    
    const forecast = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      const projectedUtilization = Math.min(100, Math.max(0, currentUtilization + growthRate * (i + 1) * 0.1));
      
      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        utilization: Math.round(projectedUtilization * 10) / 10,
      };
    });

    return forecast;
  }, [allocationTrends]);

  const totalAllocations = activities.filter((a) => a.type === "ip_allocation").length;
  const totalReleases = activities.filter((a) => a.type === "ip_release").length;
  const netAllocations = totalAllocations - totalReleases;

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Statistics & Trends</h3>
          <p className="text-sm text-slate-600">Allocation trends, peak usage, and utilization forecasts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-1">Total Allocations</p>
            <p className="text-2xl font-bold text-blue-900">{totalAllocations}</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-medium text-red-700 mb-1">Total Releases</p>
            <p className="text-2xl font-bold text-red-900">{totalReleases}</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-700 mb-1">Net Allocations</p>
            <p className="text-2xl font-bold text-green-900">{netAllocations}</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-medium text-purple-700 mb-1">Avg Lease Duration</p>
            <p className="text-2xl font-bold text-purple-900">{averageLeaseDuration} days</p>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Allocation Trends (Last 30 Days)</h4>
          <ClientOnlyChart className="h-64" style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={allocationTrends}>
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
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Allocations"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="releases"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Releases"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="netChange"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Net Change"
                  dot={{ r: 3 }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Peak Usage Periods</h4>
          <div className="space-y-2">
            {peakUsagePeriods.map(({ hour, count }, index) => (
              <div key={hour} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {hour}:00 - {hour + 1}:00
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${(count / peakUsagePeriods[0]!.count) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Utilization Forecast (Next 7 Days)</h4>
          <ClientOnlyChart className="h-48" style={{ minHeight: 192 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={utilizationForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  domain={[0, 100]}
                  label={{ value: "Utilization %", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number | undefined) => [
                    value !== undefined ? `${value}%` : "0%",
                    "Projected Utilization",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="utilization"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Projected Utilization"
                  dot={{ r: 4 }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        </div>
      </div>
    </Card>
  );
}

