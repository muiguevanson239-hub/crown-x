"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";
import AppShell from "@/components/layout/AppShell";

type Task = {
  id: string;
  done: boolean;
  due_date: string;
};

type Customer = {
  id: string;
  tag: string;
};

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
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

    const [tasksRes, customersRes] = await Promise.all([
      supabase.from("tasks").select("*").eq("user_id", userId),
      supabase.from("customers").select("*").eq("user_id", userId),
    ]);

    setTasks((tasksRes.data as Task[]) || []);
    setCustomers((customersRes.data as Customer[]) || []);

    setDataLoading(false);
  };

  if (loading || !user) {
    return <div style={loadingStyle}>Loading Crown X...</div>;
  }

  if (dataLoading) {
    return <div style={loadingStyle}>Loading analytics...</div>;
  }

  // ================= ANALYTICS =================

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.done).length;
  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const overdueTasks = tasks.filter(
    (t) =>
      t.due_date && new Date(t.due_date) < new Date() && !t.done
  ).length;

  const totalCustomers = customers.length;
  const vipCustomers = customers.filter(
    (c) => c.tag === "vip"
  ).length;

  return (
    <AppShell>
      <div style={grid}>
        <h1 style={{ gridColumn: "1 / -1" }}>
          📊 Crown X Analytics Dashboard
        </h1>

        {/* KPI CARDS */}
        <Card title="📌 Total Tasks" value={totalTasks} />
        <Card title="✅ Completed Tasks" value={completedTasks} />
        <Card title="📈 Completion Rate" value={`${completionRate}%`} />
        <Card title="🚨 Overdue Tasks" value={overdueTasks} />

        <Card title="👥 Customers" value={totalCustomers} />
        <Card title="⭐ VIP Customers" value={vipCustomers} />
      </div>
    </AppShell>
  );
}

/* ================= UI COMPONENTS ================= */

function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div style={card}>
      <p style={titleStyle}>{title}</p>
      <h2 style={valueStyle}>{value}</h2>
    </div>
  );
}

/* ================= STYLES ================= */

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
};

const card: React.CSSProperties = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  padding: 18,
  borderRadius: 12,
};

const titleStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#94a3b8",
  margin: 0,
};

const valueStyle: React.CSSProperties = {
  fontSize: 26,
  margin: "8px 0 0 0",
  color: "white",
};

const loadingStyle: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "sans-serif",
};