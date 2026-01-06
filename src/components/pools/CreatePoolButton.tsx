"use client";

import Link from "next/link";

interface CreatePoolButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CreatePoolButton({ variant = "primary", size = "md", className = "" }: CreatePoolButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    primary: "bg-[#2b6cb0] text-white hover:bg-[#2563eb]",
    secondary: "bg-white/90 backdrop-blur-sm text-[#2b6cb0] hover:bg-white border border-[#2b6cb0]",
  };

  return (
    <Link
      href="/dashboard/pools/create"
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-lg transition-colors flex items-center gap-2 font-medium ${className}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Create Pool
    </Link>
  );
}
