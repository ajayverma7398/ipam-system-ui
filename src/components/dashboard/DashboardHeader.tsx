"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function DashboardHeader() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getPageTitle = (): string => {
    if (!pathname) return "IPAM Dashboard";

    if (pathname === "/dashboard") {
      return "Dashboard";
    }
    if (pathname === "/dashboard/network-scan") {
      return "Network Scan Discovery";
    }
    if (pathname === "/dashboard/devices") {
      return "Network Devices";
    }
    if (pathname === "/dashboard/requests") {
      return "IP Allocation Request";
    }
    if (pathname === "/dashboard/profile") {
      return "Profile";
    }

    if (pathname === "/dashboard/activities") {
      return "Recent Activities";
    }

    if (pathname === "/dashboard/alerts") {
      return "System Alerts";
    }

    if (pathname === "/dashboard/about") {
      return "About";
    }

    if (pathname === "/dashboard/pools") {
      return "IP Pools";
    }
    if (pathname.startsWith("/dashboard/pools/create")) {
      return "Create Pool";
    }
    if (pathname.startsWith("/dashboard/pools/bulk")) {
      return "Bulk Operations";
    }
    if (pathname.match(/^\/dashboard\/pools\/[^/]+\/edit$/)) {
      return "Edit Pool";
    }
    if (pathname.match(/^\/dashboard\/pools\/[^/]+$/)) {
      return "Pool Details";
    }

    if (pathname === "/dashboard/ip-management") {
      return "IP Management";
    }
    if (pathname === "/dashboard/ip-management/allocate") {
      return "Allocate IP";
    }
    if (pathname === "/dashboard/ip-management/find") {
      return "Advanced IP Search";
    }
    if (pathname === "/dashboard/ip-management/calculator") {
      return "CIDR Calculator";
    }
    if (pathname === "/dashboard/ip-management/bulk") {
      return "Bulk IP Operations";
    }
    if (pathname === "/dashboard/ip-management/history") {
      return "Allocation History";
    }

    if (pathname === "/dashboard/reports") {
      return "Reports & Analytics";
    }
    if (pathname === "/dashboard/reports/utilization") {
      return "Utilization Reports";
    }
    if (pathname === "/dashboard/reports/allocation") {
      return "Allocation Reports";
    }
    if (pathname === "/dashboard/reports/capacity") {
      return "Capacity Planning";
    }
    if (pathname === "/dashboard/reports/audit") {
      return "Audit Reports";
    }
    if (pathname === "/dashboard/reports/custom") {
      return "Custom Report Builder";
    }
    if (pathname === "/dashboard/reports/schedule") {
      return "Scheduled Reports";
    }

    if (pathname === "/dashboard/settings") {
      return "Settings";
    }
    if (pathname === "/dashboard/settings/general") {
      return "General Settings";
    }
    if (pathname === "/dashboard/settings/network") {
      return "Network Settings";
    }
    if (pathname === "/dashboard/settings/integrations") {
      return "Integration Settings";
    }
    if (pathname === "/dashboard/settings/users") {
      return "User Management";
    }
    if (pathname === "/dashboard/settings/users/create") {
      return "Create User";
    }
    if (pathname.match(/^\/dashboard\/settings\/users\/[^/]+\/edit$/)) {
      return "Edit User";
    }
    if (pathname === "/dashboard/settings/users/ldap") {
      return "Import from LDAP/AD";
    }
    if (pathname === "/dashboard/settings/permissions") {
      return "Manage Permissions";
    }
    if (pathname === "/dashboard/settings/api") {
      return "API Configuration";
    }
    if (pathname === "/dashboard/settings/audit") {
      return "Audit Configuration";
    }
    if (pathname === "/dashboard/settings/backup") {
      return "Backup & Restore";
    }

    return "IPAM Dashboard";
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getPageDescription = (): string => {
    if (!pathname) {
      return "Full system access and management";
    }

    if (pathname === "/dashboard") {
      return "Full system access and management";
    }
    if (pathname === "/dashboard/network-scan") {
      return "Scan and discover network devices";
    }
    if (pathname === "/dashboard/devices") {
      return "Manage network devices";
    }
    if (pathname === "/dashboard/requests") {
      return "View and manage IP allocation requests";
    }
    if (pathname === "/dashboard/profile") {
      return "Manage your profile and preferences";
    }

    if (pathname === "/dashboard/activities") {
      return "Complete activity log with filtering and export capabilities";
    }

    if (pathname === "/dashboard/alerts") {
      return "Monitor and manage all system alerts with filtering and export capabilities";
    }

    if (pathname === "/dashboard/about") {
      return "About the IPAM system";
    }

    if (pathname === "/dashboard/pools") {
      return "Manage IP address pools";
    }
    if (pathname.startsWith("/dashboard/pools/create")) {
      return "Create a new IP address pool";
    }
    if (pathname.startsWith("/dashboard/pools/bulk")) {
      return "Bulk pool operations and imports";
    }
    if (pathname.match(/^\/dashboard\/pools\/[^/]+\/edit$/)) {
      return "Edit pool configuration";
    }
    if (pathname.match(/^\/dashboard\/pools\/[^/]+$/)) {
      return "View pool details and allocations";
    }

    if (pathname === "/dashboard/ip-management") {
      return "Search, allocate, and manage IP addresses";
    }
    if (pathname === "/dashboard/ip-management/allocate") {
      return "Allocate IP addresses to devices";
    }
    if (pathname === "/dashboard/ip-management/find") {
      return "Advanced IP address search";
    }
    if (pathname === "/dashboard/ip-management/calculator") {
      return "Calculate CIDR and subnet information";
    }
    if (pathname === "/dashboard/ip-management/bulk") {
      return "Bulk IP allocation and release operations";
    }
    if (pathname === "/dashboard/ip-management/history") {
      return "View IP allocation history";
    }

    if (pathname === "/dashboard/reports") {
      return "Generate and manage reports";
    }
    if (pathname === "/dashboard/reports/utilization") {
      return "Pool utilization analytics and trends";
    }
    if (pathname === "/dashboard/reports/allocation") {
      return "IP allocation statistics and reports";
    }
    if (pathname === "/dashboard/reports/capacity") {
      return "Capacity planning and forecasting";
    }
    if (pathname === "/dashboard/reports/audit") {
      return "Audit trail and compliance reports";
    }
    if (pathname === "/dashboard/reports/custom") {
      return "Build custom reports";
    }
    if (pathname === "/dashboard/reports/schedule") {
      return "Manage scheduled reports";
    }

    if (pathname === "/dashboard/settings") {
      return "System configuration and preferences";
    }
    if (pathname === "/dashboard/settings/general") {
      return "General system settings";
    }
    if (pathname === "/dashboard/settings/network") {
      return "Network and DNS configuration";
    }
    if (pathname === "/dashboard/settings/integrations") {
      return "Third-party integrations";
    }
    if (pathname === "/dashboard/settings/users") {
      return "User accounts, roles, and permissions";
    }
    if (pathname === "/dashboard/settings/users/create") {
      return "Create a new user account";
    }
    if (pathname.match(/^\/dashboard\/settings\/users\/[^/]+\/edit$/)) {
      return "Update user account information";
    }
    if (pathname === "/dashboard/settings/users/ldap") {
      return "Import users from LDAP/Active Directory";
    }
    if (pathname === "/dashboard/settings/permissions") {
      return "Fine-grained permission control and role management";
    }
    if (pathname === "/dashboard/settings/api") {
      return "API keys and webhook settings";
    }
    if (pathname === "/dashboard/settings/audit") {
      return "Audit logging and compliance";
    }
    if (pathname === "/dashboard/settings/backup") {
      return "Manage system backups and restore operations";
    }

    return "Full system access and management";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="bg-[#0f2f4f]/90 max-h-[77px] backdrop-blur-sm border-b border-white/20 shadow-sm z-30">
      <div className="px-6 py-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>
          </div>
          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2b6cb0] text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs text-white/70">admin</p>
              </div>
              <svg
                className={`w-4 h-4 text-white/80 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
                <div className="border-t border-slate-200 my-1" />
                <Link
                  href="/auth/login"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

