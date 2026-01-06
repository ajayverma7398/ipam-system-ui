"use client";

import Card from "@/components/ui/Card";

interface ReportCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  route: string;
  color: string;
}

export function ReportDashboard() {
  const categories: ReportCategory[] = [
    {
      id: "utilization",
      name: "Utilization Reports",
      description: "Network and pool utilization metrics",
      icon: "📊",
      count: 12,
      route: "/dashboard/reports/utilization",
      color: "blue",
    },
    {
      id: "allocation",
      name: "Allocation Reports",
      description: "IP allocation and release statistics",
      icon: "📈",
      count: 8,
      route: "/dashboard/reports/allocation",
      color: "green",
    },
    {
      id: "capacity",
      name: "Capacity Planning",
      description: "Forecast and capacity analysis",
      icon: "📉",
      count: 6,
      route: "/dashboard/reports/capacity",
      color: "purple",
    },
    {
      id: "audit",
      name: "Audit Reports",
      description: "Compliance and audit trail reports",
      icon: "📋",
      count: 10,
      route: "/dashboard/reports/audit",
      color: "yellow",
    },
    {
      id: "custom",
      name: "Custom Reports",
      description: "Build and manage custom reports",
      icon: "🛠️",
      count: 0,
      route: "/dashboard/reports/custom",
      color: "slate",
    },
  ];

  const colorClasses: Record<string, { bg: string; border: string; hover: string }> = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      hover: "hover:bg-blue-100",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      hover: "hover:bg-green-100",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      hover: "hover:bg-purple-100",
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      hover: "hover:bg-yellow-100",
    },
    slate: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      hover: "hover:bg-slate-100",
    },
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Report Categories</h3>
          <p className="text-sm text-slate-600">Browse reports by category</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const colors = colorClasses[category.color];
            return (
              <a
                key={category.id}
                href={category.route}
                className={`p-6 ${colors.bg} ${colors.border} border-2 rounded-lg transition-colors ${colors.hover} cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{category.icon}</div>
                  {category.count > 0 && (
                    <span className="px-2 py-1 bg-white rounded-full text-xs font-semibold text-slate-700">
                      {category.count}
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-1">{category.name}</h4>
                <p className="text-sm text-slate-600">{category.description}</p>
              </a>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

