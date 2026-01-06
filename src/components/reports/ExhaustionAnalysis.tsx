"use client";

import { useMemo, useState } from "react";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ClientOnlyChart } from "@/components/common/data-display";

type GrowthRate = "conservative" | "moderate" | "aggressive";

export function ExhaustionAnalysis() {
  const router = useRouter();
  const [growthRate, setGrowthRate] = useState<GrowthRate>("moderate");

  const growthRates: Record<GrowthRate, number> = {
    conservative: 0.5,
    moderate: 1.5,
    aggressive: 3.0,
  };

  const exhaustionTimeline = useMemo(() => {
    const now = new Date();
    const rate = growthRates[growthRate];
    const months = 24;

    return Array.from({ length: months }, (_, i) => {
      const monthDate = new Date(now);
      monthDate.setMonth(monthDate.getMonth() + i);
      
      const poolsAtRisk = pools.filter((pool) => {
        const currentUtil = pool.utilization.percentage;
        const projectedUtil = Math.min(100, currentUtil + rate * i);
        return projectedUtil >= 90;
      }).length;

      const poolsExhausted = pools.filter((pool) => {
        const currentUtil = pool.utilization.percentage;
        const projectedUtil = Math.min(100, currentUtil + rate * i);
        return projectedUtil >= 100;
      }).length;

      return {
        month: monthDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        monthIndex: i,
        poolsAtRisk,
        poolsExhausted,
        totalPools: pools.length,
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [growthRate]);

  const riskAssessment = useMemo(() => {
    const rate = growthRates[growthRate];
    
    return pools.map((pool) => {
      const currentUtil = pool.utilization.percentage;
      const monthsTo90 = currentUtil < 90 ? (90 - currentUtil) / rate : 0;
      const monthsTo100 = currentUtil < 100 ? (100 - currentUtil) / rate : 0;
      
      let riskLevel: "low" | "medium" | "high" | "critical";
      if (currentUtil >= 100) riskLevel = "critical";
      else if (currentUtil >= 90) riskLevel = "high";
      else if (monthsTo90 <= 6) riskLevel = "high";
      else if (monthsTo90 <= 12) riskLevel = "medium";
      else riskLevel = "low";

      return {
        pool,
        currentUtil,
        monthsTo90: Math.round(monthsTo90 * 10) / 10,
        monthsTo100: Math.round(monthsTo100 * 10) / 10,
        riskLevel,
      };
    }).sort((a, b) => {
      const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [growthRate]);

  const mitigationSuggestions = useMemo(() => {
    const suggestions: Array<{ type: string; description: string; impact: string; priority: "high" | "medium" | "low" }> = [];
    
    const criticalPools = riskAssessment.filter((r) => r.riskLevel === "critical" || r.riskLevel === "high");
    if (criticalPools.length > 0) {
      suggestions.push({
        type: "Add Capacity",
        description: `Add new IP pools or expand ${criticalPools.length} high-risk pools`,
        impact: "High - Prevents immediate exhaustion",
        priority: "high",
      });
    }

    const underutilizedPools = pools.filter((p) => p.utilization.percentage < 25);
    if (underutilizedPools.length > 0) {
      suggestions.push({
        type: "Consolidate Pools",
        description: `Consolidate ${underutilizedPools.length} underutilized pools to free capacity`,
        impact: "Medium - Optimizes existing resources",
        priority: "medium",
      });
    }

    const expiredAllocations = pools.reduce((sum, pool) => {
      return sum + Math.floor(pool.utilization.allocated * 0.1);
    }, 0);
    if (expiredAllocations > 0) {
      suggestions.push({
        type: "Reclaim IPs",
        description: `Reclaim approximately ${expiredAllocations} expired or orphaned IP addresses`,
        impact: "Medium - Recovers unused capacity",
        priority: "medium",
      });
    }

    return suggestions;
  }, [riskAssessment]);

  const getRiskColor = (risk: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      critical: { bg: "bg-red-100", text: "text-red-800" },
      high: { bg: "bg-orange-100", text: "text-orange-800" },
      medium: { bg: "bg-yellow-100", text: "text-yellow-800" },
      low: { bg: "bg-green-100", text: "text-green-800" },
    };
    return colors[risk] || { bg: "bg-slate-100", text: "text-slate-800" };
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Exhaustion Analysis</h3>
            <p className="text-sm text-slate-600">Pool exhaustion timeline and risk assessment</p>
          </div>
          <select
            value={growthRate}
            onChange={(e) => setGrowthRate(e.target.value as GrowthRate)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="conservative">Conservative (0.5%/month)</option>
            <option value="moderate">Moderate (1.5%/month)</option>
            <option value="aggressive">Aggressive (3.0%/month)</option>
          </select>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Exhaustion Timeline (24 months)</h4>
          <ClientOnlyChart className="h-64" style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={exhaustionTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
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
                  dataKey="poolsAtRisk"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Pools at Risk (≥90%)"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="poolsExhausted"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Pools Exhausted (100%)"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Pool Risk Assessment</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {riskAssessment.slice(0, 15).map((assessment) => {
              const riskColor = getRiskColor(assessment.riskLevel);
              return (
                <div
                  key={assessment.pool.id}
                  className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/pools/${encodeURIComponent(assessment.pool.cidr)}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-mono font-semibold text-slate-900">
                          {assessment.pool.cidr}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${riskColor.bg} ${riskColor.text}`}>
                          {assessment.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <span>Current: {assessment.currentUtil.toFixed(1)}%</span>
                        {assessment.monthsTo90 > 0 && (
                          <span>90% in: {assessment.monthsTo90} months</span>
                        )}
                        {assessment.monthsTo100 > 0 && (
                          <span>100% in: {assessment.monthsTo100} months</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {mitigationSuggestions.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">Mitigation Suggestions</h4>
            <div className="space-y-3">
              {mitigationSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    suggestion.priority === "high"
                      ? "bg-red-50 border-red-200"
                      : suggestion.priority === "medium"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900">{suggestion.type}</h5>
                      <p className="text-sm text-slate-600 mt-1">{suggestion.description}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        suggestion.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : suggestion.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {suggestion.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Impact: {suggestion.impact}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

