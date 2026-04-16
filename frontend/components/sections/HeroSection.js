"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="section" style={{ paddingTop: 110 }}>
      <div className="container">
        <div
          className="glass"
          style={{
            borderRadius: 40,
            overflow: "hidden",
            padding: 28,
            display: "grid",
            gap: 24,
            gridTemplateColumns: "1.1fr 0.9fr",
            alignItems: "center",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,224,185,0.5))"
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge" style={{ marginBottom: 18 }}>
              Premium Indian Spice Collection
            </div>
            <h1 className="section-title" style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}>
              SP Enterprises
            </h1>
            <p className="section-subtitle">
              Bring restaurant-style aroma home with trusted masalas, vivid blends,
              and authentic flavour that stays fresh from pack to plate.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 28 }}>
              <Link href="/products" className="btn btn-primary">
                Shop now
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                Contact us
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              minHeight: 420,
              borderRadius: 32,
              background:
                "linear-gradient(160deg, rgba(166,74,22,0.18), rgba(240,178,79,0.18)), url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80') center/cover"
            }}
          />
        </div>
      </div>
    </section>
  );
}
