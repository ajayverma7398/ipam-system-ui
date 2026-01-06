"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface MonitoringServer {
  id: string;
  name: string;
  type: "nagios" | "zabbix" | "prometheus" | "other";
  url: string;
  apiKey: string;
  enabled: boolean;
}

interface MonitoringConfig {
  enabled: boolean;
  servers: MonitoringServer[];
  healthChecks: {
    enabled: boolean;
    interval: number; 
    timeout: number; 
  };
  alertForwarding: boolean;
  metricsExport: boolean;
  exportInterval: number; 
}

export function MonitoringIntegration() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<MonitoringConfig>({
    enabled: false,
    servers: [
      {
        id: "mon-001",
        name: "Nagios Server",
        type: "nagios",
        url: "https://nagios.example.com",
        apiKey: "",
        enabled: true,
      },
    ],
    healthChecks: {
      enabled: true,
      interval: 5,
      timeout: 30,
    },
    alertForwarding: true,
    metricsExport: true,
    exportInterval: 15,
  });

  const [isAddingServer, setIsAddingServer] = useState(false);
  const [newServer, setNewServer] = useState<Partial<MonitoringServer>>({
    name: "",
    type: "prometheus",
    url: "",
    apiKey: "",
    enabled: true,
  });

  const handleSave = () => {
    showToast("Monitoring integration settings saved successfully", "success");
  };

  const handleAddServer = () => {
    if (!newServer.name || !newServer.url) {
      showToast("Please fill in server name and URL", "error");
      return;
    }
    const server: MonitoringServer = {
      id: `mon-${Date.now()}`,
      name: newServer.name,
      type: newServer.type || "prometheus",
      url: newServer.url,
      apiKey: newServer.apiKey || "",
      enabled: newServer.enabled ?? true,
    };
    setConfig({
      ...config,
      servers: [...config.servers, server],
    });
    setNewServer({ name: "", type: "prometheus", url: "", apiKey: "", enabled: true });
    setIsAddingServer(false);
    showToast("Monitoring server added", "success");
  };

  const toggleServer = (id: string) => {
    setConfig({
      ...config,
      servers: config.servers.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    });
  };

  const removeServer = (id: string) => {
    setConfig({
      ...config,
      servers: config.servers.filter((s) => s.id !== id),
    });
    showToast("Monitoring server removed", "success");
  };

  const monitoringTypes = [
    { value: "nagios", label: "Nagios" },
    { value: "zabbix", label: "Zabbix" },
    { value: "prometheus", label: "Prometheus" },
    { value: "other", label: "Other" },
  ];

  const getTypeLabel = (type: string) => {
    return monitoringTypes.find((t) => t.value === type)?.label || type;
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Monitoring Integration</h3>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Save Changes
          </button>
        </div>

        {/* Enable Integration */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">Enable Monitoring Integration</p>
            </div>
          </label>
        </div>

        {config.enabled && (
          <>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold text-slate-900">Monitoring Servers</h4>
                <button
                  onClick={() => setIsAddingServer(!isAddingServer)}
                  className="px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  {isAddingServer ? "Cancel" : "+ Add Server"}
                </button>
              </div>

              {isAddingServer && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Server Name</label>
                      <input
                        type="text"
                        value={newServer.name || ""}
                        onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                        placeholder="e.g., Nagios Server"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                      <select
                        value={newServer.type || "prometheus"}
                        onChange={(e) =>
                          setNewServer({ ...newServer, type: e.target.value as MonitoringServer["type"] })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {monitoringTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Server URL</label>
                      <input
                        type="url"
                        value={newServer.url || ""}
                        onChange={(e) => setNewServer({ ...newServer, url: e.target.value })}
                        placeholder="https://monitoring.example.com"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">API Key</label>
                      <input
                        type="password"
                        value={newServer.apiKey || ""}
                        onChange={(e) => setNewServer({ ...newServer, apiKey: e.target.value })}
                        placeholder="API key or token"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setIsAddingServer(false)}
                      className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddServer}
                      className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
                    >
                      Add Server
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {config.servers.map((server) => (
                  <div
                    key={server.id}
                    className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h5 className="text-sm font-semibold text-slate-900">{server.name}</h5>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              server.enabled
                                ? "bg-green-100 text-green-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {server.enabled ? "Enabled" : "Disabled"}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {getTypeLabel(server.type)}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600">
                          <span>{server.url}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => toggleServer(server.id)}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            server.enabled
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {server.enabled ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => removeServer(server.id)}
                          className="px-3 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Health Check Configuration</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-4">
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={config.healthChecks.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        healthChecks: { ...config.healthChecks, enabled: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Enable Health Checks</p>
                  </div>
                </label>
                {config.healthChecks.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Check Interval (minutes)</label>
                      <input
                        type="number"
                        min="1"
                        value={config.healthChecks.interval}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            healthChecks: {
                              ...config.healthChecks,
                              interval: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Timeout (seconds)</label>
                      <input
                        type="number"
                        min="1"
                        value={config.healthChecks.timeout}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            healthChecks: {
                              ...config.healthChecks,
                              timeout: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Alert Forwarding</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.alertForwarding}
                    onChange={(e) => setConfig({ ...config, alertForwarding: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Forward Alerts to Monitoring</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Metrics Export</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-4">
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={config.metricsExport}
                    onChange={(e) => setConfig({ ...config, metricsExport: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Export Performance Metrics</p>
                  </div>
                </label>
                {config.metricsExport && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Export Interval (minutes)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="1"
                        value={config.exportInterval}
                        onChange={(e) => setConfig({ ...config, exportInterval: Number(e.target.value) })}
                        className="w-32 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="text-sm text-slate-700">minutes</span>
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

