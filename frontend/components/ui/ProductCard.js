"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card panel-card" style={{ padding: 18 }}>
      <Link href={`/products/${product.slug}`}>
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.image}`}
          alt={product.name}
          width={600}
          height={420}
          style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 22 }}
        />
      </Link>
      <div style={{ paddingTop: 18 }}>
        <div className="badge">{product.category}</div>
        <h3 style={{ marginBottom: 6 }}>{product.name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#7a5a48", marginBottom: 10 }}>
          <Star size={16} fill="#c85a1c" color="#c85a1c" />
          <span>{product.rating?.toFixed?.(1) || "0.0"} rating</span>
        </div>
        <p style={{ color: "#7a5a48", minHeight: 48 }}>{product.description.slice(0, 90)}...</p>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <strong style={{ fontSize: "1.2rem" }}>₹{product.price}</strong>
          <button className="btn btn-primary" onClick={() => addToCart(product)}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
