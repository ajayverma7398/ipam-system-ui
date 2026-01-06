"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";


interface DNSServer {
  id: string;
  name: string;
  host: string;
  port: number;
  enabled: boolean;
  type: "primary" | "secondary" | "forwarder";
}

interface DNSConfig {
  enabled: boolean;
  servers: DNSServer[];
  dynamicDNS: boolean;
  autoCreateRecords: boolean;
  recordTemplates: {
    a: boolean;
    aaaa: boolean;
    ptr: boolean;
    cname: boolean;
  };
}

export function DNSSettings() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<DNSConfig>({
    enabled: true,
    servers: [
      {
        id: "dns-001",
        name: "Primary DNS",
        host: "192.168.1.10",
        port: 53,
        enabled: true,
        type: "primary",
      },
      {
        id: "dns-002",
        name: "Secondary DNS",
        host: "192.168.1.11",
        port: 53,
        enabled: true,
        type: "secondary",
      },
    ],
    dynamicDNS: true,
    autoCreateRecords: true,
    recordTemplates: {
      a: true,
      aaaa: false,
      ptr: true,
      cname: false,
    },
  });

  const [isAddingServer, setIsAddingServer] = useState(false);
  const [newServer, setNewServer] = useState<Partial<DNSServer>>({
    name: "",
    host: "",
    port: 53,
    enabled: true,
    type: "primary",
  });

  const handleSave = () => {
    showToast("DNS settings saved successfully", "success");
  };

  const handleAddServer = () => {
    if (!newServer.name || !newServer.host) {
      showToast("Please fill in server name and host", "error");
      return;
    }
    const server: DNSServer = {
      id: `dns-${Date.now()}`,
      name: newServer.name,
      host: newServer.host,
      port: newServer.port || 53,
      enabled: newServer.enabled ?? true,
      type: newServer.type || "primary",
    };
    setConfig({
      ...config,
      servers: [...config.servers, server],
    });
    setNewServer({ name: "", host: "", port: 53, enabled: true, type: "primary" });
    setIsAddingServer(false);
    showToast("DNS server added", "success");
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
    showToast("DNS server removed", "success");
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">DNS Integration</h3>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Save Changes
          </button>
        </div>

        {/* Enable DNS Integration */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">Enable DNS Integration</p>
            </div>
          </label>
        </div>

        {config.enabled && (
          <>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold text-slate-900">DNS Servers</h4>
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
                        placeholder="e.g., Primary DNS"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Host / IP</label>
                      <input
                        type="text"
                        value={newServer.host || ""}
                        onChange={(e) => setNewServer({ ...newServer, host: e.target.value })}
                        placeholder="e.g., 192.168.1.10"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Port</label>
                      <input
                        type="number"
                        value={newServer.port || 53}
                        onChange={(e) => setNewServer({ ...newServer, port: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                      <select
                        value={newServer.type || "primary"}
                        onChange={(e) =>
                          setNewServer({ ...newServer, type: e.target.value as DNSServer["type"] })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                        <option value="forwarder">Forwarder</option>
                      </select>
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
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium capitalize">
                            {server.type}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600">
                          <span className="font-mono">{server.host}</span>
                          <span className="mx-2">:</span>
                          <span>{server.port}</span>
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
              <h4 className="text-md font-semibold text-slate-900 mb-4">Dynamic DNS</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.dynamicDNS}
                    onChange={(e) => setConfig({ ...config, dynamicDNS: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Enable Dynamic DNS</p>
                  </div>
                </label>
              </div>
            </div>
            <div>
              <h4 className="text-md font-semibold text-slate-900 mb-4">Auto-Create Records</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.autoCreateRecords}
                    onChange={(e) => setConfig({ ...config, autoCreateRecords: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Auto-Create DNS Records</p>
                  </div>
                </label>
              </div>

              {config.autoCreateRecords && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">Record Types to Create:</p>
                  <div className="space-y-2">
                    {Object.entries(config.recordTemplates).map(([type, enabled]) => {
                      const typeLabels: Record<string, string> = {
                        a: "A Records (IPv4)",
                        aaaa: "AAAA Records (IPv6)",
                        ptr: "PTR Records (Reverse DNS)",
                        cname: "CNAME Records",
                      };
                      return (
                        <label
                          key={type}
                          className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                        >
                          <span className="text-sm font-medium text-slate-900">
                            {typeLabels[type] || type.toUpperCase()}
                          </span>
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                recordTemplates: {
                                  ...config.recordTemplates,
                                  [type]: e.target.checked,
                                },
                              })
                            }
                            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

