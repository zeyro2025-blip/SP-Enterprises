const testimonials = [
  "The aroma and freshness are excellent. The site feels premium and ordering is smooth.",
  "Clean checkout experience and reliable spice quality. Great for repeat family orders.",
  "Admin side is easy to manage and the storefront looks polished across mobile and desktop."
];

export function TestimonialsSection() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 28 }}>
          <div className="badge">Customer love</div>
          <h2 className="section-title">Built to leave a strong first impression.</h2>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {testimonials.map((quote) => (
            <div key={quote} className="card panel-card">
              <p style={{ color: "#7a5a48", lineHeight: 1.8, margin: 0 }}>{quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
