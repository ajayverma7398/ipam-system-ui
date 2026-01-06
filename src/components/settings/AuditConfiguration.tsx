"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface AuditConfig {
  enabled: boolean;
  logLevel: "all" | "critical" | "warning" | "error" | "info";
  events: {
    userActions: boolean;
    systemEvents: boolean;
    apiAccess: boolean;
    configurationChanges: boolean;
    securityEvents: boolean;
    dataAccess: boolean;
  };
  retention: {
    enabled: boolean;
    days: number;
    archiveAfter: number;
    deleteAfter: number;
  };
  export: {
    enabled: boolean;
    format: "json" | "csv" | "syslog";
    destination: string;
    schedule: "daily" | "weekly" | "monthly" | "manual";
  };
  streaming: {
    enabled: boolean;
    endpoint: string;
    format: "json" | "syslog";
  };
}

export function AuditConfiguration() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<AuditConfig>({
    enabled: true,
    logLevel: "all",
    events: {
      userActions: true,
      systemEvents: true,
      apiAccess: true,
      configurationChanges: true,
      securityEvents: true,
      dataAccess: true,
    },
    retention: {
      enabled: true,
      days: 90,
      archiveAfter: 30,
      deleteAfter: 365,
    },
    export: {
      enabled: false,
      format: "json",
      destination: "https://external-logging.example.com/api/logs",
      schedule: "daily",
    },
    streaming: {
      enabled: false,
      endpoint: "syslog://log-server.example.com:514",
      format: "syslog",
    },
  });

  const handleSave = () => {
    showToast("Audit configuration saved successfully", "success");
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-end">
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
              <p className="text-sm font-medium text-slate-900">Enable Audit Logging</p>
              <p className="text-xs text-slate-600">Track all system activities and changes</p>
            </div>
          </label>
        </div>

        {config.enabled && (
          <>
            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Log Level</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <select
                  value={config.logLevel}
                  onChange={(e) =>
                    setConfig({ ...config, logLevel: e.target.value as AuditConfig["logLevel"] })
                  }
                  className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Events</option>
                  <option value="critical">Critical Only</option>
                  <option value="warning">Warning and Above</option>
                  <option value="error">Errors and Above</option>
                  <option value="info">Info and Above</option>
                </select>
                <p className="text-xs text-slate-600 mt-2">
                  Select the minimum log level to record
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Event Types to Log</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                {Object.entries(config.events).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors bg-white"
                  >
                    <div>
                      <span className="text-sm font-medium text-slate-900 block mb-1">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </span>
                      <span className="text-xs text-slate-600">
                        {key === "userActions" && "Track user login, logout, and actions"}
                        {key === "systemEvents" && "Track system-level events and errors"}
                        {key === "apiAccess" && "Track API calls and access"}
                        {key === "configurationChanges" && "Track settings and configuration changes"}
                        {key === "securityEvents" && "Track security-related events"}
                        {key === "dataAccess" && "Track data access and modifications"}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          events: { ...config.events, [key]: e.target.checked },
                        })
                      }
                      className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Retention Policy</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.retention.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        retention: { ...config.retention, enabled: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Enable Automatic Retention</p>
                    <p className="text-xs text-slate-600">Automatically manage log retention and cleanup</p>
                  </div>
                </label>

                {config.retention.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Active Retention (days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={config.retention.days}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            retention: { ...config.retention, days: Number(e.target.value) },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-slate-500 mt-1">Keep logs active for this period</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Archive After (days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={config.retention.archiveAfter}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            retention: { ...config.retention, archiveAfter: Number(e.target.value) },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-slate-500 mt-1">Move to archive after this period</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Delete After (days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="3650"
                        value={config.retention.deleteAfter}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            retention: { ...config.retention, deleteAfter: Number(e.target.value) },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-slate-500 mt-1">Permanently delete after this period</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Log Export</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.export.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        export: { ...config.export, enabled: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Enable Log Export</p>
                    <p className="text-xs text-slate-600">Export logs to external systems</p>
                  </div>
                </label>

                {config.export.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Export Format</label>
                      <select
                        value={config.export.format}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            export: {
                              ...config.export,
                              format: e.target.value as AuditConfig["export"]["format"],
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="json">JSON</option>
                        <option value="csv">CSV</option>
                        <option value="syslog">Syslog</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Export Schedule</label>
                      <select
                        value={config.export.schedule}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            export: {
                              ...config.export,
                              schedule: e.target.value as AuditConfig["export"]["schedule"],
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="manual">Manual Only</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Export Destination</label>
                      <input
                        type="text"
                        value={config.export.destination}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            export: { ...config.export, destination: e.target.value },
                          })
                        }
                        placeholder="https://external-logging.example.com/api/logs"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Real-time Log Streaming</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.streaming.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        streaming: { ...config.streaming, enabled: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Enable Real-time Streaming</p>
                    <p className="text-xs text-slate-600">Stream logs in real-time to external systems</p>
                  </div>
                </label>

                {config.streaming.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Stream Endpoint</label>
                      <input
                        type="text"
                        value={config.streaming.endpoint}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            streaming: { ...config.streaming, endpoint: e.target.value },
                          })
                        }
                        placeholder="syslog://log-server.example.com:514"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Stream Format</label>
                      <select
                        value={config.streaming.format}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            streaming: {
                              ...config.streaming,
                              format: e.target.value as AuditConfig["streaming"]["format"],
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="json">JSON</option>
                        <option value="syslog">Syslog</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

