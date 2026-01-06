"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface Schedule {
  id: string;
  name: string;
  reportType: string;
  frequency: "daily" | "weekly" | "monthly" | "custom";
  time: string;
  timezone: string;
  enabled: boolean;
  lastRun: string | null;
  nextRun: string;
}

export function ScheduleManager() {
  const { showToast } = useToast();
  const baseTime = 1700000000000;
  const [schedules, setSchedules] = useState<Schedule[]>(() => [
    {
      id: "schedule-001",
      name: "Daily Utilization Report",
      reportType: "utilization",
      frequency: "daily",
      time: "09:00",
      timezone: "UTC",
      enabled: true,
      lastRun: new Date(baseTime - 24 * 60 * 60 * 1000).toISOString(),
      nextRun: new Date(baseTime + 60 * 60 * 1000).toISOString(),
    },
    {
      id: "schedule-002",
      name: "Weekly Allocation Summary",
      reportType: "allocation",
      frequency: "weekly",
      time: "08:00",
      timezone: "UTC",
      enabled: true,
      lastRun: new Date(baseTime - 7 * 24 * 60 * 60 * 1000).toISOString(),
      nextRun: new Date(baseTime + 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({
    name: "",
    reportType: "utilization",
    frequency: "daily",
    time: "09:00",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    enabled: true,
  });

  const handleCreateSchedule = () => {
    if (!newSchedule.name || !newSchedule.time) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    const schedule: Schedule = {
      id: `schedule-${Date.now()}`,
      name: newSchedule.name,
      reportType: newSchedule.reportType || "utilization",
      frequency: newSchedule.frequency || "daily",
      time: newSchedule.time,
      timezone: newSchedule.timezone || "UTC",
      enabled: newSchedule.enabled ?? true,
      lastRun: null,
      nextRun: calculateNextRun(newSchedule.frequency || "daily", newSchedule.time || "09:00"),
    };

    setSchedules([...schedules, schedule]);
    setNewSchedule({
      name: "",
      reportType: "utilization",
      frequency: "daily",
      time: "09:00",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      enabled: true,
    });
    setIsCreating(false);
    showToast("Schedule created successfully", "success");
  };

  const calculateNextRun = (frequency: string, time: string): string => {
    const now = new Date();
    const [hours, minutes] = time.split(":").map(Number);
    const next = new Date(now);
    next.setHours(hours, minutes, 0, 0);

    if (frequency === "daily") {
      if (next <= now) {
        next.setDate(next.getDate() + 1);
      }
    } else if (frequency === "weekly") {
      const daysUntilMonday = (1 + 7 - next.getDay()) % 7;
      next.setDate(next.getDate() + (daysUntilMonday || 7));
    } else if (frequency === "monthly") {
      next.setMonth(next.getMonth() + 1);
      next.setDate(1);
    }

    return next.toISOString();
  };

  const toggleSchedule = (id: string) => {
    setSchedules(
      schedules.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    showToast("Schedule updated", "success");
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id));
    showToast("Schedule deleted", "success");
  };

  const reportTypes = [
    { value: "utilization", label: "Utilization Report" },
    { value: "allocation", label: "Allocation Report" },
    { value: "capacity", label: "Capacity Report" },
    { value: "audit", label: "Audit Report" },
    { value: "custom", label: "Custom Report" },
  ];

  const frequencies = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "custom", label: "Custom (Cron)" },
  ];

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Schedule Manager</h3>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            {isCreating ? "Cancel" : "+ New Schedule"}
          </button>
        </div>

        {isCreating && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
            <h4 className="text-md font-semibold text-slate-900">Create New Schedule</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Schedule Name *
                </label>
                <input
                  type="text"
                  value={newSchedule.name || ""}
                  onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                  placeholder="e.g., Daily Utilization Report"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Report Type *</label>
                <select
                  value={newSchedule.reportType || "utilization"}
                  onChange={(e) => setNewSchedule({ ...newSchedule, reportType: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Frequency *</label>
                <select
                  value={newSchedule.frequency || "daily"}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, frequency: e.target.value as Schedule["frequency"] })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {frequencies.map((freq) => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Time *</label>
                <input
                  type="time"
                  value={newSchedule.time || "09:00"}
                  onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                <select
                  value={newSchedule.timezone || "UTC"}
                  onChange={(e) => setNewSchedule({ ...newSchedule, timezone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSchedule}
                className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
              >
                Create Schedule
              </button>
            </div>
          </div>
        )}

        <div>
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h5 className="text-sm font-semibold text-slate-900">{schedule.name}</h5>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          schedule.enabled
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {schedule.enabled ? "Enabled" : "Disabled"}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {schedule.frequency}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
                      <div>
                        <span className="font-medium">Report:</span> {reportTypes.find((t) => t.value === schedule.reportType)?.label}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {schedule.time} ({schedule.timezone})
                      </div>
                      <div>
                        <span className="font-medium">Last Run:</span>{" "}
                        {schedule.lastRun ? new Date(schedule.lastRun).toLocaleString() : "Never"}
                      </div>
                      <div>
                        <span className="font-medium">Next Run:</span>{" "}
                        {new Date(schedule.nextRun).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleSchedule(schedule.id)}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        schedule.enabled
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {schedule.enabled ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => deleteSchedule(schedule.id)}
                      className="px-3 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {schedules.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-8">No schedules created yet</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

