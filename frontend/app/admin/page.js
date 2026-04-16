"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/ui/Loader";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!token) {
      router.push("/login?redirect=/admin");
      return;
    }

    if (user && user.role !== "admin") {
      router.push("/");
      return;
    }

    const loadData = async () => {
      const response = await api.get("/admin/dashboard", token);
      setData(response);
    };

    loadData();
  }, [router, token, user]);

  if (!data) return <Loader label="Loading admin dashboard" />;

  const cards = [
    { label: "Revenue", value: `₹${data.stats.revenue}` },
    { label: "Orders", value: data.stats.ordersCount },
    { label: "Products", value: data.stats.productsCount },
    { label: "Users", value: data.stats.usersCount }
  ];

  return (
    <div className="container">
      <section className="page-hero">
        <div className="badge">Admin Panel</div>
        <h1>Business control center</h1>
        <p>Manage products, users, order statuses, and revenue from one secure space.</p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: 24 }}>
          {cards.map((card) => (
            <div key={card.label} className="card panel-card">
              <p style={{ marginTop: 0, color: "#7a5a48" }}>{card.label}</p>
              <h2 style={{ marginBottom: 0 }}>{card.value}</h2>
            </div>
          ))}
        </div>

        <div className="card panel-card">
          <h3 style={{ marginTop: 0 }}>Recent orders</h3>
          <div className="grid" style={{ gap: 14 }}>
            {data.recentOrders.map((order) => (
              <div key={order._id} className="glass" style={{ padding: 16, borderRadius: 18 }}>
                <strong>{order.user?.name}</strong>
                <p style={{ margin: "8px 0", color: "#7a5a48" }}>
                  ₹{order.total} | {order.orderStatus}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
