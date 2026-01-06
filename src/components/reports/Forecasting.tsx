"use client";

import { useMemo, useState } from "react";
import { pools } from "@/lib/data/pools";
import { forecast } from "@/lib/data/forecast";
import Card from "@/components/ui/Card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { ClientOnlyChart } from "@/components/common/data-display";

type ForecastPeriod = "1m" | "3m" | "6m" | "1y";
type Scenario = "current" | "optimistic" | "pessimistic";

export function Forecasting() {
  const [period, setPeriod] = useState<ForecastPeriod>("3m");
  const [scenario, setScenario] = useState<Scenario>("current");

  const currentUtilization = useMemo(() => {
    const totalHosts = pools.reduce((sum, pool) => sum + pool.total_hosts, 0);
    const totalAllocated = pools.reduce((sum, pool) => sum + pool.utilization.allocated, 0);
    return (totalAllocated / totalHosts) * 100;
  }, []);

  const forecastData = useMemo(() => {
    const months = period === "1m" ? 1 : period === "3m" ? 3 : period === "6m" ? 6 : 12;
    
    const dataPoints = forecast.slice(0, months + 1);
    
    return dataPoints.map((point) => ({
      month: point.month,
      utilization: scenario === "optimistic" ? point.optimistic : scenario === "pessimistic" ? point.pessimistic : point.projected,
      availableIPs: point.availableIPs,
      capacityLimit: 100,
    }));
  }, [period, scenario]);

  const capacityExhaustion = useMemo(() => {
    const growthRate = scenario === "optimistic" ? 0.5 : scenario === "pessimistic" ? 2.5 : 1.5;
    if (growthRate <= 0) return null;
    
    const monthsToExhaustion = (100 - currentUtilization) / growthRate;
    const exhaustionDate = new Date();
    exhaustionDate.setMonth(exhaustionDate.getMonth() + monthsToExhaustion);
    
    return {
      months: Math.round(monthsToExhaustion * 10) / 10,
      date: exhaustionDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
  }, [scenario, currentUtilization]);

  const recommendations = useMemo(() => {
    const recs: Array<{ type: string; message: string; priority: "high" | "medium" | "low" }> = [];
    
    if (currentUtilization > 80) {
      recs.push({
        type: "capacity",
        message: "High utilization detected. Consider adding new IP pools or expanding existing ones.",
        priority: "high",
      });
    }
    
    if (capacityExhaustion && capacityExhaustion.months < 6) {
      recs.push({
        type: "urgent",
        message: `Capacity exhaustion projected in ${capacityExhaustion.months.toFixed(1)} months. Immediate action required.`,
        priority: "high",
      });
    }
    
    const underutilizedPools = pools.filter((p) => p.utilization.percentage < 25);
    if (underutilizedPools.length > 0) {
      recs.push({
        type: "optimization",
        message: `${underutilizedPools.length} pools are underutilized. Consider consolidating or reallocating resources.`,
        priority: "medium",
      });
    }
    
    if (currentUtilization < 50) {
      recs.push({
        type: "growth",
        message: "Low utilization provides room for growth. Monitor allocation trends closely.",
        priority: "low",
      });
    }
    
    return recs;
  }, [currentUtilization, capacityExhaustion]);

  const whatIfScenarios = useMemo(() => {
    return [
      {
        name: "Add 3 New Pools",
        description: "Adding 3 new /24 pools (768 IPs)",
        impact: "Would increase capacity by ~15%",
        utilization: Math.max(0, currentUtilization - 15),
      },
      {
        name: "Consolidate Underutilized",
        description: "Consolidate pools with <25% utilization",
        impact: "Would free up ~10% capacity",
        utilization: Math.max(0, currentUtilization - 10),
      },
      {
        name: "Double Growth Rate",
        description: "If allocation rate doubles",
        impact: "Would exhaust capacity 2x faster",
        utilization: Math.min(100, currentUtilization + 20),
      },
    ];
  }, [currentUtilization]);

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Forecasting & Planning</h3>
            <p className="text-sm text-slate-600">Future utilization predictions and capacity planning</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as ForecastPeriod)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="1m">1 Month</option>
              <option value="3m">3 Months</option>
              <option value="6m">6 Months</option>
              <option value="1y">1 Year</option>
            </select>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value as Scenario)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="optimistic">Optimistic</option>
              <option value="current">Current Trend</option>
              <option value="pessimistic">Pessimistic</option>
            </select>
          </div>
        </div>

        {capacityExhaustion && capacityExhaustion.months < 12 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚠️</span>
              <h4 className="text-sm font-semibold text-red-900">Capacity Exhaustion Projection</h4>
            </div>
            <p className="text-sm text-red-700">
              Based on current trends, capacity may be exhausted in{" "}
              <span className="font-semibold">{capacityExhaustion.months.toFixed(1)} months</span> (around{" "}
              {capacityExhaustion.date}).
            </p>
          </div>
        )}

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Utilization Forecast</h4>
          <ClientOnlyChart className="h-64" style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart key={`${period}-${scenario}`} data={forecastData}>
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
                    scenario === "optimistic" ? "Optimistic Forecast" : scenario === "pessimistic" ? "Pessimistic Forecast" : "Projected Utilization",
                  ]}
                />
                <Legend />
                <ReferenceLine y={100} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" label={{ value: "Capacity Limit", position: "right" }} />
                <Line
                  type="monotone"
                  dataKey="utilization"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name={scenario === "optimistic" ? "Optimistic Forecast" : scenario === "pessimistic" ? "Pessimistic Forecast" : "Projected Utilization"}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">What-If Scenarios</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {whatIfScenarios.map((scenario, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                <h5 className="text-sm font-semibold text-slate-900 mb-1">{scenario.name}</h5>
                <p className="text-xs text-slate-600 mb-2">{scenario.description}</p>
                <p className="text-xs text-blue-600 mb-2">{scenario.impact}</p>
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Projected Utilization:</span>
                    <span className="text-sm font-semibold text-slate-900">{scenario.utilization.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {recommendations.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">Recommendations</h4>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    rec.priority === "high"
                      ? "bg-red-50 border-red-200"
                      : rec.priority === "medium"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">
                      {rec.priority === "high" ? "🔴" : rec.priority === "medium" ? "🟡" : "🔵"}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{rec.message}</p>
                      <p className="text-xs text-slate-600 mt-0.5 capitalize">Priority: {rec.priority}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

