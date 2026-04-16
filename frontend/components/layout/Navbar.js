"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, User, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { items } = useCart();

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <header
      className="glass"
      style={{
        position: "sticky",
        top: 10,
        zIndex: 50,
        margin: "12px auto 0",
        width: "min(1180px, calc(100% - 24px))",
        borderRadius: 999
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "14px 18px"
        }}
      >
        <Link href="/" style={{ fontWeight: 800, fontSize: "1.1rem" }}>
          SP Enterprises
          <div style={{ fontSize: "0.8rem", color: "#7a5a48", fontWeight: 500 }}>
            Pure Spices, Pure Taste
          </div>
        </Link>

        <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: pathname === link.href ? "#8f2d0c" : "#5e2b17",
                fontWeight: pathname === link.href ? 700 : 600
              }}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <User size={18} />
              Dashboard
            </Link>
          )}
          {user?.role === "admin" && (
            <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <ShieldCheck size={18} />
              Admin
            </Link>
          )}
          <Link href="/cart" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <ShoppingBag size={18} />
            Cart ({items.length})
          </Link>
          {user ? (
            <button
              className="btn btn-secondary"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
