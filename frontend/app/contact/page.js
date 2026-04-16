export default function ContactPage() {
  return (
    <div className="container">
      <section className="page-hero">
        <div className="badge">Contact</div>
        <h1>Let's talk spices, wholesale, or custom orders.</h1>
        <p>Reach SP Enterprises for business enquiries, support, and product assistance.</p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="card panel-card" style={{ display: "grid", gap: 18, maxWidth: 760 }}>
          <div>
            <strong>Business Name</strong>
            <p style={{ color: "#7a5a48" }}>SP Enterprises</p>
          </div>
          <div>
            <strong>Tagline</strong>
            <p style={{ color: "#7a5a48" }}>Pure Spices, Pure Taste</p>
          </div>
          <div>
            <strong>Email</strong>
            <p style={{ color: "#7a5a48" }}>Add your official business email here before launch.</p>
          </div>
          <div>
            <strong>Phone</strong>
            <p style={{ color: "#7a5a48" }}>Add your official support or sales number here before launch.</p>
          </div>
          <div>
            <strong>Address</strong>
            <p style={{ color: "#7a5a48" }}>Add your registered business address here before launch.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
