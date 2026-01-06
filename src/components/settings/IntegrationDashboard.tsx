"use client";

import Card from "@/components/ui/Card";

interface Integration {
  id: string;
  name: string;
  category: "cmdb" | "monitoring" | "cloud" | "other";
  type: string;
  status: "connected" | "disconnected" | "error";
  description: string;
  icon: string;
}

export function IntegrationDashboard() {
  const integrations: Integration[] = [
    {
      id: "int-001",
      name: "ServiceNow CMDB",
      category: "cmdb",
      type: "ServiceNow",
      status: "connected",
      description: "Configuration item synchronization",
      icon: "🔗",
    },
    {
      id: "int-002",
      name: "Nagios Monitoring",
      category: "monitoring",
      type: "Nagios",
      status: "connected",
      description: "Health check and alert forwarding",
      icon: "📊",
    },
    {
      id: "int-003",
      name: "AWS Integration",
      category: "cloud",
      type: "AWS",
      status: "connected",
      description: "VPC and cloud IP management",
      icon: "☁️",
    },
    {
      id: "int-004",
      name: "Jira Integration",
      category: "other",
      type: "Jira",
      status: "disconnected",
      description: "Ticketing system integration",
      icon: "🎫",
    },
    {
      id: "int-005",
      name: "Prometheus",
      category: "monitoring",
      type: "Prometheus",
      status: "error",
      description: "Performance metrics export",
      icon: "📈",
    },
    {
      id: "int-006",
      name: "Azure Integration",
      category: "cloud",
      type: "Azure",
      status: "disconnected",
      description: "VNet synchronization",
      icon: "☁️",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      connected: { bg: "bg-green-100", text: "text-green-800" },
      disconnected: { bg: "bg-slate-100", text: "text-slate-800" },
      error: { bg: "bg-red-100", text: "text-red-800" },
    };
    return colors[status] || colors.disconnected;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      cmdb: "CMDB",
      monitoring: "Monitoring",
      cloud: "Cloud",
      other: "Other",
    };
    return labels[category] || category;
  };

  const stats = {
    total: integrations.length,
    connected: integrations.filter((i) => i.status === "connected").length,
    disconnected: integrations.filter((i) => i.status === "disconnected").length,
    error: integrations.filter((i) => i.status === "error").length,
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Integration Dashboard</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-1">Total Integrations</p>
            <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-700 mb-1">Connected</p>
            <p className="text-2xl font-bold text-green-900">{stats.connected}</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-xs font-medium text-slate-700 mb-1">Disconnected</p>
            <p className="text-2xl font-bold text-slate-900">{stats.disconnected}</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-medium text-red-700 mb-1">Errors</p>
            <p className="text-2xl font-bold text-red-900">{stats.error}</p>
          </div>
        </div>

        {["cmdb", "monitoring", "cloud", "other"].map((category) => {
          const categoryIntegrations = integrations.filter((i) => i.category === category);
          if (categoryIntegrations.length === 0) return null;

          return (
            <div key={category}>
              <h4 className="text-md font-semibold text-slate-900 mb-3">
                {getCategoryLabel(category)} Integrations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryIntegrations.map((integration) => {
                  const statusColors = getStatusColor(integration.status);
                  return (
                    <div
                      key={integration.id}
                      className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{integration.icon}</span>
                          <div>
                            <h5 className="text-sm font-semibold text-slate-900">
                              {integration.name}
                            </h5>
                            <p className="text-xs text-slate-500">{integration.type}</p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors.bg} ${statusColors.text}`}
                        >
                          {integration.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">{integration.description}</p>
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-blue-600 hover:text-blue-700">
                          Configure
                        </button>
                        <span className="text-slate-300">•</span>
                        <button className="text-xs text-slate-600 hover:text-slate-700">
                          Test Connection
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

