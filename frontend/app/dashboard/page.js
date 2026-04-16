"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/ui/Loader";

export default function DashboardPage() {
  const router = useRouter();
  const { token, user, refreshUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push("/login?redirect=/dashboard");
      return;
    }

    const loadDashboard = async () => {
      const data = await api.get("/orders/my-orders", token);
      setOrders(data.orders);
      setProfile({ name: user?.name || "", password: "" });
      setLoading(false);
    };

    loadDashboard();
  }, [router, token, user]);

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    try {
      await api.put("/users/profile", profile, token);
      await refreshUser();
      toast.success("Profile updated");
      setProfile((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <Loader label="Loading dashboard" />;

  return (
    <div className="container">
      <section className="page-hero">
        <div className="badge">Dashboard</div>
        <h1>Welcome, {user?.name}</h1>
        <p>Track orders, update your profile, and stay close to your favourite flavours.</p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "0.9fr 1.1fr" }}>
          <form className="card panel-card form-grid" onSubmit={handleProfileUpdate}>
            <h3 style={{ marginTop: 0 }}>Profile</h3>
            <input
              className="input"
              value={profile.name}
              onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Full name"
            />
            <input
              className="input"
              type="password"
              value={profile.password}
              onChange={(e) => setProfile((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="New password"
            />
            <button className="btn btn-primary" type="submit">
              Save changes
            </button>
          </form>

          <div className="card panel-card">
            <h3 style={{ marginTop: 0 }}>Recent orders</h3>
            <div className="grid" style={{ gap: 16 }}>
              {orders.length ? (
                orders.map((order) => (
                  <div key={order._id} className="glass" style={{ padding: 18, borderRadius: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                      <span className={`status ${order.orderStatus}`}>{order.orderStatus}</span>
                    </div>
                    <p style={{ marginBottom: 6, color: "#7a5a48" }}>
                      Total: ₹{order.total} | Payment: {order.paymentStatus}
                    </p>
                    <small style={{ color: "#7a5a48" }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))
              ) : (
                <p style={{ color: "#7a5a48" }}>No orders yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
