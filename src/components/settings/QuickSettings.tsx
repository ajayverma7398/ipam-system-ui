"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface QuickSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  category: "general" | "performance" | "security" | "notifications";
}

export function QuickSettings() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<QuickSetting[]>([
    {
      id: "auto-allocation",
      label: "Auto IP Allocation",
      description: "Automatically assign IPs when requested",
      enabled: true,
      category: "general",
    },
    {
      id: "email-notifications",
      label: "Email Notifications",
      description: "Send email alerts for important events",
      enabled: true,
      category: "notifications",
    },
    {
      id: "audit-logging",
      label: "Audit Logging",
      description: "Log all system changes and user actions",
      enabled: true,
      category: "security",
    },
    {
      id: "cache-enabled",
      label: "Data Caching",
      description: "Enable caching for improved performance",
      enabled: true,
      category: "performance",
    },
    {
      id: "api-rate-limiting",
      label: "API Rate Limiting",
      description: "Limit API requests per minute",
      enabled: false,
      category: "security",
    },
    {
      id: "auto-backup",
      label: "Automatic Backups",
      description: "Automatically backup configuration daily",
      enabled: true,
      category: "general",
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(
      settings.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
    const setting = settings.find((s) => s.id === id);
    showToast(`${setting?.label} ${setting?.enabled ? "disabled" : "enabled"}`, "success");
  };

  const handleResetDefaults = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      showToast("Settings reset to defaults", "success");
    }
  };

  const handleExportSettings = () => {
    const settingsJson = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsJson], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ipam-settings-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showToast("Settings exported successfully", "success");
  };

  const handleImportSettings = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            setSettings(imported);
            showToast("Settings imported successfully", "success");
          } catch {
            showToast("Failed to import settings. Invalid file format.", "error");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleOptimize = () => {
    showToast("Settings optimized for performance", "success");
  };

  const categories = ["general", "performance", "security", "notifications"] as const;
  const categoryLabels: Record<string, string> = {
    general: "General",
    performance: "Performance",
    security: "Security",
    notifications: "Notifications",
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Quick Settings</h3>
            <p className="text-sm text-slate-600">Common settings and quick actions</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOptimize}
              className="px-3 py-2 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              Optimize
            </button>
            <button
              onClick={handleResetDefaults}
              className="px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              Reset Defaults
            </button>
          </div>
        </div>

        {categories.map((category) => {
          const categorySettings = settings.filter((s) => s.category === category);
          if (categorySettings.length === 0) return null;

          return (
            <div key={category}>
              <h4 className="text-md font-semibold text-slate-900 mb-3">
                {categoryLabels[category]}
              </h4>
              <div className="space-y-3">
                {categorySettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-slate-900">{setting.label}</span>
                      </div>
                      <p className="text-xs text-slate-600">{setting.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={setting.enabled}
                        onChange={() => toggleSetting(setting.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Settings Management</h4>
              <p className="text-xs text-slate-600">Import or export your configuration</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleImportSettings}
                className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Import
              </button>
              <button
                onClick={handleExportSettings}
                className="px-4 py-2 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

