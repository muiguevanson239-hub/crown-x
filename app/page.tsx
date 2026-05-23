"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";
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
  const router = useRouter();
  const { user, loading } = useAuth();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadData(user.id);
    }
  }, [user, loading]);

  const loadData = async (userId: string) => {
    setDataLoading(true);

    const [remindersRes, customersRes] = await Promise.all([
      supabase
        .from("customer_reminders")
        .select("*")
        .eq("done", false),

      supabase
        .from("customers")
        .select("id, name, tag")
        .eq("user_id", userId),
    ]);

    setReminders((remindersRes.data as Reminder[]) || []);
    setCustomers((customersRes.data as Customer[]) || []);

    setDataLoading(false);
  };

  if (loading || !user) {
    return (
      <div style={loadingStyle}>
        Loading Crown X...
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div style={loadingStyle}>
        Loading dashboard data...
      </div>
    );
  }

  const now = new Date();

  const overdue = reminders.filter(
    (r) => new Date(r.remind_at) < now
  );

  const today = reminders.filter(
    (r) =>
      new Date(r.remind_at).toDateString() ===
      now.toDateString()
  );

  const vipCustomers = customers.filter(
    (c) => c.tag === "vip"
  );

  return (
    <AppShell>
      <div style={grid}>
        <h1 style={{ gridColumn: "1 / -1" }}>
          📊 Crown X Dashboard
        </h1>

        {/* OVERDUE */}
        <Card title="🚨 Overdue Tasks">
          {overdue.length === 0
            ? "No overdue tasks"
            : overdue.map((r) => (
                <Item key={r.id} text={r.note} />
              ))}
        </Card>

        {/* TODAY */}
        <Card title="📅 Today">
          {today.length === 0
            ? "Nothing due today"
            : today.map((r) => (
                <Item key={r.id} text={r.note} />
              ))}
        </Card>

        {/* VIP */}
        <Card title="⭐ VIP Customers">
          {vipCustomers.length === 0
            ? "No VIP customers"
            : vipCustomers.map((c) => (
                <Item key={c.id} text={c.name} />
              ))}
        </Card>
      </div>
    </AppShell>
  );
}

/* ================= UI COMPONENTS ================= */

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={card}>
      <h3 style={{ marginBottom: 10 }}>{title}</h3>
      <div>{children}</div>
    </div>
  );
}

function Item({ text }: { text: string }) {
  return <div style={item}>{text}</div>;
}

/* ================= STYLES ================= */

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 20,
};

const card: React.CSSProperties = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

const item: React.CSSProperties = {
  background: "#f1f5f9",
  padding: 10,
  borderRadius: 8,
  marginTop: 8,
};

const loadingStyle: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "sans-serif",
  fontSize: 16,
};