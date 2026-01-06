/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface ScheduledReport {
  id: string;
  name: string;
  category: string;
  schedule: string;
  frequency: "daily" | "weekly" | "monthly";
  nextRun: string;
  lastRun?: string;
  lastRunStatus?: "success" | "failed" | "pending";
  recipients: string[];
  isEnabled: boolean;
}

export function ScheduledReports() {
  const { showToast } = useToast();

  const scheduledReports: ScheduledReport[] = [
    {
      id: "sched-001",
      name: "Daily Utilization Summary",
      category: "utilization",
      schedule: "Every day at 8:00 AM",
      frequency: "daily",
      nextRun: "2024-03-16T08:00:00",
      lastRun: "2024-03-15T08:00:00",
      lastRunStatus: "success",
      recipients: ["admin@example.com", "team@example.com"],
      isEnabled: true,
    },
    {
      id: "sched-002",
      name: "Weekly Allocation Report",
      category: "allocation",
      schedule: "Every Monday at 9:00 AM",
      frequency: "weekly",
      nextRun: "2024-03-18T09:00:00",
      lastRun: "2024-03-11T09:00:00",
      lastRunStatus: "success",
      recipients: ["admin@example.com"],
      isEnabled: true,
    },
    {
      id: "sched-003",
      name: "Monthly Capacity Forecast",
      category: "capacity",
      schedule: "First day of month at 6:00 AM",
      frequency: "monthly",
      nextRun: "2024-04-01T06:00:00",
      lastRun: "2024-03-01T06:00:00",
      lastRunStatus: "success",
      recipients: ["admin@example.com", "manager@example.com"],
      isEnabled: true,
    },
    {
      id: "sched-004",
      name: "Compliance Audit Report",
      category: "audit",
      schedule: "Every Friday at 5:00 PM",
      frequency: "weekly",
      nextRun: "2024-03-22T17:00:00",
      lastRun: "2024-03-15T17:00:00",
      lastRunStatus: "failed",
      recipients: ["admin@example.com"],
      isEnabled: false,
    },
  ];

  const toggleSchedule = (reportId: string) => {
    showToast("Schedule status updated", "success");
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const statusColors: Record<string, { bg: string; text: string }> = {
      success: { bg: "bg-green-100", text: "text-green-800" },
      failed: { bg: "bg-red-100", text: "text-red-800" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
    };
    const config = statusColors[status] || { bg: "bg-slate-100", text: "text-slate-800" };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        {status}
      </span>
    );
  };

  const formatNextRun = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diffDays === 1) {
      return `Tomorrow at ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Scheduled Reports</h3>
            <p className="text-sm text-slate-600">Manage automated report schedules</p>
          </div>
          <button
            onClick={() => showToast("Open schedule dialog", "info")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            + New Schedule
          </button>
        </div>

        <div className="space-y-4">
          {scheduledReports.map((report) => (
            <div
              key={report.id}
              className={`p-4 border-2 rounded-lg transition-all ${
                report.isEnabled
                  ? "border-blue-200 bg-blue-50/50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-slate-900">{report.name}</h4>
                    <span className="px-2 py-0.5 bg-white text-slate-700 rounded text-xs font-medium capitalize">
                      {report.category}
                    </span>
                    {!report.isEnabled && (
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-xs font-medium">
                        Disabled
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{report.schedule}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500">Next Run:</span>
                      <p className="text-slate-900 font-medium mt-0.5">{formatNextRun(report.nextRun)}</p>
                    </div>
                    {report.lastRun && (
                      <div>
                        <span className="text-slate-500">Last Run:</span>
                        <p className="text-slate-900 font-medium mt-0.5">
                          {new Date(report.lastRun).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {report.lastRunStatus && (
                      <div>
                        <span className="text-slate-500">Status:</span>
                        <div className="mt-0.5">{getStatusBadge(report.lastRunStatus)}</div>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-500">Recipients:</span>
                      <p className="text-slate-900 font-medium mt-0.5">{report.recipients.length}</p>
                    </div>
                  </div>
                  {report.recipients.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {report.recipients.map((email, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-white text-slate-600 rounded text-xs"
                        >
                          {email}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleSchedule(report.id)}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      report.isEnabled
                        ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                        : "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
                    }`}
                  >
                    {report.isEnabled ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => showToast(`Edit schedule for ${report.name}`, "info")}
                    className="px-3 py-1 text-xs text-blue-600 hover:text-blue-700 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {scheduledReports.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">No scheduled reports</p>
            <button
              onClick={() => showToast("Open schedule dialog", "info")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Schedule
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}

