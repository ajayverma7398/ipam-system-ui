"use client";

import { FormEvent } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import Link from "next/link";
import AppBackground from "@/components/AppBackground";

export default function LoginPage() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex-1 flex flex-col relative">
      <AppBackground />
      <AuthLayout title="Login">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <AuthInput
            label="Username or Email"
            type="text"
            name="username"
            value=""
            placeholder="Username or Email"
            onChange={() => {}}
            icon="user"
            autoComplete="username"
            required
          />

          <AuthInput
            label="Password"
            type="password"
            name="password"
            value=""
            placeholder="Password"
            onChange={() => {}}
            icon="lock"
            showPasswordToggle
            autoComplete="current-password"
            required
          />

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              aria-label="Remember me"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 cursor-pointer">
              Remember me
            </label>
          </div>

          <AuthButton type="submit" text="Login" />

          {/* Demo credentials hint
          <div className="pt-2 text-xs text-center text-slate-500 space-y-1">
            <p>Demo credentials:</p>
            <p>User: <span className="font-mono">demo / demo</span></p>
            <p>Admin: <span className="font-mono">admin / admin</span></p>
          </div> */}

          <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              Forgot Password?
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              Create Account
            </Link>
          </div>
        </form>
      </AuthLayout>
    </div>
  );
}
