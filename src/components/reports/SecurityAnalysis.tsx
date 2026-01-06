"use client";

import { useMemo, useState } from "react";
import { activities } from "@/lib/data/activities";
import Card from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ClientOnlyChart } from "@/components/common/data-display";

type TimeRange = "24h" | "7d" | "30d" | "90d";

export function SecurityAnalysis() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const unauthorizedAccess = useMemo(() => {
    const now = new Date();
    const days = timeRange === "24h" ? 1 : timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);

    const failedLogins = activities.filter((activity) => {
      const activityDate = new Date(activity.timestamp);
      return (
        activity.type === "user_login" &&
        activity.severity === "error" &&
        activityDate >= startDate
      );
    });

    const suspiciousActivities = activities.filter((activity) => {
      const activityDate = new Date(activity.timestamp);
      return (
        (activity.type === "system_alert" && activity.severity === "warning") &&
        activityDate >= startDate &&
        activity.description.toLowerCase().includes("security")
      );
    });

    return {
      failedLogins: failedLogins.length,
      suspiciousActivities: suspiciousActivities.length,
      total: failedLogins.length + suspiciousActivities.length,
      incidents: [
        ...failedLogins.slice(0, 5).map((activity) => ({
          type: "Failed Login",
          timestamp: activity.timestamp,
          user: activity.user,
          description: activity.description,
          severity: "high" as const,
        })),
        ...suspiciousActivities.slice(0, 5).map((activity) => ({
          type: "Suspicious Activity",
          timestamp: activity.timestamp,
          user: activity.user,
          description: activity.description,
          severity: "medium" as const,
        })),
      ],
    };
  }, [timeRange]);

  const policyViolations = useMemo(() => {
    const violations: Array<{
      type: string;
      count: number;
      severity: "low" | "medium" | "high";
      description: string;
    }> = [];

    const systemAlerts = activities.filter((a) => a.type === "system_alert");
    
    const highSeverity = systemAlerts.filter((a) => a.severity === "error").length;
    if (highSeverity > 0) {
      violations.push({
        type: "High Severity Alerts",
        count: highSeverity,
        severity: "high",
        description: "System alerts with error severity",
      });
    }

    const warnings = systemAlerts.filter((a) => a.severity === "warning").length;
    if (warnings > 0) {
      violations.push({
        type: "Policy Warnings",
        count: warnings,
        severity: "medium",
        description: "Policy violations detected",
      });
    }

    return violations;
  }, []);

  const securityIncidents = useMemo(() => {
    const incidents = activities
      .filter((activity) => {
        return (
          activity.type === "system_alert" &&
          (activity.severity === "error" || activity.severity === "warning")
        );
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
      .map((activity) => ({
        id: activity.id,
        timestamp: activity.timestamp,
        type: activity.description.includes("security") ? "Security Incident" : "System Alert",
        description: activity.description,
        severity: activity.severity || "info",
        user: activity.user,
      }));

    return incidents;
  }, []);

  const riskAssessment = useMemo(() => {
    const totalActivities = activities.length;
    const errorCount = activities.filter((a) => a.severity === "error").length;
    const warningCount = activities.filter((a) => a.severity === "warning").length;
    
    const errorRate = (errorCount / totalActivities) * 100;
    const warningRate = (warningCount / totalActivities) * 100;

    let riskLevel: "low" | "medium" | "high";
    if (errorRate > 5 || warningRate > 20) {
      riskLevel = "high";
    } else if (errorRate > 2 || warningRate > 10) {
      riskLevel = "medium";
    } else {
      riskLevel = "low";
    }

    return {
      riskLevel,
      errorRate: Math.round(errorRate * 10) / 10,
      warningRate: Math.round(warningRate * 10) / 10,
      totalIncidents: errorCount + warningCount,
    };
  }, []);

  const dailyIncidents = useMemo(() => {
    const days = timeRange === "24h" ? 1 : timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const now = new Date();
    
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (days - i - 1));
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayIncidents = activities.filter((activity) => {
        const activityDate = new Date(activity.timestamp);
        return (
          activityDate >= date &&
          activityDate < nextDate &&
          (activity.severity === "error" || activity.severity === "warning")
        );
      });

      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        incidents: dayIncidents.length,
        errors: dayIncidents.filter((a) => a.severity === "error").length,
        warnings: dayIncidents.filter((a) => a.severity === "warning").length,
      };
    });
  }, [timeRange]);

  const COLORS = ["#ef4444", "#f59e0b", "#10b981"];

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      high: "text-red-600",
      medium: "text-yellow-600",
      low: "text-green-600",
    };
    return colors[risk] || "text-slate-600";
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Security Analysis</h3>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-1">Risk Level</p>
            <p className={`text-2xl font-bold ${getRiskColor(riskAssessment.riskLevel)}`}>
              {riskAssessment.riskLevel.toUpperCase()}
            </p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-medium text-red-700 mb-1">Unauthorized Access</p>
            <p className="text-2xl font-bold text-red-900">{unauthorizedAccess.total}</p>
            <p className="text-xs text-red-600 mt-1">
              {unauthorizedAccess.failedLogins} failed logins
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs font-medium text-yellow-700 mb-1">Policy Violations</p>
            <p className="text-2xl font-bold text-yellow-900">
              {policyViolations.reduce((sum, v) => sum + v.count, 0)}
            </p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-medium text-purple-700 mb-1">Total Incidents</p>
            <p className="text-2xl font-bold text-purple-900">{riskAssessment.totalIncidents}</p>
            <p className="text-xs text-purple-600 mt-1">
              Error rate: {riskAssessment.errorRate}%
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-3">Security Incident Trend</h4>
          <ClientOnlyChart className="h-64" style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyIncidents}>
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
                <Bar dataKey="errors" fill="#ef4444" name="Errors" />
                <Bar dataKey="warnings" fill="#f59e0b" name="Warnings" />
              </BarChart>
            </ResponsiveContainer>
          </ClientOnlyChart>
        </div>

        {policyViolations.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">Policy Violations</h4>
            <ClientOnlyChart className="h-48" style={{ minHeight: 192 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={policyViolations}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {policyViolations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ClientOnlyChart>
          </div>
        )}

        {securityIncidents.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">Recent Security Incidents</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {securityIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`p-3 border-2 rounded-lg ${
                    incident.severity === "error"
                      ? "bg-red-50 border-red-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-900">{incident.type}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            incident.severity === "error"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {incident.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{incident.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>User: {incident.user}</span>
                        <span>•</span>
                        <span>{new Date(incident.timestamp).toLocaleString()}</span>
                      </div>
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

