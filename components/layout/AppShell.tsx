"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.replace("/login");
  };

  return (
    <div style={layout}>
      {/* SIDEBAR */}
      <aside style={sidebar}>
        <div style={logo}>🚀 Crown X</div>

        <nav style={nav}>
          <NavItem
            href="/dashboard"
            label="Overview"
            active={pathname === "/dashboard"}
          />
          <NavItem
            href="/dashboard/tasks"
            label="Tasks"
            active={pathname === "/dashboard/tasks"}
          />
          <NavItem
            href="/dashboard/customers"
            label="Customers"
            active={pathname === "/dashboard/customers"}
          />
        </nav>

        <button onClick={handleLogout} style={logoutBtn}>
          {loading ? "Logging out..." : "Logout"}
        </button>
      </aside>

      {/* MAIN */}
      <main style={main}>
        <header style={header}>
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <p style={subtext}>Analytics & CRM Overview</p>
        </header>

        <section style={content}>{children}</section>

        {/* FOOTER */}
        <footer style={footer}>
          <p style={{ margin: 0 }}>
            From <span style={symbol}>∞</span> Nexor X
          </p>
        </footer>
      </main>
    </div>
  );
}

/* ================= NAV ITEM ================= */

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        ...link,
        background: active ? "#1e293b" : "transparent",
        color: active ? "#ffffff" : "#cbd5e1",
      }}
    >
      {label}
    </Link>
  );
}

/* ================= STYLES ================= */

const layout: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  background: "#0b1220",
  color: "#e2e8f0",
  fontFamily: "Inter, sans-serif",
};

/* SIDEBAR */
const sidebar: React.CSSProperties = {
  width: 260,
  background: "#0f172a",
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 18,
  borderRight: "1px solid #1e293b",
};

const logo: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: "white",
};

const nav: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginTop: 10,
};

const link: React.CSSProperties = {
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: 10,
  fontSize: 14,
  transition: "0.2s",
};

const logoutBtn: React.CSSProperties = {
  marginTop: "auto",
  padding: 12,
  borderRadius: 10,
  border: "none",
  background: "#ef4444",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};

/* MAIN */
const main: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

const header: React.CSSProperties = {
  padding: 20,
  borderBottom: "1px solid #1e293b",
  background: "#0f172a",
};

const subtext: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "#94a3b8",
};

const content: React.CSSProperties = {
  padding: 24,
  flex: 1,
};

/* FOOTER */
const footer: React.CSSProperties = {
  padding: 14,
  borderTop: "1px solid #1e293b",
  fontSize: 12,
  color: "#94a3b8",
  background: "#0f172a",
  textAlign: "center",
};

const symbol: React.CSSProperties = {
  color: "#38bdf8",
  fontWeight: 700,
  margin: "0 4px",
};