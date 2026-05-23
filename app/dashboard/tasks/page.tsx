"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AppShell from "@/components/layout/AppShell";

type Reminder = {
  id: string;
  note: string;
  remind_at: string;
  done: boolean;
  customer_id: string;
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

    const [remindersRes, customersRes] = await Promise.all([
      supabase
        .from("customer_reminders")
        .select("*")
        .eq("done", false),

      supabase
        .from("customers")
        .select("id, name, tag")
        .eq("user_id", user.id),
    ]);

    setReminders((remindersRes.data as Reminder[]) || []);
    setCustomers((customersRes.data as Customer[]) || []);
  };

  const now = new Date();

  const overdue = reminders.filter(
    (r) => new Date(r.remind_at) < now
  );

  const today = reminders.filter(
    (r) =>
      new Date(r.remind_at).toDateString() ===
      now.toDateString()
  );

  const vip = customers.filter((c) => c.tag === "vip");

  return (
    <AppShell>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        <h1>🧠 Crown X Command Center</h1>

        {/* URGENT */}
        <Section
          title="🚨 Urgent (Overdue)"
          items={overdue.map((r) => ({
            id: r.id,
            text: r.note,
          }))}
        />

        {/* TODAY */}
        <Section
          title="📅 Today"
          items={today.map((r) => ({
            id: r.id,
            text: r.note,
          }))}
        />

        {/* VIP INSIGHT */}
        <Section
          title="⭐ VIP Customers"
          items={vip.map((c) => ({
            id: c.id,
            text: c.name,
          }))}
        />

      </div>
    </AppShell>
  );
}

/* COMPONENT */

function Section({
  title,
  items,
}: {
  title: string;
  items: { id: string; text: string }[];
}) {
  return (
    <div style={box}>
      <h3>{title}</h3>

      {items.length === 0 ? (
        <p style={{ color: "#64748b" }}>Nothing here</p>
      ) : (
        items.map((item) => (
          <div key={item.id} style={card}>
            {item.text}
          </div>
        ))
      )}
    </div>
  );
}

/* STYLES */

const box: React.CSSProperties = {
  background: "white",
  padding: 20,
  borderRadius: 12,
};

const card: React.CSSProperties = {
  background: "#f1f5f9",
  padding: 10,
  borderRadius: 8,
  marginTop: 10,
};