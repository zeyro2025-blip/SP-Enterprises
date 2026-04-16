const categories = ["Turmeric", "Chilli Powder", "Garam Masala", "Coriander"];

export function CategoryShowcase() {
  return (
    <section className="section">
      <div className="container">
        <div className="card panel-card">
          <div style={{ marginBottom: 20 }}>
            <div className="badge">Categories</div>
            <h2 className="section-title">Built around Indian kitchens.</h2>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            {categories.map((category, index) => (
              <div
                key={category}
                className="glass"
                style={{
                  padding: 22,
                  borderRadius: 26,
                  minHeight: 170,
                  background:
                    index % 2 === 0
                      ? "linear-gradient(145deg, rgba(240,178,79,0.28), rgba(255,255,255,0.5))"
                      : "linear-gradient(145deg, rgba(200,90,28,0.16), rgba(255,255,255,0.5))"
                }}
              >
                <h3>{category}</h3>
                <p style={{ color: "#7a5a48", marginBottom: 0 }}>
                  Distinct flavour profiles for everyday cooking and festive meals.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
