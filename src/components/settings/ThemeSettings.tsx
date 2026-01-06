"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface ThemeConfig {
  theme: "light" | "dark" | "auto";
  density: "compact" | "normal" | "comfortable";
  defaultDashboard: "overview" | "pools" | "allocations";
  keyboardShortcuts: boolean;
}

export function ThemeSettings() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<ThemeConfig>({
    theme: "light",
    density: "normal",
    defaultDashboard: "overview",
    keyboardShortcuts: true,
  });

  const handleSave = () => {
    showToast("Theme settings saved successfully", "success");
  };

  const themes = [
    { value: "light", label: "Light", description: "Light theme for day use" },
    { value: "dark", label: "Dark", description: "Dark theme for low light" },
    { value: "auto", label: "Auto", description: "Follow system preference" },
  ];

  const densities = [
    { value: "compact", label: "Compact", description: "More information per screen" },
    { value: "normal", label: "Normal", description: "Balanced spacing" },
    { value: "comfortable", label: "Comfortable", description: "More spacing for readability" },
  ];

  const dashboardViews = [
    { value: "overview", label: "Overview Dashboard", description: "Main dashboard with stats" },
    { value: "pools", label: "Pool Management", description: "Start at pools page" },
    { value: "allocations", label: "IP Allocations", description: "Start at allocations page" },
  ];

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">UI/UX Settings</h3>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Save Changes
          </button>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Theme</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => setConfig({ ...config, theme: theme.value as ThemeConfig["theme"] })}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  config.theme === theme.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      config.theme === theme.value
                        ? "border-blue-600 bg-blue-600"
                        : "border-slate-300"
                    }`}
                  />
                  <span className="text-sm font-semibold text-slate-900">{theme.label}</span>
                </div>
                <p className="text-xs text-slate-600">{theme.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Interface Density</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {densities.map((density) => (
              <button
                key={density.value}
                onClick={() => setConfig({ ...config, density: density.value as ThemeConfig["density"] })}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  config.density === density.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      config.density === density.value
                        ? "border-blue-600 bg-blue-600"
                        : "border-slate-300"
                    }`}
                  />
                  <span className="text-sm font-semibold text-slate-900">{density.label}</span>
                </div>
                <p className="text-xs text-slate-600">{density.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Default Dashboard View</h4>
          <div className="space-y-3">
            {dashboardViews.map((view) => (
              <label
                key={view.value}
                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  config.defaultDashboard === view.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <input
                  type="radio"
                  name="defaultDashboard"
                  value={view.value}
                  checked={config.defaultDashboard === view.value}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      defaultDashboard: e.target.value as ThemeConfig["defaultDashboard"],
                    })
                  }
                  className="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-slate-900 block mb-1">
                    {view.label}
                  </span>
                  <span className="text-xs text-slate-600">{view.description}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Keyboard Shortcuts</h4>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.keyboardShortcuts}
                onChange={(e) => setConfig({ ...config, keyboardShortcuts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
          {config.keyboardShortcuts && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs font-medium text-slate-700 mb-2">Common Shortcuts:</p>
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Create New Pool</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-300 rounded font-mono">Ctrl + N</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Search IP</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-300 rounded font-mono">Ctrl + F</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Open Settings</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-300 rounded font-mono">Ctrl + ,</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Save Changes</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-300 rounded font-mono">Ctrl + S</kbd>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

