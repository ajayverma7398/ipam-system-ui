"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card from "@/components/ui/Card";
import { ClientOnlyChart } from "@/components/common/data-display";
import { utilizationTrend as defaultUtilizationTrend } from "@/lib/data/utilization-trend";

interface UtilizationTrendPoint {
  date: string;
  allocated: number;
  available: number;
  reserved: number;
}

interface UtilizationChartProps {
  data?: UtilizationTrendPoint[];
}

type TimeRange = "7d" | "30d" | "90d" | "1y";

export function UtilizationChart({ data }: UtilizationChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const chartData = (data && data.length > 0) ? data : defaultUtilizationTrend;

  const filteredData = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return [];
    }

    const sortedData = [...chartData].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const mostRecentDate = new Date(sortedData[0].date);
    mostRecentDate.setHours(23, 59, 59, 999);

    const daysToSubtract = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    };
    const cutoffDate = new Date(mostRecentDate);
    cutoffDate.setDate(cutoffDate.getDate() - daysToSubtract[timeRange]);
    cutoffDate.setHours(0, 0, 0, 0);

    const filtered = chartData
      .filter((point) => {
        const pointDate = new Date(point.date);
        pointDate.setHours(12, 0, 0, 0);
        return pointDate >= cutoffDate && pointDate <= mostRecentDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (filtered.length === 0) {
      const limit = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : Math.min(365, sortedData.length);
      return sortedData
        .slice(0, limit)
        .reverse()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return filtered;
  }, [chartData, timeRange]);

  const formattedData = useMemo(
    () =>
      filteredData.map((point) => ({
        ...point,
        date: new Date(point.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      })),
    [filteredData]
  );

  const handleExport = () => {
    const csvContent = [
      ["Date", "Allocated", "Available"].join(","),
      ...formattedData.map((point) =>
        [point.date, point.allocated, point.available].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `utilization-trend-${timeRange}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Utilization Trend
          </h3>
          <button
            onClick={handleExport}
            className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors flex items-center gap-1"
            title="Export chart data as CSV"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export
          </button>
        </div>
        <div className="flex items-end justify-end gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-3 py-1.5 text-sm font-medium border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>
      {formattedData.length === 0 ? (
        <div className="w-full h-80 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-center">
            <p className="text-slate-500 text-sm">No data available for the selected time range</p>
            <p className="text-slate-400 text-xs mt-1">Try selecting a different time range</p>
          </div>
        </div>
      ) : (
        <ClientOnlyChart className="w-full h-80" style={{ minHeight: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                style={{ fontSize: "12px" }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number | undefined) =>
                  value !== undefined ? value.toLocaleString() : ""
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="allocated"
                stroke="#ef4444"
                strokeWidth={2}
                name="Allocated IPs"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="available"
                stroke="#10b981"
                strokeWidth={2}
                name="Available IPs"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ClientOnlyChart>
      )}
    </Card>
  );
}
