"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export default function UpgradePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  const upgradeToPro = async () => {
    if (!user) {
      setStatus("You must be logged in.");
      return;
    }

    setLoading(true);
    setStatus("");

    const FlutterwaveCheckout =
      (window as unknown as {
        FlutterwaveCheckout?: (args: unknown) => void;
      }).FlutterwaveCheckout;

    if (!FlutterwaveCheckout) {
      setLoading(false);
      setStatus("Payment system not loaded.");
      return;
    }

    FlutterwaveCheckout({
      public_key: "YOUR_FLUTTERWAVE_PUBLIC_KEY",
      tx_ref: Date.now().toString(),
      amount: 5,
      currency: "USD",
      payment_options: "card,mpesa",
      customer: {
        email: user.email,
      },

      callback: async function (response: { status: string }) {
        setLoading(false);

        if (response.status === "successful") {
          const { error } = await supabase
            .from("profiles")
            .upsert({
              id: user.id,
              plan: "pro",
            });

          if (error) {
            setStatus("Payment successful but upgrade failed.");
            return;
          }

          setStatus("Upgrade successful 🎉 Redirecting...");

          setTimeout(() => {
            window.location.href = "/dashboard/customers";
          }, 1500);
        } else {
          setStatus("Payment not completed.");
        }
      },

      onclose: function () {
        setLoading(false);
        setStatus("Payment cancelled.");
      },
    });
  };

  return (
    <div style={wrapper}>
      <div style={card}>
        <h1>Upgrade to Crown X Pro 👑</h1>

        <p style={{ color: "#64748b" }}>
          Unlock unlimited customers, automation, and analytics.
        </p>

        <div style={box}>
          <p>✔ Unlimited customers</p>
          <p>✔ CRM automation</p>
          <p>✔ Advanced analytics</p>
        </div>

        <h2>$5 / month</h2>

        <button onClick={upgradeToPro} style={button}>
          {loading ? "Processing..." : "Pay & Upgrade"}
        </button>

        {status && <p style={statusText}>{status}</p>}

        {!user && (
          <p style={{ color: "red", fontSize: 12 }}>
            You are not logged in.
          </p>
        )}
      </div>
    </div>
  );
}

/* STYLES */

const wrapper: React.CSSProperties = {
  padding: 40,
  minHeight: "100vh",
  background: "#0f172a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const card: React.CSSProperties = {
  width: 420,
  background: "white",
  padding: 25,
  borderRadius: 12,
  display: "flex",
  flexDirection: "column",
  gap: 15,
};

const box: React.CSSProperties = {
  background: "#f1f5f9",
  padding: 15,
  borderRadius: 10,
};

const button: React.CSSProperties = {
  padding: 12,
  borderRadius: 8,
  border: "none",
  background: "#10b981",
  color: "white",
  cursor: "pointer",
  fontWeight: 600,
};

const statusText: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
};