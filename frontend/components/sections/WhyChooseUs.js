const points = [
  "Freshly packed spices with strong aroma retention",
  "Secure checkout with Razorpay payment support",
  "Admin-ready dashboard for real product and order management"
];

export function WhyChooseUs() {
  return (
    <section className="section">
      <div className="container">
        <div className="card panel-card">
          <div className="badge">Why choose us</div>
          <h2 className="section-title">Designed for trust, built for growth.</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {points.map((point) => (
              <div key={point} className="glass" style={{ padding: 22, borderRadius: 24 }}>
                <h3 style={{ marginTop: 0 }}>{point}</h3>
                <p style={{ color: "#7a5a48", marginBottom: 0 }}>
                  Production-ready architecture with warm premium UI and mobile-first performance.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
