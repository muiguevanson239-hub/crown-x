import Link from "next/link";

export default function HomePage() {
  return (
    <div style={container}>
      <div style={hero}>
        <h1 style={title}>🚀 Crown X</h1>

        <p style={subtitle}>
          A modern CRM SaaS for managing customers, tasks, and growth analytics.
        </p>

        <div style={buttons}>
          <Link href="/login" style={primaryBtn}>
            Get Started
          </Link>

          <Link href="/dashboard" style={secondaryBtn}>
            Go to Dashboard
          </Link>
        </div>

        <div style={features}>
          <Feature text="⚡ Fast CRM workflows" />
          <Feature text="📊 Real-time analytics dashboard" />
          <Feature text="👥 Customer management system" />
          <Feature text="🔐 Secure authentication (Supabase)" />
        </div>

        <footer style={footer}>
          From <span style={symbol}>∞</span> Nexor X
        </footer>
      </div>
    </div>
  );
}

/* ================= UI ================= */

function Feature({ text }: { text: string }) {
  return <div style={feature}>{text}</div>;
}

const container: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#0b1220",
  fontFamily: "Inter, sans-serif",
  color: "#e2e8f0",
  padding: 20,
};

const hero: React.CSSProperties = {
  maxWidth: 700,
  textAlign: "center",
};

const title: React.CSSProperties = {
  fontSize: 48,
  marginBottom: 10,
};

const subtitle: React.CSSProperties = {
  fontSize: 16,
  color: "#94a3b8",
  marginBottom: 30,
};

const buttons: React.CSSProperties = {
  display: "flex",
  gap: 12,
  justifyContent: "center",
  marginBottom: 30,
};

const primaryBtn: React.CSSProperties = {
  padding: "12px 18px",
  background: "#0ea5e9",
  color: "white",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 600,
};

const secondaryBtn: React.CSSProperties = {
  padding: "12px 18px",
  background: "#1e293b",
  color: "white",
  borderRadius: 10,
  textDecoration: "none",
};

const features: React.CSSProperties = {
  display: "grid",
  gap: 10,
  marginTop: 20,
};

const feature: React.CSSProperties = {
  padding: 10,
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 10,
  fontSize: 14,
};

const footer: React.CSSProperties = {
  marginTop: 40,
  fontSize: 12,
  color: "#64748b",
};

const symbol: React.CSSProperties = {
  color: "#38bdf8",
};