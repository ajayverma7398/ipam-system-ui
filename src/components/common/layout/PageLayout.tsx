"use client";

import { ReactNode } from "react";
import Breadcrumb from "./Breadcrumb";

interface PageLayoutProps {
  children: ReactNode;
  showBreadcrumb?: boolean;
  className?: string;
}

export default function PageLayout({
  children,
  showBreadcrumb = true,
  className = "",
}: PageLayoutProps) {
  return (
    <div className={`flex flex-col min-h-full w-full overflow-x-hidden ${className}`}>
      <main className="flex-1 py-8 w-full max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full px-6">
          {showBreadcrumb && <Breadcrumb />}
          <div className="w-full max-w-full min-w-0">{children}</div>
        </div>
      </main>
    </div>
  );
}

