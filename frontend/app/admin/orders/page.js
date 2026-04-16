"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/ui/Loader";

export default function AdminOrdersPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    const data = await api.get("/admin/orders", token);
    setOrders(data.orders);
    setLoading(false);
  };

  useEffect(() => {
    if (!token) {
      router.push("/login?redirect=/admin/orders");
      return;
    }

    if (user && user.role !== "admin") {
      router.push("/");
      return;
    }

    loadOrders();
  }, [router, token, user]);

  const handleStatusChange = async (id, orderStatus) => {
    try {
      await api.put(`/admin/orders/${id}`, { orderStatus }, token);
      toast.success("Order updated");
      loadOrders();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <Loader label="Loading orders" />;

  return (
    <div className="container">
      <section className="page-hero">
        <div className="badge">Admin Orders</div>
        <h1>Track every order lifecycle</h1>
        <p>Update fulfillment stages and monitor customer purchases in one place.</p>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="grid">
          {orders.map((order) => (
            <div key={order._id} className="card panel-card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <strong>{order.user?.name}</strong>
                <span className={`status ${order.orderStatus}`}>{order.orderStatus}</span>
              </div>
              <p style={{ color: "#7a5a48" }}>
                ₹{order.total} | {order.paymentStatus}
              </p>
              <select className="select" value={order.orderStatus} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                {["processing", "confirmed", "packed", "shipped", "delivered", "cancelled"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
