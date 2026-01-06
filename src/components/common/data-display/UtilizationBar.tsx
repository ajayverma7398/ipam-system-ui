"use client";


interface UtilizationBarProps {
  used: number;
  total: number;
  showPercentage?: boolean;
  className?: string;
  label?: string;
}

export default function UtilizationBar({
  used,
  total,
  showPercentage = true,
  className = "",
  label,
}: UtilizationBarProps) {
  const percentage = total > 0 ? Math.round((used / total) * 100) : 0;
  
  const getColorClass = () => {
    if (percentage < 25) return "bg-green-500";
    if (percentage < 50) return "bg-green-500";
    if (percentage < 75) return "bg-yellow-500";
    if (percentage < 90) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-slate-900">{label}</span>
          {showPercentage && (
            <span className={`text-sm font-semibold ${
              percentage < 50 ? "text-green-600" :
              percentage < 75 ? "text-yellow-600" :
              percentage < 90 ? "text-orange-600" : "text-red-600"
            }`}>
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getColorClass()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${percentage}% utilized`}
        />
      </div>
      {!label && showPercentage && (
        <div className="flex items-center justify-between mt-1 text-xs text-slate-600">
          <span>{used.toLocaleString()} / {total.toLocaleString()}</span>
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  );
}

