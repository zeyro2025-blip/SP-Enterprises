"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, summary, clearCart } = useCart();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India"
  });

  useEffect(() => {
    if (!token) router.push("/login?redirect=/checkout");
  }, [router, token]);

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!items.length) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);

    try {
      const orderData = await api.post(
        "/orders",
        {
          items: items.map((item) => ({
            productId: item._id,
            quantity: item.quantity
          })),
          shippingAddress: form
        },
        token
      );

      const razorpayReady = await loadRazorpayScript();
      if (!razorpayReady) throw new Error("Razorpay SDK failed to load");

      const options = {
        key: orderData.razorpay.key,
        amount: orderData.razorpay.amount,
        currency: orderData.razorpay.currency,
        name: "SP Enterprises",
        description: "Pure Spices, Pure Taste",
        order_id: orderData.razorpay.orderId,
        handler: async (response) => {
          try {
            await api.post(
              "/orders/verify",
              {
                orderId: orderData.order._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              },
              token
            );
            clearCart();
            toast.success("Payment successful");
            router.push("/dashboard");
          } catch (error) {
            toast.error(error.message);
          }
        },
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone
        },
        theme: {
          color: "#c85a1c"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <section className="page-hero">
        <div className="badge">Checkout</div>
        <h1>Secure your order</h1>
        <p>Fast, secure checkout with Razorpay for a smooth India-friendly payment flow.</p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "1.4fr 0.8fr" }}>
          <form className="card panel-card form-grid" onSubmit={handleSubmit}>
            <h3 style={{ marginTop: 0 }}>Shipping details</h3>
            {Object.keys(form).map((key) => (
              <input
                key={key}
                className="input"
                placeholder={key.replace(/([A-Z])/g, " $1")}
                value={form[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                required={key !== "addressLine2"}
              />
            ))}
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Processing..." : "Pay with Razorpay"}
            </button>
          </form>

          <div className="card panel-card" style={{ height: "fit-content" }}>
            <h3 style={{ marginTop: 0 }}>Order total</h3>
            <div className="grid" style={{ gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Items</span>
                <strong>{items.length}</strong>
              </div>
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
          </div>
        </div>
      </section>
    </div>
  );
}
