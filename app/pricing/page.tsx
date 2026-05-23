"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);

    try {
      // 1. Get current user
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      // 2. Call Flutterwave backend
      const res = await fetch("/api/flutterwave/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.user.email,
          userId: data.user.id,
        }),
      });

      const result = await res.json();

      if (result.link) {
        window.location.href = result.link;
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={container}>
      <div style={wrapper}>
        <h1 style={title}>💰 Pricing Plans</h1>

        <p style={subtitle}>
          Upgrade your Crown X workspace for advanced analytics and automation.
        </p>

        <div style={grid}>
          {/* FREE PLAN */}
          <div style={card}>
            <h2>Free</h2>
            <p style={price}>$0 / month</p>

            <ul style={list}>
              <li>✔ CRM Dashboard</li>
              <li>✔ Tasks Management</li>
              <li>✔ Customers Module</li>
            </ul>

            <button style={disabledBtn} disabled>
              Current Plan
            </button>
          </div>

          {/* PRO PLAN */}
          <div style={cardPro}>
            <h2>Pro</h2>
            <p style={price}>$9 / month</p>

            <ul style={list}>
              <li>🚀 Advanced Analytics</li>
              <li>🚀 Priority Features</li>
              <li>🚀 Future AI Tools</li>
            </ul>

            <button onClick={handleUpgrade} style={btn}>
              {loading ? "Redirecting..." : "Upgrade to Pro"}
            </button>
          </div>
        </div>

        <footer style={footer}>
          From <span style={symbol}>∞</span> Nexor X
        </footer>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0b1220",
  color: "#e2e8f0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Inter, sans-serif",
  padding: 20,
};

const wrapper: React.CSSProperties = {
  maxWidth: 900,
  width: "100%",
  textAlign: "center",
};

const title: React.CSSProperties = {
  fontSize: 40,
  marginBottom: 10,
};

const subtitle: React.CSSProperties = {
  color: "#94a3b8",
  marginBottom: 30,
};

const grid: React.CSSProperties = {
  display: "flex",
  gap: 20,
  justifyContent: "center",
  flexWrap: "wrap",
};

const card: React.CSSProperties = {
  flex: 1,
  minWidth: 280,
  background: "#0f172a",
  padding: 20,
  borderRadius: 14,
  border: "1px solid #1e293b",
};

const cardPro: React.CSSProperties = {
  flex: 1,
  minWidth: 280,
  background: "#111c33",
  padding: 20,
  borderRadius: 14,
  border: "1px solid #38bdf8",
};

const price: React.CSSProperties = {
  fontSize: 24,
  margin: "10px 0",
};

const list: React.CSSProperties = {
  textAlign: "left",
  marginTop: 10,
  marginBottom: 20,
  lineHeight: 1.8,
};

const btn: React.CSSProperties = {
  padding: 12,
  width: "100%",
  borderRadius: 10,
  border: "none",
  background: "#0ea5e9",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};

const disabledBtn: React.CSSProperties = {
  padding: 12,
  width: "100%",
  borderRadius: 10,
  border: "none",
  background: "#334155",
  color: "#94a3b8",
};

const footer: React.CSSProperties = {
  marginTop: 40,
  fontSize: 12,
  color: "#64748b",
};

const symbol: React.CSSProperties = {
  color: "#38bdf8",
};