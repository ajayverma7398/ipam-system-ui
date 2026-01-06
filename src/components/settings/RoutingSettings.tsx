"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface StaticRoute {
  id: string;
  network: string;
  gateway: string;
  interface: string;
  metric: number;
  enabled: boolean;
}

interface VLAN {
  id: string;
  vlanId: number;
  name: string;
  description: string;
  enabled: boolean;
}

interface RoutingConfig {
  staticRoutes: StaticRoute[];
  firewallSync: boolean;
  deviceIntegration: boolean;
  vlans: VLAN[];
}

export function RoutingSettings() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<RoutingConfig>({
    staticRoutes: [
      {
        id: "route-001",
        network: "10.0.0.0/8",
        gateway: "192.168.1.1",
        interface: "eth0",
        metric: 10,
        enabled: true,
      },
    ],
    firewallSync: false,
    deviceIntegration: true,
    vlans: [
      {
        id: "vlan-001",
        vlanId: 10,
        name: "Management",
        description: "Management network VLAN",
        enabled: true,
      },
      {
        id: "vlan-002",
        vlanId: 20,
        name: "Production",
        description: "Production network VLAN",
        enabled: true,
      },
    ],
  });

  const [isAddingRoute, setIsAddingRoute] = useState(false);
  const [newRoute, setNewRoute] = useState<Partial<StaticRoute>>({
    network: "",
    gateway: "",
    interface: "eth0",
    metric: 10,
    enabled: true,
  });

  const [isAddingVLAN, setIsAddingVLAN] = useState(false);
  const [newVLAN, setNewVLAN] = useState<Partial<VLAN>>({
    vlanId: 1,
    name: "",
    description: "",
    enabled: true,
  });

  const handleSave = () => {
    showToast("Routing settings saved successfully", "success");
  };

  const handleAddRoute = () => {
    if (!newRoute.network || !newRoute.gateway) {
      showToast("Please fill in network and gateway", "error");
      return;
    }
    const route: StaticRoute = {
      id: `route-${Date.now()}`,
      network: newRoute.network,
      gateway: newRoute.gateway,
      interface: newRoute.interface || "eth0",
      metric: newRoute.metric || 10,
      enabled: newRoute.enabled ?? true,
    };
    setConfig({
      ...config,
      staticRoutes: [...config.staticRoutes, route],
    });
    setNewRoute({ network: "", gateway: "", interface: "eth0", metric: 10, enabled: true });
    setIsAddingRoute(false);
    showToast("Static route added", "success");
  };

  const toggleRoute = (id: string) => {
    setConfig({
      ...config,
      staticRoutes: config.staticRoutes.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    });
  };

  const removeRoute = (id: string) => {
    setConfig({
      ...config,
      staticRoutes: config.staticRoutes.filter((r) => r.id !== id),
    });
    showToast("Static route removed", "success");
  };

  const handleAddVLAN = () => {
    if (!newVLAN.name || !newVLAN.vlanId) {
      showToast("Please fill in VLAN ID and name", "error");
      return;
    }
    const vlan: VLAN = {
      id: `vlan-${Date.now()}`,
      vlanId: newVLAN.vlanId || 1,
      name: newVLAN.name,
      description: newVLAN.description || "",
      enabled: newVLAN.enabled ?? true,
    };
    setConfig({
      ...config,
      vlans: [...config.vlans, vlan],
    });
    setNewVLAN({ vlanId: 1, name: "", description: "", enabled: true });
    setIsAddingVLAN(false);
    showToast("VLAN added", "success");
  };

  const toggleVLAN = (id: string) => {
    setConfig({
      ...config,
      vlans: config.vlans.map((v) => (v.id === id ? { ...v, enabled: !v.enabled } : v)),
    });
  };

  const removeVLAN = (id: string) => {
    setConfig({
      ...config,
      vlans: config.vlans.filter((v) => v.id !== id),
    });
    showToast("VLAN removed", "success");
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Routing & Firewall</h3>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Save Changes
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-slate-900">Static Routes</h4>
            <button
              onClick={() => setIsAddingRoute(!isAddingRoute)}
              className="px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              {isAddingRoute ? "Cancel" : "+ Add Route"}
            </button>
          </div>

          {isAddingRoute && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Network (CIDR)</label>
                  <input
                    type="text"
                    value={newRoute.network || ""}
                    onChange={(e) => setNewRoute({ ...newRoute, network: e.target.value })}
                    placeholder="e.g., 10.0.0.0/8"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gateway</label>
                  <input
                    type="text"
                    value={newRoute.gateway || ""}
                    onChange={(e) => setNewRoute({ ...newRoute, gateway: e.target.value })}
                    placeholder="e.g., 192.168.1.1"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Interface</label>
                  <input
                    type="text"
                    value={newRoute.interface || "eth0"}
                    onChange={(e) => setNewRoute({ ...newRoute, interface: e.target.value })}
                    placeholder="e.g., eth0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Metric</label>
                  <input
                    type="number"
                    min="1"
                    value={newRoute.metric || 10}
                    onChange={(e) => setNewRoute({ ...newRoute, metric: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsAddingRoute(false)}
                  className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRoute}
                  className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
                >
                  Add Route
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {config.staticRoutes.map((route) => (
              <div
                key={route.id}
                className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono font-semibold text-slate-900">{route.network}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          route.enabled
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {route.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 space-y-1">
                      <div>
                        <span className="font-medium">Gateway:</span>
                        <span className="ml-2 font-mono">{route.gateway}</span>
                      </div>
                      <div>
                        <span className="font-medium">Interface:</span>
                        <span className="ml-2 font-mono">{route.interface}</span>
                        <span className="mx-2">•</span>
                        <span className="font-medium">Metric:</span>
                        <span className="ml-2">{route.metric}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleRoute(route.id)}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        route.enabled
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {route.enabled ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => removeRoute(route.id)}
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
          <h4 className="text-md font-semibold text-slate-900 mb-4">Firewall & Device Integration</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
              <div>
                <span className="text-sm font-medium text-slate-900 block mb-1">Firewall Rule Synchronization</span>
                <span className="text-xs text-slate-600">
                  Automatically sync firewall rules with IP allocations
                </span>
              </div>
              <input
                type="checkbox"
                checked={config.firewallSync}
                onChange={(e) => setConfig({ ...config, firewallSync: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
              <div>
                <span className="text-sm font-medium text-slate-900 block mb-1">Network Device Integration</span>
                <span className="text-xs text-slate-600">
                  Integrate with network devices (routers, switches) for configuration
                </span>
              </div>
              <input
                type="checkbox"
                checked={config.deviceIntegration}
                onChange={(e) => setConfig({ ...config, deviceIntegration: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-slate-900">VLAN Configuration</h4>
            <button
              onClick={() => setIsAddingVLAN(!isAddingVLAN)}
              className="px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              {isAddingVLAN ? "Cancel" : "+ Add VLAN"}
            </button>
          </div>

          {isAddingVLAN && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">VLAN ID</label>
                  <input
                    type="number"
                    min="1"
                    max="4094"
                    value={newVLAN.vlanId || 1}
                    onChange={(e) => setNewVLAN({ ...newVLAN, vlanId: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">VLAN Name</label>
                  <input
                    type="text"
                    value={newVLAN.name || ""}
                    onChange={(e) => setNewVLAN({ ...newVLAN, name: e.target.value })}
                    placeholder="e.g., Management"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={newVLAN.description || ""}
                    onChange={(e) => setNewVLAN({ ...newVLAN, description: e.target.value })}
                    placeholder="e.g., Management network VLAN"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsAddingVLAN(false)}
                  className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddVLAN}
                  className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
                >
                  Add VLAN
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {config.vlans.map((vlan) => (
              <div
                key={vlan.id}
                className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-slate-900">VLAN {vlan.vlanId}</span>
                      <span className="text-sm font-medium text-slate-900">{vlan.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          vlan.enabled
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {vlan.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    {vlan.description && (
                      <p className="text-sm text-slate-600">{vlan.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleVLAN(vlan.id)}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        vlan.enabled
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {vlan.enabled ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => removeVLAN(vlan.id)}
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
      </div>
    </Card>
  );
}

