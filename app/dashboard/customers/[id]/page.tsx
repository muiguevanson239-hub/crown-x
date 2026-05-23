"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";
import AppShell from "@/components/layout/AppShell";

type Customer = {
  id: string;
  name: string;
  tag: string;
};

export default function CustomersPage() {
  const { user, loading } = useAuth();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [name, setName] = useState("");
  const [tag, setTag] = useState("regular");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) loadCustomers(user.id);
  }, [user]);

  const loadCustomers = async (userId: string) => {
    setLoadingData(true);

    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", userId);

    setCustomers((data as Customer[]) || []);
    setLoadingData(false);
  };

  const addCustomer = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          name,
          tag,
          user_id: user.id,
        },
      ])
      .select();

    if (!error && data) {
      setCustomers([...customers, ...(data as Customer[])]);
      setName("");
      setTag("regular");
    }
  };

  const deleteCustomer = async (id: string) => {
    await supabase.from("customers").delete().eq("id", id);

    setCustomers(customers.filter((c) => c.id !== id));
  };

  if (loading || !user) {
    return <div style={loadingStyle}>Loading...</div>;
  }

  return (
    <AppShell>
      <div style={container}>
        <h1>👥 Customers</h1>

        {/* ADD CUSTOMER */}
        <div style={form}>
          <input
            placeholder="Customer name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={input}
          />

          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            style={input}
          >
            <option value="regular">Regular</option>
            <option value="vip">VIP</option>
          </select>

          <button onClick={addCustomer} style={button}>
            Add Customer
          </button>
        </div>

        {/* LIST */}
        {loadingData ? (
          <p>Loading customers...</p>
        ) : (
          <div style={list}>
            {customers.map((c) => (
              <div key={c.id} style={card}>
                <div>
                  <strong>{c.name}</strong>
                  <p style={{ margin: 0 }}>{c.tag}</p>
                </div>

                <button
                  onClick={() => deleteCustomer(c.id)}
                  style={deleteBtn}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

/* ================= UI ================= */

const container: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 20,
};

const form: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const input: React.CSSProperties = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
};

const button: React.CSSProperties = {
  padding: "10px 15px",
  background: "#0ea5e9",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const list: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const card: React.CSSProperties = {
  background: "white",
  padding: 15,
  borderRadius: 10,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const deleteBtn: React.CSSProperties = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 10px",
  borderRadius: 6,
  cursor: "pointer",
};

const loadingStyle: React.CSSProperties = {
  padding: 40,
};