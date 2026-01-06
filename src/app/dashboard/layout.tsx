"use client";

import AppBackground from "@/components/AppBackground";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Footer from "@/components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppBackground />
      <div className="flex flex-col relative z-10 h-full overflow-hidden">
        <div className="flex flex-1 min-h-0">
          <DashboardSidebar />
          
          <div className="flex-1 lg:ml-64 flex flex-col min-h-0 overflow-hidden">
            <DashboardHeader />
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
              <main className="flex-1 py-8 w-full max-w-full overflow-x-hidden">
                <div className="max-w-7xl mx-auto w-full px-6">
                  {children}
                </div>
              </main>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

