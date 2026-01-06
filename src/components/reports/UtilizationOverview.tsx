"use client";

import { useMemo, useState } from "react";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ClientOnlyChart } from "@/components/common/data-display";

type DateRange = "7d" | "30d" | "90d" | "1y";
type Grouping = "daily" | "weekly" | "monthly";

export function UtilizationOverview() {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [grouping, setGrouping] = useState<Grouping>("daily");

  const overallStats = useMemo(() => {
    const totalHosts = pools.reduce((sum, pool) => sum + pool.total_hosts, 0);
    const totalAllocated = pools.reduce((sum, pool) => sum + pool.utilization.allocated, 0);
    const totalAvailable = pools.reduce((sum, pool) => sum + pool.utilization.available, 0);
    const totalReserved = pools.reduce((sum, pool) => sum + pool.utilization.reserved, 0);
    const overallUtilization = (totalAllocated / totalHosts) * 100;

    return {
      totalHosts,
      totalAllocated,
      totalAvailable,
      totalReserved,
      overallUtilization: Math.round(overallUtilization * 10) / 10,
    };
  }, []);

  const utilizationTrend = useMemo(() => {
    const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : dateRange === "90d" ? 90 : 365;
    const points = grouping === "daily" ? days : grouping === "weekly" ? Math.ceil(days / 7) : Math.ceil(days / 30);

    return Array.from({ length: points }, (_, i) => {
      const baseUtilization = overallStats.overallUtilization;
      const variation = Math.sin((i / points) * Math.PI * 2) * 5;
      const trend = (i / points) * 2;
      
      return {
        period: grouping === "daily" 
          ? `Day ${i + 1}`
          : grouping === "weekly"
          ? `Week ${i + 1}`
          : `Month ${i + 1}`,
        utilization: Math.max(0, Math.min(100, baseUtilization + variation + trend)),
        allocated: Math.round(overallStats.totalAllocated * (1 + (variation + trend) / 100)),
        available: Math.round(overallStats.totalAvailable * (1 - (variation + trend) / 100)),
      };
    });
  }, [dateRange, grouping, overallStats]);

  const peakUtilization = useMemo(() => {
    const maxUtil = Math.max(...utilizationTrend.map((d) => d.utilization));
    const peakPeriod = utilizationTrend.find((d) => d.utilization === maxUtil);
    return { period: peakPeriod?.period || "N/A", utilization: maxUtil };
  }, [utilizationTrend]);

  const growthRate = useMemo(() => {
    if (utilizationTrend.length < 2) return 0;
    const first = utilizationTrend[0]!.utilization;
    const last = utilizationTrend[utilizationTrend.length - 1]!.utilization;
    return Math.round(((last - first) / first) * 100 * 10) / 10;
  }, [utilizationTrend]);

  const hourlyUtilization = useMemo(() => {
    return Array.from({ length: 24 }, (_, hour) => {
      const pseudoRandom = ((hour * 7 + 13) % 100) / 100;
      return {
        hour: `${hour}:00`,
        utilization: 50 + Math.sin((hour / 24) * Math.PI * 2) * 20 + pseudoRandom * 10,
        allocations: Math.round(10 + Math.sin((hour / 24) * Math.PI * 2) * 5),
      };
    });
  }, []);

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Overall Utilization</h3>
            <p className="text-sm text-slate-600">System-wide utilization metrics and trends</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <select
              value={grouping}
              onChange={(e) => setGrouping(e.target.value as Grouping)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-1">Overall Utilization</p>
            <p className="text-2xl font-bold text-blue-900">{overallStats.overallUtilization}%</p>
            <p className="text-xs text-blue-600 mt-1">
              {overallStats.totalAllocated.toLocaleString()} / {overallStats.totalHosts.toLocaleString()} IPs
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-700 mb-1">Available IPs</p>
            <p className="text-2xl font-bold text-green-900">{overallStats.totalAvailable.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">
              {((overallStats.totalAvailable / overallStats.totalHosts) * 100).toFixed(1)}% of total
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs font-medium text-yellow-700 mb-1">Peak Utilization</p>
            <p className="text-2xl font-bold text-yellow-900">{peakUtilization.utilization.toFixed(1)}%</p>
            <p className="text-xs text-yellow-600 mt-1">Period: {peakUtilization.period}</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-medium text-purple-700 mb-1">Growth Rate</p>
            <p className="text-2xl font-bold text-purple-900">
              {growthRate > 0 ? "+" : ""}{growthRate}%
            </p>
            <p className="text-xs text-purple-600 mt-1">Over selected period</p>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Utilization Trend</h4>
          <ClientOnlyChart className="h-64" style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={utilizationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="period"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
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
                    value !== undefined ? `${value.toFixed(1)}%` : "0%",
                    "Utilization",
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="utilization"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Utilization %"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Peak Utilization Times (24-hour pattern)</h4>
          <ClientOnlyChart className="h-48" style={{ minHeight: 192 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyUtilization}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="hour"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number | undefined) => [
                    value !== undefined ? `${value.toFixed(1)}%` : "0%",
                    "Utilization",
                  ]}
                />
                <Bar dataKey="utilization" fill="#3b82f6" name="Utilization %" />
              </BarChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">IP Distribution</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Allocated</span>
                <span className="text-sm font-semibold text-slate-900">
                  {overallStats.totalAllocated.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${(overallStats.totalAllocated / overallStats.totalHosts) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Available</span>
                <span className="text-sm font-semibold text-slate-900">
                  {overallStats.totalAvailable.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${(overallStats.totalAvailable / overallStats.totalHosts) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Reserved</span>
                <span className="text-sm font-semibold text-slate-900">
                  {overallStats.totalReserved.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${(overallStats.totalReserved / overallStats.totalHosts) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

