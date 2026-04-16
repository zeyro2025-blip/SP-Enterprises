export function Loader({ label = "Loading" }) {
  return (
    <div className="container">
      <section className="section page-hero">
        <div className="card panel-card" style={{ textAlign: "center" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: "4px solid rgba(200, 90, 28, 0.15)",
              borderTopColor: "#c85a1c",
              margin: "0 auto 18px",
              animation: "spin 0.8s linear infinite"
            }}
          />
          <p style={{ margin: 0, color: "#7a5a48" }}>{label}</p>
        </div>
      </section>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
