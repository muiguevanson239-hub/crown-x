"use client";

import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 220,
          background: "#111",
          color: "#fff",
          padding: 20,
        }}
      >
        <h2>Crown X 👑</h2>

        <nav style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <Link href="/dashboard">📊 Dashboard</Link>
          <Link href="/dashboard/customers">👥 Customers</Link>
          <Link href="/dashboard/reminders">⏰ Reminders</Link>
        </nav>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 20, background: "#f5f5f5" }}>
        {children}
      </div>
    </div>
  );
}