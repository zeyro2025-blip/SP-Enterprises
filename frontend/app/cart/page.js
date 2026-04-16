"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, summary } = useCart();

  return (
    <div className="container">
      <section className="page-hero">
        <div className="badge">Cart</div>
        <h1>Your spice basket</h1>
        <p>Review your selected masalas and continue to secure checkout.</p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        {items.length ? (
          <div style={{ display: "grid", gap: 24, gridTemplateColumns: "1.5fr 0.8fr" }}>
            <div className="grid">
              {items.map((item) => (
                <div key={item._id} className="card panel-card" style={{ display: "grid", gap: 18, gridTemplateColumns: "120px 1fr auto" }}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}`}
                    alt={item.name}
                    width={160}
                    height={120}
                    style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 20 }}
                  />
                  <div>
                    <h3 style={{ marginTop: 0 }}>{item.name}</h3>
                    <p style={{ margin: "6px 0", color: "#7a5a48" }}>₹{item.price}</p>
                    <select
                      className="select"
                      style={{ maxWidth: 120 }}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                    >
                      {Array.from({ length: Math.min(item.stock, 10) }, (_, index) => index + 1).map((value) => (
                        <option key={value} value={value}>
                          Qty: {value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button className="btn btn-secondary" onClick={() => removeFromCart(item._id)}>
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="card panel-card" style={{ height: "fit-content" }}>
              <h3 style={{ marginTop: 0 }}>Order summary</h3>
              <div className="grid" style={{ gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal</span>
                  <strong>₹{summary.subtotal}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Shipping</span>
                  <strong>₹{summary.shipping}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                  <span>Total</span>
                  <strong>₹{summary.total}</strong>
                </div>
              </div>
              <Link href="/checkout" className="btn btn-primary" style={{ width: "100%", marginTop: 24 }}>
                Proceed to checkout
              </Link>
            </div>
          </div>
        ) : (
          <div className="card panel-card">
            <p style={{ color: "#7a5a48" }}>Your cart is empty right now.</p>
            <Link href="/products" className="btn btn-primary">
              Continue shopping
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
