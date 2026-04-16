"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/ui/Loader";

export default function ProductDetailsPage({ params }) {
  const { addToCart } = useCart();
  const { token } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: "" });

  const fetchProduct = async () => {
    setLoading(true);
    const data = await api.get(`/products/${params.slug}`);
    setProduct(data.product);
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post(`/products/${product._id}/reviews`, review, token);
      toast.success("Review submitted");
      setReview({ rating: 5, comment: "" });
      fetchProduct();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <Loader label="Loading product details" />;

  return (
    <div className="container">
      <section className="page-hero">
        <div className="badge">{product.category}</div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
      </section>

      <section className="section" style={{ paddingTop: 0, display: "grid", gap: 30, gridTemplateColumns: "1.1fr 1fr" }}>
        <div className="card panel-card">
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.image}`}
            alt={product.name}
            width={800}
            height={700}
            style={{ width: "100%", height: 420, objectFit: "cover", borderRadius: 24 }}
          />
        </div>
        <div className="card panel-card">
          <div className="badge" style={{ marginBottom: 16 }}>
            {product.rating.toFixed(1)} / 5 rating
          </div>
          <h2 style={{ marginTop: 0, fontSize: "2rem" }}>₹{product.price}</h2>
          <p style={{ color: "#7a5a48", lineHeight: 1.8 }}>{product.description}</p>
          <p>
            <strong>Stock:</strong> {product.stock} packs available
          </p>
          <button className="btn btn-primary" onClick={() => addToCart(product)}>
            Add to cart
          </button>

          <div style={{ marginTop: 30 }}>
            <h3>Customer Reviews</h3>
            <div className="grid" style={{ gap: 14 }}>
              {product.reviews.length ? (
                product.reviews.map((item) => (
                  <div key={item._id} className="glass" style={{ padding: 18, borderRadius: 20 }}>
                    <strong>{item.name}</strong>
                    <div style={{ display: "flex", gap: 6, margin: "8px 0", color: "#c85a1c" }}>
                      {Array.from({ length: item.rating }).map((_, index) => (
                        <Star key={index} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p style={{ margin: 0, color: "#7a5a48" }}>{item.comment}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: "#7a5a48" }}>No reviews yet. Be the first to share feedback.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="card panel-card" style={{ maxWidth: 760 }}>
          <h3 style={{ marginTop: 0 }}>Write a review</h3>
          {token ? (
            <form className="form-grid" onSubmit={handleReviewSubmit}>
              <select
                className="select"
                value={review.rating}
                onChange={(e) => setReview((prev) => ({ ...prev, rating: Number(e.target.value) }))}
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} Stars
                  </option>
                ))}
              </select>
              <textarea
                className="textarea"
                rows={4}
                placeholder="Tell us what you loved about this masala..."
                value={review.comment}
                onChange={(e) => setReview((prev) => ({ ...prev, comment: e.target.value }))}
              />
              <button className="btn btn-primary" type="submit">
                Submit review
              </button>
            </form>
          ) : (
            <p style={{ color: "#7a5a48" }}>Please login to post a review.</p>
          )}
        </div>
      </section>
    </div>
  );
}
