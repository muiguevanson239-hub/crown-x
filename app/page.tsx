import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>🚀 Crown X</h1>

      <p>Welcome to your CRM SaaS system</p>

      <div style={{ marginTop: 20 }}>
        <Link href="/login">Go to Login</Link>
        <br />
        <Link href="/dashboard">Go to Dashboard</Link>
      </div>
    </main>
  );
}