"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/ui/Loader";

export default function AdminUsersPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const loadUsers = async () => {
    const data = await api.get("/admin/users", token);
    setUsers(data.users);
    setLoaded(true);
  };

  useEffect(() => {
    if (!token) {
      router.push("/login?redirect=/admin/users");
      return;
    }

    if (user && user.role !== "admin") {
      router.push("/");
      return;
    }

    loadUsers();
  }, [router, token, user]);

  const updateRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}`, { role }, token);
      toast.success("User role updated");
      loadUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!loaded) return <Loader label="Loading users" />;

  return (
    <div className="container">
      <section className="page-hero">
        <div className="badge">Admin Users</div>
        <h1>Manage customer and admin access</h1>
        <p>Promote staff, review registrations, and keep access secure.</p>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="grid">
          {users.map((item) => (
            <div key={item._id} className="card panel-card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <strong>{item.name}</strong>
                  <p style={{ color: "#7a5a48", marginBottom: 0 }}>{item.email}</p>
                </div>
                <select className="select" value={item.role} style={{ maxWidth: 180 }} onChange={(e) => updateRole(item._id, e.target.value)}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
