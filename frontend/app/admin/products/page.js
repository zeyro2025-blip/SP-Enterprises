"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/ui/Loader";

const initialForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  stock: "",
  featured: false,
  image: null
};

export default function AdminProductsPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    const data = await api.get("/admin/products", token);
    setProducts(data.products);
    setLoading(false);
  };

  useEffect(() => {
    if (!token) {
      router.push("/login?redirect=/admin/products");
      return;
    }

    if (user && user.role !== "admin") {
      router.push("/");
      return;
    }

    loadProducts();
  }, [router, token, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    try {
      if (editingId) {
        await api.putForm(`/products/${editingId}`, formData, token);
        toast.success("Product updated");
      } else {
        await api.postForm("/products", formData, token);
        toast.success("Product created");
      }

      setForm(initialForm);
      setEditingId("");
      loadProducts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      stock: product.stock,
      featured: product.featured,
      image: null
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`, token);
      toast.success("Product deleted");
      loadProducts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <Loader label="Loading products" />;

  return (
    <div className="container">
      <section className="page-hero">
        <div className="badge">Admin Products</div>
        <h1>Product catalog management</h1>
        <p>Create, update, and remove masala items with real backend persistence.</p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "0.9fr 1.1fr" }}>
          <form className="card panel-card form-grid" onSubmit={handleSubmit}>
            <h3 style={{ marginTop: 0 }}>{editingId ? "Edit product" : "Add new product"}</h3>
            <input className="input" placeholder="Product name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
            <input className="input" placeholder="Category" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} required />
            <textarea className="textarea" rows={4} placeholder="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} required />
            <input className="input" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} required />
            <input className="input" type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))} required />
            <label style={{ color: "#7a5a48" }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))} /> Featured product
            </label>
            <input
              className="input"
              type="file"
              accept="image/*"
              onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.files?.[0] || null }))}
              required={!editingId}
            />
            <button className="btn btn-primary" type="submit">
              {editingId ? "Update product" : "Create product"}
            </button>
          </form>

          <div className="grid">
            {products.map((product) => (
              <div key={product._id} className="card panel-card">
                <strong>{product.name}</strong>
                <p style={{ color: "#7a5a48" }}>
                  {product.category} | ₹{product.price} | Stock: {product.stock}
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button className="btn btn-secondary" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button className="btn btn-secondary" onClick={() => handleDelete(product._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
