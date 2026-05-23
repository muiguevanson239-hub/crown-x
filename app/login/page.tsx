"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AppShell from "@/components/layout/AppShell";

type Reminder = {
  id: string;
  customer_id: string;
  note: string;
  remind_at: string;
  done: boolean;
};

type Customer = {
  id: string;
  name: string;
  tag: string;
};

export default function Dashboard() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    await Promise.all([
      fetchReminders(user.id),
      fetchCustomers(user.id),
    ]);
  };

  const fetchReminders = async (userId: string) => {
    const { data } = await supabase
      .from("customer_reminders")
      .select("*")
      .eq("done", false)
      .order("remind_at", { ascending: true });

    setReminders((data as Reminder[]) || []);
  };

  const fetchCustomers = async (userId: string) => {
    const { data } = await supabase
      .from("customers")
      .select("id, name, tag")
      .eq("user_id", userId);

    setCustomers((data as Customer[]) || []);
  };

  const now = new Date();

  const overdue = reminders.filter(
    (r) => new Date(r.remind_at) < now
  );

  const today = reminders.filter((r) => {
    const d = new Date(r.remind_at);
    return d.toDateString() === now.toDateString();
  });

  const vipCustomers = customers.filter((c) => c.tag === "vip");

  return (
    <AppShell>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        <h1>Dashboard 🧠</h1>

        {/* OVERDUE */}
        <div style={box}>
          <h3>🚨 Overdue Follow-ups</h3>

          {overdue.length === 0 ? (
            <p style={muted}>No overdue tasks</p>
          ) : (
            overdue.map((r) => (
              <div key={r.id} style={card}>
                {r.note}
              </div>
            ))
          )}
        </div>

        {/* TODAY */}
        <div style={box}>
          <h3>📅 Today’s Tasks</h3>

          {today.length === 0 ? (
            <p style={muted}>No tasks for today</p>
          ) : (
            today.map((r) => (
              <div key={r.id} style={card}>
                {r.note}
              </div>
            ))
          )}
        </div>

        {/* VIP INSIGHT */}
        <div style={box}>
          <h3>⭐ VIP Customers</h3>

          {vipCustomers.length === 0 ? (
            <p style={muted}>No VIP customers</p>
          ) : (
            vipCustomers.map((c) => (
              <div key={c.id} style={card}>
                {c.name}
              </div>
            ))
          )}
        </div>

      </div>
    </AppShell>
  );
}

/* STYLES */

const box: React.CSSProperties = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const card: React.CSSProperties = {
  background: "#f1f5f9",
  padding: 10,
  borderRadius: 8,
};

const muted: React.CSSProperties = {
  color: "#64748b",
};