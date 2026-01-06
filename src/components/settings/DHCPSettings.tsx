"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";


interface DHCPServer {
  id: string;
  name: string;
  host: string;
  port: number;
  enabled: boolean;
  type: "isc-dhcp" | "windows-dhcp" | "other";
}

interface DHCPConfig {
  enabled: boolean;
  servers: DHCPServer[];
  syncScopes: boolean;
  syncLeases: boolean;
  syncReservations: boolean;
  syncInterval: number; 
}

export function DHCPSettings() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<DHCPConfig>({
    enabled: true,
    servers: [
      {
        id: "dhcp-001",
        name: "Primary DHCP",
        host: "192.168.1.20",
        port: 67,
        enabled: true,
        type: "isc-dhcp",
      },
    ],
    syncScopes: true,
    syncLeases: true,
    syncReservations: true,
    syncInterval: 15,
  });

  const [isAddingServer, setIsAddingServer] = useState(false);
  const [newServer, setNewServer] = useState<Partial<DHCPServer>>({
    name: "",
    host: "",
    port: 67,
    enabled: true,
    type: "isc-dhcp",
  });

  const handleSave = () => {
    showToast("DHCP settings saved successfully", "success");
  };

  const handleAddServer = () => {
    if (!newServer.name || !newServer.host) {
      showToast("Please fill in server name and host", "error");
      return;
    }
    const server: DHCPServer = {
      id: `dhcp-${Date.now()}`,
      name: newServer.name,
      host: newServer.host,
      port: newServer.port || 67,
      enabled: newServer.enabled ?? true,
      type: newServer.type || "isc-dhcp",
    };
    setConfig({
      ...config,
      servers: [...config.servers, server],
    });
    setNewServer({ name: "", host: "", port: 67, enabled: true, type: "isc-dhcp" });
    setIsAddingServer(false);
    showToast("DHCP server added", "success");
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
    showToast("DHCP server removed", "success");
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">DHCP Integration</h3>
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
              <p className="text-sm font-medium text-slate-900">Enable DHCP Integration</p>
            </div>
          </label>
        </div>

        {config.enabled && (
          <>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold text-slate-900">DHCP Servers</h4>
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
                        placeholder="e.g., Primary DHCP"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Host / IP</label>
                      <input
                        type="text"
                        value={newServer.host || ""}
                        onChange={(e) => setNewServer({ ...newServer, host: e.target.value })}
                        placeholder="e.g., 192.168.1.20"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Port</label>
                      <input
                        type="number"
                        value={newServer.port || 67}
                        onChange={(e) => setNewServer({ ...newServer, port: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Server Type</label>
                      <select
                        value={newServer.type || "isc-dhcp"}
                        onChange={(e) =>
                          setNewServer({ ...newServer, type: e.target.value as DHCPServer["type"] })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="isc-dhcp">ISC DHCP</option>
                        <option value="windows-dhcp">Windows DHCP</option>
                        <option value="other">Other</option>
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
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {server.type.replace("-", " ").toUpperCase()}
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
              <h4 className="text-md font-semibold text-slate-900 mb-4">Synchronization Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                  <div>
                    <span className="text-sm font-medium text-slate-900 block mb-1">Sync Scopes</span>
                    <span className="text-xs text-slate-600">
                      Synchronize DHCP scopes with IP pools
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.syncScopes}
                    onChange={(e) => setConfig({ ...config, syncScopes: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                  <div>
                    <span className="text-sm font-medium text-slate-900 block mb-1">Sync Leases</span>
                    <span className="text-xs text-slate-600">
                      Synchronize DHCP lease information with IP allocations
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.syncLeases}
                    onChange={(e) => setConfig({ ...config, syncLeases: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                  <div>
                    <span className="text-sm font-medium text-slate-900 block mb-1">Sync Reservations</span>
                    <span className="text-xs text-slate-600">
                      Synchronize DHCP reservations with IP reservations
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.syncReservations}
                    onChange={(e) => setConfig({ ...config, syncReservations: e.target.checked })}
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
                  How often to synchronize with DHCP servers
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

