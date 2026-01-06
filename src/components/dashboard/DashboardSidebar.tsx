"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SubNavItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  subItems?: SubNavItem[];
}

const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: "Pools",
      href: "/dashboard/pools",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      subItems: [
        { name: "All Pools", href: "/dashboard/pools" },
        { name: "Create Pool", href: "/dashboard/pools/create" },
        { name: "Bulk Operations", href: "/dashboard/pools/bulk" },
      ],
    },
    {
      name: "IP Management",
      href: "/dashboard/ip-management",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      subItems: [
        { name: "IP Finder", href: "/dashboard/ip-management" },
        { name: "Allocate IP", href: "/dashboard/ip-management/allocate" },
        { name: "Bulk Operations", href: "/dashboard/ip-management/bulk" },
        { name: "Calculator", href: "/dashboard/ip-management/calculator" },
        { name: "Find", href: "/dashboard/ip-management/find" },
        { name: "History", href: "/dashboard/ip-management/history" },
      ],
    },
    {
      name: "Reports",
      href: "/dashboard/reports",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      subItems: [
        { name: "All Reports", href: "/dashboard/reports" },
        { name: "Allocation", href: "/dashboard/reports/allocation" },
        { name: "Audit", href: "/dashboard/reports/audit" },
        { name: "Capacity", href: "/dashboard/reports/capacity" },
        { name: "Custom", href: "/dashboard/reports/custom" },
        { name: "Schedule", href: "/dashboard/reports/schedule" },
        { name: "Utilization", href: "/dashboard/reports/utilization" },
      ],
    },
    {
      name: "Devices",
      href: "/dashboard/devices",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      name: "Network Scan",
      href: "/dashboard/network-scan",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: "Requests",
      href: "/dashboard/requests",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      subItems: [
        { name: "General", href: "/dashboard/settings/general" },
        { name: "Network", href: "/dashboard/settings/network" },
        { name: "Integrations", href: "/dashboard/settings/integrations" },
        { name: "Users", href: "/dashboard/settings/users" },
        { name: "Permissions", href: "/dashboard/settings/permissions" },
        { name: "API", href: "/dashboard/settings/api" },
        { name: "Audit", href: "/dashboard/settings/audit" },
        { name: "Backup", href: "/dashboard/settings/backup" },
      ],
    },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [manuallyToggledItems, setManuallyToggledItems] = useState<Set<string>>(new Set());

  // Auto-expand items if a sub-item route is active (only if not manually toggled) 
  const getInitialExpandedState = (): Set<string> => {
    const autoExpanded = new Set<string>();
    navItems.forEach((item) => {
      if (item.subItems && !manuallyToggledItems.has(item.name)) {
        const hasActiveSubItem = item.subItems.some((subItem) =>
          pathname === subItem.href || pathname?.startsWith(subItem.href + "/")
        );
        if (hasActiveSubItem || pathname === item.href || pathname?.startsWith(item.href + "/")) {
          autoExpanded.add(item.name);
        }
      }
    });
    return autoExpanded;
  };

  // Update expanded items when pathname changes (for auto-expand)
  const autoExpandedItems = getInitialExpandedState();
  const finalExpandedItems = new Set([...autoExpandedItems, ...expandedItems]);

  const toggleExpand = (itemName: string) => {
    setManuallyToggledItems((prev) => new Set(prev).add(itemName));
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  const isActive = (href: string) => {
    if (href === "#") return false;
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const isSubItemActive = (href: string) => {
    if (href === "#") return false;
    return pathname === href;
  };

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden rounded-lg bg-[#0f2f4f]/90 backdrop-blur-sm p-2 shadow-lg border border-white/20"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-[#0f2f4f]/90 backdrop-blur-sm border-r border-white/20 shadow-lg transition-transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-white/20 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2b6cb0] text-white">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="12" r="3.5" fill="white" />
              <circle cx="12" cy="20" r="3.5" fill="white" />
              <circle cx="28" cy="20" r="3.5" fill="white" />
              <circle cx="20" cy="28" r="3.5" fill="white" />
              <line x1="20" y1="12" x2="12" y2="20" stroke="white" strokeWidth="2.5" />
              <line x1="20" y1="12" x2="28" y2="20" stroke="white" strokeWidth="2.5" />
              <line x1="12" y1="20" x2="20" y2="28" stroke="white" strokeWidth="2.5" />
              <line x1="28" y1="20" x2="20" y2="28" stroke="white" strokeWidth="2.5" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">IPAM System</h2>
            <p className="text-xs text-white/70">Admin Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const isExpanded = finalExpandedItems.has(item.name);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            const hasActiveSubItem = hasSubItems && item.subItems!.some((subItem) => isSubItemActive(subItem.href));
            const isParentActive = active || hasActiveSubItem;

            return (
              <div key={item.name}>
                <div className="flex items-center">
                  {hasSubItems ? (
                    <button
                      onClick={() => {
                        toggleExpand(item.name);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isParentActive
                          ? "bg-[#3b82f6]/60 text-white shadow-sm"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className={isParentActive ? "text-white" : "text-white/60"}>{item.icon}</span>
                      <span className="flex-1 text-left">{item.name}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isParentActive
                          ? "bg-[#3b82f6]/60 text-white shadow-sm"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className={isParentActive ? "text-white" : "text-white/60"}>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
                {hasSubItems && isExpanded && (
                  <div className={`ml-4 mt-1 space-y-1 border-l pl-2 ${
                    isParentActive ? "border-[#3b82f6]/40" : "border-white/20"
                  }`}>
                    {item.subItems!.map((subItem) => {
                      const subActive = isSubItemActive(subItem.href);
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                            subActive
                              ? "bg-[#3b82f6]/60 text-white shadow-sm border-l-2 border-[#60a5fa] pl-2"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            subActive ? "bg-[#60a5fa] opacity-100" : "bg-current opacity-60"
                          }`} />
                          <span>{subItem.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
      </aside>
    </>
  );
}
