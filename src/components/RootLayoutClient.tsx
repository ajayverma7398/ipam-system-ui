"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isDashboardPage = pathname?.startsWith("/dashboard");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <main className={`flex-1 flex flex-col ${isDashboardPage ? "overflow-hidden" : "overflow-y-auto"}`}>
        {children}
      </main>
      {!isAuthPage && !isDashboardPage && <Footer />}
    </div>
  );
}

