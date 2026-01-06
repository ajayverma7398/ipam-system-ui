"use client";

import { useMemo } from "react";
import Card from "@/components/ui/Card";

interface ConfigurationChange {
  id: string;
  category: string;
  field: string;
  oldValue: string;
  newValue: string;
  user: string;
  timestamp: string;
  impact: "low" | "medium" | "high";
}

export function RecentChanges() {
  const changes: ConfigurationChange[] = useMemo(() => {
    const baseTime = 1700000000000;
    return [
      {
        id: "change-001",
        category: "Network",
        field: "DNS Servers",
        oldValue: "8.8.8.8",
        newValue: "1.1.1.1, 8.8.8.8",
        user: "admin@example.com",
        timestamp: new Date(baseTime - 2 * 60 * 60 * 1000).toISOString(),
        impact: "medium",
      },
      {
        id: "change-002",
        category: "General",
        field: "Auto Allocation",
        oldValue: "false",
        newValue: "true",
        user: "admin@example.com",
        timestamp: new Date(baseTime - 5 * 60 * 60 * 1000).toISOString(),
        impact: "low",
      },
      {
        id: "change-003",
        category: "Security",
        field: "API Rate Limit",
        oldValue: "1000/min",
        newValue: "500/min",
        user: "security@example.com",
        timestamp: new Date(baseTime - 24 * 60 * 60 * 1000).toISOString(),
        impact: "high",
      },
      {
        id: "change-004",
        category: "Integrations",
        field: "DHCP Integration",
        oldValue: "Disabled",
        newValue: "Enabled",
        user: "admin@example.com",
        timestamp: new Date(baseTime - 48 * 60 * 60 * 1000).toISOString(),
        impact: "high",
      },
    ];
  }, []);

  const getImpactColor = (impact: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      low: { bg: "bg-green-100", text: "text-green-800" },
      medium: { bg: "bg-yellow-100", text: "text-yellow-800" },
      high: { bg: "bg-red-100", text: "text-red-800" },
    };
    return colors[impact] || colors.low;
  };

  const handleRollback = (changeId: string) => {
    if (confirm("Are you sure you want to rollback this change?")) {
      console.log("Rolling back change:", changeId);
    }
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Recent Changes</h3>
          <p className="text-sm text-slate-600">Last configuration changes and their impact</p>
        </div>

        <div className="space-y-3">
          {changes.map((change) => {
            const impactColors = getImpactColor(change.impact);
            return (
              <div
                key={change.id}
                className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {change.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${impactColors.bg} ${impactColors.text}`}>
                        {change.impact.toUpperCase()} IMPACT
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-900">{change.field}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-600 line-through">{change.oldValue}</span>
                        <span className="text-slate-400">→</span>
                        <span className="text-slate-900 font-medium">{change.newValue}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRollback(change.id)}
                    className="px-3 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors ml-4"
                  >
                    Rollback
                  </button>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>By: {change.user}</span>
                  <span>•</span>
                  <span>{new Date(change.timestamp).toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-xs font-medium text-slate-700 mb-1">Total Changes</p>
              <p className="text-xl font-bold text-slate-900">{changes.length}</p>
              <p className="text-xs text-slate-500 mt-1">Last 7 days</p>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs font-medium text-yellow-700 mb-1">High Impact</p>
              <p className="text-xl font-bold text-yellow-900">
                {changes.filter((c) => c.impact === "high").length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-medium text-blue-700 mb-1">Active Users</p>
              <p className="text-xl font-bold text-blue-900">
                {new Set(changes.map((c) => c.user)).size}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

