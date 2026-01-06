"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface LogSettingsConfig {
  storage: {
    location: string;
    maxSize: number; 
    rotationEnabled: boolean;
    rotationSize: number; 
    compressionEnabled: boolean;
  };
  formatting: {
    timestampFormat: "iso" | "unix" | "custom";
    customFormat: string;
    includeMetadata: boolean;
    includeStackTrace: boolean;
  };
  viewing: {
    maxLines: number;
    refreshInterval: number; 
    autoScroll: boolean;
  };
  alerts: {
    enabled: boolean;
    errorThreshold: number;
    warningThreshold: number;
    alertEmails: string[];
  };
}

export function LogSettings() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<LogSettingsConfig>({
    storage: {
      location: "/var/log/ipam",
      maxSize: 1024,
      rotationEnabled: true,
      rotationSize: 100,
      compressionEnabled: true,
    },
    formatting: {
      timestampFormat: "iso",
      customFormat: "",
      includeMetadata: true,
      includeStackTrace: false,
    },
    viewing: {
      maxLines: 1000,
      refreshInterval: 5,
      autoScroll: true,
    },
    alerts: {
      enabled: true,
      errorThreshold: 10,
      warningThreshold: 50,
      alertEmails: ["admin@example.com"],
    },
  });

  const [newEmail, setNewEmail] = useState("");

  const handleSave = () => {
    showToast("Log settings saved successfully", "success");
  };

  const handleAddEmail = () => {
    if (!newEmail || config.alerts.alertEmails.includes(newEmail)) {
      showToast("Invalid or duplicate email address", "error");
      return;
    }
    setConfig({
      ...config,
      alerts: {
        ...config.alerts,
        alertEmails: [...config.alerts.alertEmails, newEmail],
      },
    });
    setNewEmail("");
    showToast("Email added", "success");
  };

  const handleRemoveEmail = (email: string) => {
    setConfig({
      ...config,
      alerts: {
        ...config.alerts,
        alertEmails: config.alerts.alertEmails.filter((e) => e !== email),
      },
    });
    showToast("Email removed", "success");
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Log Settings</h3>
            <p className="text-sm text-slate-600">Configure log storage, formatting, and viewing options</p>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Save Changes
          </button>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Storage Settings</h4>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Log Storage Location</label>
              <input
                type="text"
                value={config.storage.location}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    storage: { ...config.storage, location: e.target.value },
                  })
                }
                placeholder="/var/log/ipam"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Max Log Size (MB)</label>
                <input
                  type="number"
                  min="1"
                  value={config.storage.maxSize}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      storage: { ...config.storage, maxSize: Number(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rotation Size (MB)</label>
                <input
                  type="number"
                  min="1"
                  value={config.storage.rotationSize}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      storage: { ...config.storage, rotationSize: Number(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.storage.rotationEnabled}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      storage: { ...config.storage, rotationEnabled: e.target.checked },
                    })
                  }
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">Enable Log Rotation</p>
                  <p className="text-xs text-slate-600">Automatically rotate logs when size limit is reached</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.storage.compressionEnabled}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      storage: { ...config.storage, compressionEnabled: e.target.checked },
                    })
                  }
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">Enable Compression</p>
                  <p className="text-xs text-slate-600">Compress rotated log files to save space</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Log Formatting</h4>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Timestamp Format</label>
              <select
                value={config.formatting.timestampFormat}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    formatting: {
                      ...config.formatting,
                      timestampFormat: e.target.value as LogSettingsConfig["formatting"]["timestampFormat"],
                    },
                  })
                }
                className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="iso">ISO 8601</option>
                <option value="unix">Unix Timestamp</option>
                <option value="custom">Custom Format</option>
              </select>
            </div>
            {config.formatting.timestampFormat === "custom" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Custom Format</label>
                <input
                  type="text"
                  value={config.formatting.customFormat}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      formatting: { ...config.formatting, customFormat: e.target.value },
                    })
                  }
                  placeholder="YYYY-MM-DD HH:mm:ss"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>
            )}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.formatting.includeMetadata}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      formatting: { ...config.formatting, includeMetadata: e.target.checked },
                    })
                  }
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">Include Metadata</p>
                  <p className="text-xs text-slate-600">Include user, IP address, and request details</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.formatting.includeStackTrace}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      formatting: { ...config.formatting, includeStackTrace: e.target.checked },
                    })
                  }
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">Include Stack Traces</p>
                  <p className="text-xs text-slate-600">Include full stack traces for errors</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Log Viewing</h4>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Max Lines to Display</label>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  step="100"
                  value={config.viewing.maxLines}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      viewing: { ...config.viewing, maxLines: Number(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Auto-refresh Interval (seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={config.viewing.refreshInterval}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      viewing: { ...config.viewing, refreshInterval: Number(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.viewing.autoScroll}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    viewing: { ...config.viewing, autoScroll: e.target.checked },
                  })
                }
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-medium text-slate-900">Auto-scroll to Latest</p>
                <p className="text-xs text-slate-600">Automatically scroll to the latest log entries</p>
              </div>
            </label>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Log Alerts</h4>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.alerts.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    alerts: { ...config.alerts, enabled: e.target.checked },
                  })
                }
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-medium text-slate-900">Enable Log Alerts</p>
                <p className="text-xs text-slate-600">Send email alerts when log thresholds are exceeded</p>
              </div>
            </label>

            {config.alerts.enabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Error Threshold (per hour)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={config.alerts.errorThreshold}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          alerts: { ...config.alerts, errorThreshold: Number(e.target.value) },
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Warning Threshold (per hour)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={config.alerts.warningThreshold}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          alerts: { ...config.alerts, warningThreshold: Number(e.target.value) },
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Alert Recipients</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddEmail()}
                      placeholder="admin@example.com"
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddEmail}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {config.alerts.alertEmails.map((email) => (
                      <span
                        key={email}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
                      >
                        {email}
                        <button
                          onClick={() => handleRemoveEmail(email)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

