"use client";


export type StatusType = "available" | "reserved" | "allocated" | "pending" | "expired" | "system";
export type BadgeType = "ip" | "pool";

interface StatusBadgeProps {
  status: StatusType;
  type?: BadgeType;
  tooltip?: string;
  className?: string;
}

const statusConfig: Record<StatusType, { color: string; icon?: React.ReactNode }> = {
  available: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  reserved: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  allocated: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  pending: {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  expired: {
    color: "bg-slate-100 text-slate-800 border-slate-200",
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  system: {
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
};

export default function StatusBadge({
  status,
  type = "ip",
  tooltip,
  className = "",
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color} ${className}`}
      title={tooltip}
      aria-label={`Status: ${label}${tooltip ? ` - ${tooltip}` : ""}`}
    >
      {config.icon}
      <span>{label}</span>
    </span>
  );
}

