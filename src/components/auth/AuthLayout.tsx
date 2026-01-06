'use client';

import { ReactNode } from 'react';

export interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center relative py-8">
      <div className="relative z-20 mb-6 sm:mb-8 flex items-center justify-center gap-3 px-4">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 sm:w-10 sm:h-10"
        >
          <circle cx="20" cy="12" r="3.5" fill="#3b82f6" />
          <circle cx="12" cy="20" r="3.5" fill="#3b82f6" />
          <circle cx="28" cy="20" r="3.5" fill="#3b82f6" />
          <circle cx="20" cy="28" r="3.5" fill="#3b82f6" />
          <line x1="20" y1="12" x2="12" y2="20" stroke="#3b82f6" strokeWidth="2.5" />
          <line x1="20" y1="12" x2="28" y2="20" stroke="#3b82f6" strokeWidth="2.5" />
          <line x1="12" y1="20" x2="20" y2="28" stroke="#3b82f6" strokeWidth="2.5" />
          <line x1="28" y1="20" x2="20" y2="28" stroke="#3b82f6" strokeWidth="2.5" />
        </svg>
        <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">IPAM System</h1>
      </div>
    
      <div className="relative z-20 w-full max-w-md px-4 sm:px-6 md:px-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 border border-white/20">
          {title && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
              {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

