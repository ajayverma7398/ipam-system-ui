"use client";

import { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  onClick?: () => void;
  className?: string;
}

export default function InfoCard({
  title,
  value,
  icon,
  trend,
  description,
  onClick,
  className = "",
}: InfoCardProps) {
  const cardClasses = `
    bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20
    ${onClick ? "cursor-pointer hover:shadow-xl hover:border-white/40 transition-all" : ""}
    ${className}
  `;

  return (
    <div className={cardClasses} onClick={onClick} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {trend && (
              <span className={`text-sm font-medium ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}>
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

