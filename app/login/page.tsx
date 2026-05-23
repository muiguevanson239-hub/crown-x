"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  // 🧠 Prevent logged-in users from seeing login page
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        router.replace("/dashboard");
      } else {
        setChecking(false);
      }
    };

    checkUser();
  }, []);

  const handleAuth = async () => {
    setLoading(true);
    setError("");

    try {
      let result;

      if (mode === "login") {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        result = await supabase.auth.signUp({
          email,
          password,
        });
      }

      const { error } = result;

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // 🧠 Wait for Supabase session to fully register
      setTimeout(async () => {
        const { data } = await supabase.auth.getUser();

        if (data.user) {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
      }, 500);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  if (checking) {
    return (
      <div style={loadingStyle}>
        Loading...
      </div>
    );
  }

  return (
    <div style={container}>
      <div style={card}>
        <h1>🚀 Crown X</h1>
        <p style={{ color: "#64748b" }}>
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

        {error && <p style={errorText}>{error}</p>}

        <button onClick={handleAuth} style={button} disabled={loading}>
          {loading
            ? "Processing..."
            : mode === "login"
            ? "Login"
            : "Sign Up"}
        </button>

        <p
          onClick={() =>
            setMode(mode === "login" ? "signup" : "login")
          }
          style={switchText}
        >
          {mode === "login"
            ? "No account? Sign up"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

/* ================= UI ================= */

const container: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg,#0f172a,#1e293b)",
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
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
};

const input: React.CSSProperties = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #e2e8f0",
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

const errorText: React.CSSProperties = {
  color: "red",
  fontSize: 13,
};

const switchText: React.CSSProperties = {
  textAlign: "center",
  fontSize: 13,
  color: "#0ea5e9",
  cursor: "pointer",
};

const loadingStyle: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};