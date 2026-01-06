"use client";

import { FormEvent } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import Link from "next/link";
import AppBackground from "@/components/AppBackground";

export default function ForgotPasswordPage() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex-1 flex flex-col relative">
      <AppBackground />
      <AuthLayout
        title="Forgot your password?"
        subtitle="Enter your email address and we'll send you a link to reset your password"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
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

          <AuthButton type="submit" text="Send reset link" />
          <div className="pt-4 mt-4 border-t border-slate-200 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              Back to sign in
            </Link>
          </div>
        </form>
      </AuthLayout>
    </div>
  );
}
