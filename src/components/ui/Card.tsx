import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 w-full max-w-full min-w-0 ${className}`}>
      {children}
    </div>
  );
}

