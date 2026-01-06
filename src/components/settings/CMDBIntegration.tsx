"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface CMDBConfig {
  enabled: boolean;
  type: "servicenow" | "cmdbuild" | "custom";
  serverUrl: string;
  username: string;
  password: string;
  syncConfigurationItems: boolean;
  syncRelationships: boolean;
  syncChanges: boolean;
  syncInterval: number; // minutes
  mapping: {
    ipAddressField: string;
    hostnameField: string;
    deviceTypeField: string;
    departmentField: string;
  };
}

export function CMDBIntegration() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<CMDBConfig>({
    enabled: false,
    type: "servicenow",
    serverUrl: "https://example.service-now.com",
    username: "",
    password: "",
    syncConfigurationItems: true,
    syncRelationships: true,
    syncChanges: false,
    syncInterval: 60,
    mapping: {
      ipAddressField: "ip_address",
      hostnameField: "name",
      deviceTypeField: "class",
      departmentField: "u_department",
    },
  });

  const [testing, setTesting] = useState(false);

  const handleSave = () => {
    showToast("CMDB integration settings saved successfully", "success");
  };

  const handleTestConnection = async () => {
    setTesting(true);
    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setTesting(false);
    showToast("Connection test successful", "success");
  };

  const cmdbTypes = [
    { value: "servicenow", label: "ServiceNow" },
    { value: "cmdbuild", label: "CMDBuild" },
    { value: "custom", label: "Custom API" },
  ];

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">CMDB Integration</h3>
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
              <p className="text-sm font-medium text-slate-900">Enable CMDB Integration</p>
            </div>
          </label>
        </div>

        {config.enabled && (
          <>
            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Connection Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">CMDB Type</label>
                  <select
                    value={config.type}
                    onChange={(e) =>
                      setConfig({ ...config, type: e.target.value as CMDBConfig["type"] })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {cmdbTypes.map((type) => (
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
                    value={config.serverUrl}
                    onChange={(e) => setConfig({ ...config, serverUrl: e.target.value })}
                    placeholder="https://example.service-now.com"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={config.username}
                    onChange={(e) => setConfig({ ...config, username: e.target.value })}
                    placeholder="API username"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password / API Key</label>
                  <input
                    type="password"
                    value={config.password}
                    onChange={(e) => setConfig({ ...config, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {testing ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Testing...
                    </>
                  ) : (
                    "Test Connection"
                  )}
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Synchronization Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                  <div>
                    <span className="text-sm font-medium text-slate-900 block mb-1">
                      Sync Configuration Items
                    </span>
                    <span className="text-xs text-slate-600">
                      Synchronize IP allocations with CMDB configuration items
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.syncConfigurationItems}
                    onChange={(e) =>
                      setConfig({ ...config, syncConfigurationItems: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                  <div>
                    <span className="text-sm font-medium text-slate-900 block mb-1">
                      Sync Relationships
                    </span>
                    <span className="text-xs text-slate-600">
                      Map relationships between IPs and devices in CMDB
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.syncRelationships}
                    onChange={(e) => setConfig({ ...config, syncRelationships: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                  <div>
                    <span className="text-sm font-medium text-slate-900 block mb-1">
                      Sync Change Management
                    </span>
                    <span className="text-xs text-slate-600">
                      Create change requests in CMDB for IP allocation changes
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.syncChanges}
                    onChange={(e) => setConfig({ ...config, syncChanges: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Synchronization Interval</h4>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  max="1440"
                  value={config.syncInterval}
                  onChange={(e) => setConfig({ ...config, syncInterval: Number(e.target.value) })}
                  className="w-32 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-sm text-slate-700">minutes</span>
                <p className="text-xs text-slate-500">
                  How often to synchronize with CMDB
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Field Mapping</h4>
              <p className="text-sm text-slate-600 mb-4">
                Map IPAM fields to CMDB configuration item fields
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">IP Address Field</label>
                  <input
                    type="text"
                    value={config.mapping.ipAddressField}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        mapping: { ...config.mapping, ipAddressField: e.target.value },
                      })
                    }
                    placeholder="ip_address"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Hostname Field</label>
                  <input
                    type="text"
                    value={config.mapping.hostnameField}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        mapping: { ...config.mapping, hostnameField: e.target.value },
                      })
                    }
                    placeholder="name"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Device Type Field</label>
                  <input
                    type="text"
                    value={config.mapping.deviceTypeField}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        mapping: { ...config.mapping, deviceTypeField: e.target.value },
                      })
                    }
                    placeholder="class"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Department Field</label>
                  <input
                    type="text"
                    value={config.mapping.departmentField}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        mapping: { ...config.mapping, departmentField: e.target.value },
                      })
                    }
                    placeholder="u_department"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

