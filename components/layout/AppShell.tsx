"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    await supabase.auth.signOut();

    setLoading(false);
    router.push("/login");
  };

  return (
    <div style={container}>
      {/* SIDEBAR */}
      <aside style={sidebar}>
        <div style={logo}>
          🚀 Crown X
        </div>

        <nav style={nav}>
          <Link href="/dashboard" style={link}>
            📊 Dashboard
          </Link>

          <Link href="/dashboard/tasks" style={link}>
            ✅ Tasks
          </Link>

          <Link href="/dashboard/customers" style={link}>
            👥 Customers
          </Link>
        </nav>

        <div style={bottomSection}>
          <button
            onClick={handleLogout}
            disabled={loading}
            style={logoutBtn}
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={main}>
        <header style={header}>
          <h3 style={{ margin: 0 }}>Welcome back 👋</h3>
        </header>

        <section style={content}>{children}</section>
      </main>
    </div>
  );
}

/* =======================
   STYLES (SAAS LOOK)
======================= */

const container: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  fontFamily: "sans-serif",
  background: "#f1f5f9",
};

/* SIDEBAR */
const sidebar: React.CSSProperties = {
  width: 240,
  background: "#0f172a",
  color: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: 20,
};

const logo: React.CSSProperties = {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 30,
};

const nav: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const link: React.CSSProperties = {
  color: "#cbd5e1",
  textDecoration: "none",
  padding: "8px 10px",
  borderRadius: 8,
  transition: "0.2s",
};

const bottomSection: React.CSSProperties = {
  marginTop: 20,
};

const logoutBtn: React.CSSProperties = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "none",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

/* MAIN AREA */
const main: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

const header: React.CSSProperties = {
  background: "white",
  padding: 20,
  borderBottom: "1px solid #e2e8f0",
};

const content: React.CSSProperties = {
  padding: 20,
};