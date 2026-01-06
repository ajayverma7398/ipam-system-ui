"use client";

import { useMemo, useState } from "react";
import { activities } from "@/lib/data/activities";
import Card from "@/components/ui/Card";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { ClientOnlyChart } from "@/components/common/data-display";

type TrendPeriod = "3m" | "6m" | "1y" | "2y";

export function TrendAnalysis() {
  const [period, setPeriod] = useState<TrendPeriod>("1y");

  const trendData = useMemo(() => {
    const months = period === "3m" ? 3 : period === "6m" ? 6 : period === "1y" ? 12 : 24;
    
    return Array.from({ length: months }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (months - i - 1));
      
      const baseUtilization = 65;
      const seasonalVariation = Math.sin((i / months) * Math.PI * 2) * 10; // Seasonal pattern
      const growthTrend = (i / months) * 5; // Growth over time
      const pseudoRandom = ((i * 7 + 13) % 100) / 100; // Deterministic variation
      const randomVariation = (pseudoRandom - 0.5) * 5; // Random noise
      
      const utilization = Math.max(0, Math.min(100, baseUtilization + seasonalVariation + growthTrend + randomVariation));
      
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const monthAllocations = activities.filter((activity) => {
        const activityDate = new Date(activity.timestamp);
        return (
          activity.type === "ip_allocation" &&
          activityDate >= monthStart &&
          activityDate <= monthEnd
        );
      }).length;

      return {
        month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        utilization: Math.round(utilization * 10) / 10,
        allocations: monthAllocations,
        growth: i > 0 ? utilization - (baseUtilization + seasonalVariation + (i - 1) / months * 5) : 0,
      };
    });
  }, [period]);

  const anomalies = useMemo(() => {
    const anomalies: Array<{ month: string; type: string; value: number }> = [];
    
    trendData.forEach((point, index) => {
      if (index === 0) return;
      
      const prevUtil = trendData[index - 1]!.utilization;
      const change = Math.abs(point.utilization - prevUtil);
      
      if (change > 15) {
        anomalies.push({
          month: point.month,
          type: point.utilization > prevUtil ? "spike" : "drop",
          value: point.utilization,
        });
      }
    });
    
    return anomalies;
  }, [trendData]);

  const seasonalPattern = useMemo(() => {
    const monthlyAverages: Record<number, number[]> = {};
    
    trendData.forEach((point) => {
      const month = new Date(point.month).getMonth();
      if (!monthlyAverages[month]) monthlyAverages[month] = [];
      monthlyAverages[month].push(point.utilization);
    });
    
    return Object.entries(monthlyAverages).map(([month, values]) => ({
      month: new Date(2024, parseInt(month), 1).toLocaleDateString("en-US", { month: "short" }),
      averageUtilization: values.reduce((sum, val) => sum + val, 0) / values.length,
    }));
  }, [trendData]);

  const correlationEvents = useMemo(() => {
    return [
      { month: "Jan 2024", event: "Q1 Planning", utilization: 58.2, impact: "high" },
      { month: "Mar 2024", event: "Product Launch", utilization: 72.5, impact: "high" },
      { month: "Jun 2024", event: "Infrastructure Expansion", utilization: 68.1, impact: "medium" },
    ];
  }, []);

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Trend Analysis</h3>
            <p className="text-sm text-slate-600">Utilization trends, patterns, and anomalies</p>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as TrendPeriod)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="3m">Last 3 months</option>
            <option value="6m">Last 6 months</option>
            <option value="1y">Last year</option>
            <option value="2y">Last 2 years</option>
          </select>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Utilization Trend Over Time</h4>
          <ClientOnlyChart className="h-64" style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorUtilization" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
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
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="utilization"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorUtilization)"
                  name="Utilization %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Seasonal Pattern</h4>
          <ClientOnlyChart className="h-48" style={{ minHeight: 192 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonalPattern}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
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
                    "Average Utilization",
                  ]}
                />
                <Bar dataKey="averageUtilization" fill="#8b5cf6" name="Average Utilization %" />
              </BarChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        </div>

        {anomalies.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">Anomalies Detected</h4>
            <div className="space-y-2">
              {anomalies.map((anomaly, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    anomaly.type === "spike"
                      ? "bg-red-50 border border-red-200"
                      : "bg-yellow-50 border border-yellow-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {anomaly.type === "spike" ? "⚠️ Utilization Spike" : "⚠️ Utilization Drop"}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">{anomaly.month}</p>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{anomaly.value.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Business Event Correlation</h4>
          <div className="space-y-2">
            {correlationEvents.map((event, index) => (
              <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{event.event}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{event.month}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900">{event.utilization}%</span>
                    <span
                      className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                        event.impact === "high"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {event.impact} impact
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

