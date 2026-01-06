"use client";

import { FormEvent } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import Link from "next/link";
import AppBackground from "@/components/AppBackground";

export default function ResetPasswordPage() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex-1 flex flex-col relative">
      <AppBackground />
      <AuthLayout
        title="Set a new password"
        subtitle="Choose a strong password to secure your IPAM account"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <AuthInput
            label="New password"
            type="password"
            name="new-password"
            value=""
            placeholder="Create a strong password"
            onChange={() => {}}
            icon="lock"
            showPasswordToggle
            autoComplete="new-password"
            required
          />

          <AuthInput
            label="Confirm password"
            type="password"
            name="confirm-password"
            value=""
            placeholder="Re-enter your password"
            onChange={() => {}}
            icon="lock"
            showPasswordToggle
            autoComplete="new-password"
            required
          />

          <AuthButton type="submit" text="Save and continue" />

          <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between">
            <Link
              href="/auth/login"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              Return to login
            </Link>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              Request another link
            </Link>
          </div>
        </form>
      </AuthLayout>
    </div>
  );
}
