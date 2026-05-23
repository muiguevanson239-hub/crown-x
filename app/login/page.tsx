"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setLoading(true);
    setError("");

    const action =
      mode === "login"
        ? supabase.auth.signInWithPassword({
            email,
            password,
          })
        : supabase.auth.signUp({
            email,
            password,
          });

    const { error } = await action;

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={{ marginBottom: 5 }}>🚀 Crown X</h1>
        <p style={{ marginBottom: 20, color: "#64748b" }}>
          {mode === "login" ? "Welcome back" : "Create your account"}
        </p>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        {error && <p style={errorStyle}>{error}</p>}

        <button onClick={handleAuth} style={button} disabled={loading}>
          {loading
            ? "Processing..."
            : mode === "login"
            ? "Login"
            : "Sign Up"}
        </button>

        <p
          style={switchText}
          onClick={() =>
            setMode(mode === "login" ? "signup" : "login")
          }
        >
          {mode === "login"
            ? "No account? Sign up"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const container: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
  fontFamily: "sans-serif",
};

const card: React.CSSProperties = {
  width: 360,
  background: "white",
  padding: 25,
  borderRadius: 14,
  display: "flex",
  flexDirection: "column",
  gap: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const input: React.CSSProperties = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  outline: "none",
};

const button: React.CSSProperties = {
  padding: 12,
  borderRadius: 10,
  border: "none",
  background: "#0ea5e9",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
  color: "#ef4444",
  fontSize: 13,
};

const switchText: React.CSSProperties = {
  marginTop: 5,
  fontSize: 13,
  color: "#0ea5e9",
  cursor: "pointer",
  textAlign: "center",
};