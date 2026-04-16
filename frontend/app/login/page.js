"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/ui/AuthForm";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  return (
    <div className="container">
      <section className="page-hero">
        <div className="badge">Welcome back</div>
        <h1>Login to continue your spice journey.</h1>
        <p>Track orders, manage your profile, and checkout faster on your next purchase.</p>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="auth-card card" style={{ maxWidth: 520, margin: "0 auto" }}>
          <AuthForm mode="login" redirect={redirect} />
          <p style={{ marginBottom: 0, color: "#7a5a48" }}>
            New here? <Link href={`/signup?redirect=${redirect}`}>Create an account</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
