"use client";

import { useState, useEffect, type ReactNode } from "react";

interface ClientOnlyChartProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ClientOnlyChart({ 
  children, 
  fallback = null,
  className,
  style 
}: ClientOnlyChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 100);
  }, []);

  if (!isMounted) {
    return (
      <div className={className} style={style}>
        {fallback}
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

