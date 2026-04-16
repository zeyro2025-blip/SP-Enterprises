"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/ui/ProductCard";

export function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadFeatured = async () => {
      const data = await api.get("/products/featured");
      setProducts(data.products);
    };

    loadFeatured();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 28 }}>
          <div className="badge">Best Sellers</div>
          <h2 className="section-title">Signature masalas customers return for.</h2>
          <p className="section-subtitle">
            Handpicked featured products designed to lift everyday cooking with
            rich aroma and dependable quality.
          </p>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
