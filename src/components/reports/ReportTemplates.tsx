"use client";

import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  preview?: string;
}

export function ReportTemplates() {
  const { showToast } = useToast();

  const templates: ReportTemplate[] = [
    {
      id: "template-001",
      name: "Pool Utilization Overview",
      description: "Comprehensive utilization metrics for all pools",
      category: "utilization",
      icon: "📊",
    },
    {
      id: "template-002",
      name: "Allocation Trends",
      description: "Historical IP allocation trends and patterns",
      category: "allocation",
      icon: "📈",
    },
    {
      id: "template-003",
      name: "Capacity Forecast",
      description: "Future capacity predictions and recommendations",
      category: "capacity",
      icon: "🔮",
    },
    {
      id: "template-004",
      name: "Audit Trail Report",
      description: "Complete audit log with filtering options",
      category: "audit",
      icon: "📋",
    },
    {
      id: "template-005",
      name: "Expiring IPs Report",
      description: "List of IPs expiring soon with renewal options",
      category: "allocation",
      icon: "⏰",
    },
    {
      id: "template-006",
      name: "Top Utilized Pools",
      description: "Pools with highest utilization rates",
      category: "utilization",
      icon: "🏆",
    },
  ];

  const handleUseTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    showToast(`Using template: ${template?.name}`, "success");
  };

  const handlePreviewTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    showToast(`Preview: ${template?.name}`, "info");
  };

  const categories = Array.from(new Set(templates.map((t) => t.category)));

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Report Templates</h3>
          <p className="text-sm text-slate-600">Pre-built templates for common reports</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => showToast("Filter: All", "info")}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => showToast(`Filter: ${category}`, "info")}
              className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm capitalize"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{template.icon}</span>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">{template.name}</h4>
                  <p className="text-xs text-slate-600">{template.description}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium capitalize">
                    {template.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Use Template
                </button>
                <button
                  onClick={() => handlePreviewTemplate(template.id)}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                  title="Preview"
                >
                  👁️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

