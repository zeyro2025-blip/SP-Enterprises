"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/ui/ProductCard";
import { Loader } from "@/components/ui/Loader";

export default function ProductsPage() {
  const [state, setState] = useState({ products: [], categories: [], loading: true });
  const [filters, setFilters] = useState({ search: "", category: "", sort: "latest" });

  useEffect(() => {
    const fetchProducts = async () => {
      setState((prev) => ({ ...prev, loading: true }));
      const query = new URLSearchParams(
        Object.entries(filters).filter(([, value]) => value)
      ).toString();
      const data = await api.get(`/products?${query}`);
      setState({ products: data.products, categories: data.categories, loading: false });
    };

    fetchProducts();
  }, [filters]);

  return (
    <div className="container">
      <section className="page-hero">
        <div className="badge">All Masala Items</div>
        <h1>Shop bold flavour, freshness, and trusted purity.</h1>
        <p>
          Explore turmeric, chilli powder, garam masala, and kitchen essentials
          crafted for authentic Indian taste.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="card panel-card" style={{ marginBottom: 24 }}>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "2fr 1fr 1fr" }}>
            <div style={{ position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: 16, top: 16, color: "#7a5a48" }} />
              <input
                className="input"
                style={{ paddingLeft: 42 }}
                placeholder="Search spices, blends, categories..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <select
              className="select"
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option value="">All categories</option>
              {state.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              className="select"
              value={filters.sort}
              onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
            >
              <option value="latest">Latest</option>
              <option value="priceAsc">Price: Low to high</option>
              <option value="priceDesc">Price: High to low</option>
              <option value="rating">Top rated</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {state.loading ? (
          <Loader label="Loading products" />
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, color: "#7a5a48" }}>
              <SlidersHorizontal size={18} />
              <span>{state.products.length} products found</span>
            </div>
            <motion.div
              className="grid"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {state.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>
          </>
        )}
      </section>
    </div>
  );
}
