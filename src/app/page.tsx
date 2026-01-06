import Link from "next/link";
import AppBackground from "@/components/AppBackground";

export default function Home() {
  return (
    <>
      <AppBackground />
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center text-slate-100 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Welcome to IPAM System
            </h1>
            <p className="text-xl md:text-2xl text-slate-200/90">
              Address management, simplified.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-lg text-slate-200/80 max-w-2xl mx-auto">
              A comprehensive IP Address Management platform designed to help you efficiently 
              manage your network infrastructure, track IP allocations, and streamline your 
              workflow with role-based dashboards.
            </p>
            <p className="text-base text-slate-300/70 max-w-2xl mx-auto">
              Get started by creating an account or sign in to access your dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto rounded-xl bg-emerald-500 px-8 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 hover:shadow-emerald-500/40"
            >
              Sign Up
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/10 px-8 py-3 text-base font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/20 hover:border-emerald-300/40"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
