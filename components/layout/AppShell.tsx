"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const linkStyle = (path: string) => ({
    padding: "10px 12px",
    borderRadius: 8,
    textDecoration: "none",
    color: pathname === path ? "#0f172a" : "white",
    background: pathname === path ? "#f1f5f9" : "transparent",
    fontWeight: pathname === path ? 600 : 400,
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: 250,
          background: "#0f172a",
          color: "white",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <h2 style={{ marginBottom: 20 }}>👑 Crown X</h2>

        <Link href="/dashboard" style={linkStyle("/dashboard")}>
          📊 Dashboard
        </Link>

        <Link href="/dashboard/customers" style={linkStyle("/dashboard/customers")}>
          👥 Customers
        </Link>

        <Link href="/dashboard/upgrade" style={linkStyle("/dashboard/upgrade")}>
          💳 Upgrade
        </Link>
      </div>

      {/* MAIN AREA */}
      <div
        style={{
          flex: 1,
          padding: 30,
          background: "#f8fafc",
          overflowY: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}