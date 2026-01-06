"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  const hasSidebar = pathname?.startsWith("/dashboard");
  
  return (
    <footer 
      className={`bg-[#0f2f4f]/90 backdrop-blur-sm border-t border-white/20 shadow-sm relative z-50 mt-auto ${hasSidebar ? "" : "w-full"}`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/80">
            © {new Date().getFullYear()} IPAM System. All rights reserved.
          </p>
          <p className="text-sm text-white/80 whitespace-nowrap">
            Design and development by <span className="font-semibold text-white">Ashish</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
