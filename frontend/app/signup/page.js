"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/ui/AuthForm";

function SignupContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  return (
    <div className="container">
      <section className="page-hero">
        <div className="badge">Create account</div>
        <h1>Join SP Enterprises today.</h1>
        <p>Save favourite masalas, write reviews, and place secure orders in a few clicks.</p>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="auth-card card" style={{ maxWidth: 520, margin: "0 auto" }}>
          <AuthForm mode="signup" redirect={redirect} />
          <p style={{ marginBottom: 0, color: "#7a5a48" }}>
            Already have an account? <Link href={`/login?redirect=${redirect}`}>Login</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="container"><section className="page-hero"><p>Loading...</p></section></div>}>
      <SignupContent />
    </Suspense>
  );
}
