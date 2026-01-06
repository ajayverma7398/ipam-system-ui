"use client";

import Card from "@/components/ui/Card";

interface VisualizationType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "chart" | "table" | "kpi" | "map";
}

export function VisualizationPicker({
  selectedType,
  onTypeSelect,
}: {
  selectedType: string | null;
  onTypeSelect: (typeId: string) => void;
}) {
  const visualizationTypes: VisualizationType[] = [
    {
      id: "bar",
      name: "Bar Chart",
      description: "Vertical or horizontal bar chart",
      icon: "📊",
      category: "chart",
    },
    {
      id: "line",
      name: "Line Chart",
      description: "Line chart for trends over time",
      icon: "📈",
      category: "chart",
    },
    {
      id: "pie",
      name: "Pie Chart",
      description: "Circular chart for proportions",
      icon: "🥧",
      category: "chart",
    },
    {
      id: "scatter",
      name: "Scatter Plot",
      description: "Scatter plot for correlations",
      icon: "⚫",
      category: "chart",
    },
    {
      id: "table",
      name: "Data Table",
      description: "Sortable and filterable table",
      icon: "📋",
      category: "table",
    },
    {
      id: "kpi",
      name: "KPI Cards",
      description: "Key performance indicator cards",
      icon: "🎯",
      category: "kpi",
    },
    {
      id: "heatmap",
      name: "Heat Map",
      description: "Heat map visualization",
      icon: "🔥",
      category: "map",
    },
    {
      id: "treemap",
      name: "Tree Map",
      description: "Hierarchical tree map",
      icon: "🌳",
      category: "map",
    },
  ];

  const categories = Array.from(new Set(visualizationTypes.map((v) => v.category)));

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Visualization Types</h3>
          <p className="text-sm text-slate-600">Choose how to visualize your data</p>
        </div>

        {categories.map((category) => (
          <div key={category}>
            <h4 className="text-md font-semibold text-slate-900 mb-3 capitalize">{category}s</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {visualizationTypes
                .filter((v) => v.category === category)
                .map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedType === type.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                    onClick={() => onTypeSelect(type.id)}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <h5 className="text-sm font-semibold text-slate-900 mb-1">{type.name}</h5>
                      <p className="text-xs text-slate-600">{type.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

