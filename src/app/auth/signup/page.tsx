"use client";

import { FormEvent } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import Link from "next/link";
import AppBackground from "@/components/AppBackground";

export default function SignupPage() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex-1 flex flex-col relative">
      <AppBackground />
      <AuthLayout title="Create Account" subtitle="Sign up to get started">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <AuthInput
            label="Full Name"
            type="text"
            name="name"
            value=""
            placeholder="Full Name"
            onChange={() => {}}
            icon="user"
            autoComplete="name"
            required
          />

          <AuthInput
            label="Email address"
            type="email"
            name="email"
            value=""
            placeholder="Email address"
            onChange={() => {}}
            icon="email"
            autoComplete="email"
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
            autoComplete="new-password"
            required
          />

          <AuthInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value=""
            placeholder="Confirm Password"
            onChange={() => {}}
            icon="lock"
            showPasswordToggle
            autoComplete="new-password"
            required
          />

          <AuthButton type="submit" text="Sign up" />

          <div className="pt-4 mt-4 border-t border-slate-200 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </AuthLayout>
    </div>
  );
}

