"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";



interface NotificationConfig {
  enabled: boolean;
  smtpServer: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  events: {
    ipAllocated: boolean;
    ipReleased: boolean;
    poolCreated: boolean;
    poolDeleted: boolean;
    highUtilization: boolean;
    capacityWarning: boolean;
    systemAlert: boolean;
  };
  thresholds: {
    utilization: number;
    capacity: number;
  };
}

export function NotificationSettings() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<NotificationConfig>({
    enabled: true,
    smtpServer: "smtp.example.com",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "noreply@ipam.example.com",
    fromName: "IPAM System",
    events: {
      ipAllocated: true,
      ipReleased: false,
      poolCreated: true,
      poolDeleted: true,
      highUtilization: true,
      capacityWarning: true,
      systemAlert: true,
    },
    thresholds: {
      utilization: 90,
      capacity: 10,
    },
  });

  const handleSave = () => {
    showToast("Notification settings saved successfully", "success");
  };

  const toggleEvent = (event: keyof NotificationConfig["events"]) => {
    setConfig({
      ...config,
      events: {
        ...config.events,
        [event]: !config.events[event],
      },
    });
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Notification Settings</h3>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Save Changes
          </button>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">Enable Email Notifications</p>
            </div>
          </label>
        </div>

        {config.enabled && (
          <>
            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">SMTP Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">SMTP Server</label>
                  <input
                    type="text"
                    value={config.smtpServer}
                    onChange={(e) => setConfig({ ...config, smtpServer: e.target.value })}
                    placeholder="smtp.example.com"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">SMTP Port</label>
                  <input
                    type="number"
                    value={config.smtpPort}
                    onChange={(e) => setConfig({ ...config, smtpPort: Number(e.target.value) })}
                    placeholder="587"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">SMTP Username</label>
                  <input
                    type="text"
                    value={config.smtpUser}
                    onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
                    placeholder="username"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">SMTP Password</label>
                  <input
                    type="password"
                    value={config.smtpPassword}
                    onChange={(e) => setConfig({ ...config, smtpPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">From Email</label>
                  <input
                    type="email"
                    value={config.fromEmail}
                    onChange={(e) => setConfig({ ...config, fromEmail: e.target.value })}
                    placeholder="noreply@example.com"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">From Name</label>
                  <input
                    type="text"
                    value={config.fromName}
                    onChange={(e) => setConfig({ ...config, fromName: e.target.value })}
                    placeholder="IPAM System"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Event Subscriptions</h4>
              <div className="space-y-3">
                {Object.entries(config.events).map(([event, enabled]) => {
                  const eventLabels: Record<string, string> = {
                    ipAllocated: "IP Address Allocated",
                    ipReleased: "IP Address Released",
                    poolCreated: "Pool Created",
                    poolDeleted: "Pool Deleted",
                    highUtilization: "High Pool Utilization",
                    capacityWarning: "Capacity Warning",
                    systemAlert: "System Alerts",
                  };
                  return (
                    <label
                      key={event}
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-900">
                        {eventLabels[event] || event}
                      </span>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => toggleEvent(event as keyof NotificationConfig["events"])}
                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Alert Thresholds</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Utilization Alert Threshold (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.thresholds.utilization}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        thresholds: {
                          ...config.thresholds,
                          utilization: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Send alert when pool utilization exceeds this percentage
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Capacity Warning Threshold (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.thresholds.capacity}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        thresholds: {
                          ...config.thresholds,
                          capacity: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Send warning when available capacity drops below this percentage
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

