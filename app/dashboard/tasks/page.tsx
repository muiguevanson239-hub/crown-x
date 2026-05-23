"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";
import AppShell from "@/components/layout/AppShell";

type Task = {
  id: string;
  title: string;
  due_date: string;
  done: boolean;
};

export default function TasksPage() {
  const { user, loading } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) loadTasks(user.id);
  }, [user]);

  const loadTasks = async (userId: string) => {
    setLoadingData(true);

    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("due_date", { ascending: true });

    setTasks((data as Task[]) || []);
    setLoadingData(false);
  };

  const addTask = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title,
          due_date: dueDate,
          done: false,
          user_id: user.id,
        },
      ])
      .select();

    if (!error && data) {
      setTasks([...tasks, ...(data as Task[])]);
      setTitle("");
      setDueDate("");
    }
  };

  const toggleDone = async (task: Task) => {
    await supabase
      .from("tasks")
      .update({ done: !task.done })
      .eq("id", task.id);

    setTasks(
      tasks.map((t) =>
        t.id === task.id ? { ...t, done: !t.done } : t
      )
    );
  };

  const deleteTask = async (id: string) => {
    await supabase.from("tasks").delete().eq("id", id);

    setTasks(tasks.filter((t) => t.id !== id));
  };

  if (loading || !user) {
    return <div style={loadingStyle}>Loading...</div>;
  }

  return (
    <AppShell>
      <div style={container}>
        <h1>✅ Tasks</h1>

        {/* ADD TASK */}
        <div style={form}>
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={input}
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={input}
          />

          <button onClick={addTask} style={button}>
            Add Task
          </button>
        </div>

        {/* TASK LIST */}
        {loadingData ? (
          <p>Loading tasks...</p>
        ) : (
          <div style={list}>
            {tasks.map((task) => (
              <div key={task.id} style={card}>
                <div>
                  <strong
                    style={{
                      textDecoration: task.done
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {task.title}
                  </strong>

                  <p style={{ margin: 0, fontSize: 12 }}>
                    Due: {task.due_date || "No date"}
                  </p>
                </div>

                <div style={actions}>
                  <button
                    onClick={() => toggleDone(task)}
                    style={doneBtn}
                  >
                    {task.done ? "Undo" : "Done"}
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    style={deleteBtn}
                  >
                    Delete
                  </button>
                </div>
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

const actions: React.CSSProperties = {
  display: "flex",
  gap: 8,
};

const doneBtn: React.CSSProperties = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "8px 10px",
  borderRadius: 6,
  cursor: "pointer",
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