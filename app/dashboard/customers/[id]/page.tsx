"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AppShell from "@/components/layout/AppShell";

/* ================= TYPES ================= */

type Customer = {
  id: string;
  name: string;
  phone: string;
  tag: string;
  created_at: string;
};

type Note = {
  id: string;
  customer_id: string;
  content: string;
  created_at: string;
};

type Reminder = {
  id: string;
  customer_id: string;
  note: string;
  remind_at: string;
  done: boolean;
  created_at: string;
};

/* ================= PAGE ================= */

export default function CustomerProfile({
  params,
}: {
  params: { id: string };
}) {
  const [customer, setCustomer] = useState<Customer | null>(null);

  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  const [reminderText, setReminderText] = useState("");
  const [remindAt, setRemindAt] = useState("");
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);


  const load = async () => {
    setLoading(true);
    await Promise.all([
      fetchCustomer(),
      fetchNotes(),
      fetchReminders(),
    ]);
    setLoading(false);
  };

  /* ================= FETCH CUSTOMER ================= */

  const fetchCustomer = async () => {
    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("id", params.id)
      .single();

    if (data) setCustomer(data as Customer);
  };

  /* ================= FETCH NOTES ================= */

  const fetchNotes = async () => {
    const { data } = await supabase
      .from("customer_notes")
      .select("*")
      .eq("customer_id", params.id)
      .order("created_at", { ascending: false });

    setNotes((data as Note[]) || []);
  };

  /* ================= FETCH REMINDERS ================= */

  const fetchReminders = async () => {
    const { data } = await supabase
      .from("customer_reminders")
      .select("*")
      .eq("customer_id", params.id)
      .order("created_at", { ascending: false });

    setReminders((data as Reminder[]) || []);
  };

  /* ================= ACTIONS ================= */

  const addNote = async () => {
    if (!note.trim()) return;

    await supabase.from("customer_notes").insert([
      {
        customer_id: params.id,
        content: note,
      },
    ]);

    setNote("");
    fetchNotes();
  };

  const addReminder = async () => {
    if (!reminderText.trim() || !remindAt) return;

    await supabase.from("customer_reminders").insert([
      {
        customer_id: params.id,
        note: reminderText,
        remind_at: remindAt,
        done: false,
      },
    ]);

    setReminderText("");
    setRemindAt("");
    fetchReminders();
  };

  const markDone = async (id: string) => {
    await supabase
      .from("customer_reminders")
      .update({ done: true })
      .eq("id", id);

    fetchReminders();
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <AppShell>
        <p>Loading customer...</p>
      </AppShell>
    );
  }

  if (!customer) {
    return (
      <AppShell>
        <p>Customer not found.</p>
      </AppShell>
    );
  }

  /* ================= UI ================= */

  return (
    <AppShell>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* CUSTOMER HEADER */}
        <div style={card}>
          <h1 style={{ margin: 0 }}>{customer.name}</h1>
          <p style={{ margin: 0 }}>{customer.phone}</p>

          <span style={tag}>
            {customer.tag.toUpperCase()}
          </span>
        </div>

        {/* ADD NOTE */}
        <div style={box}>
          <h3>📝 Add Note</h3>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={textarea}
            placeholder="Write CRM notes..."
          />

          <button onClick={addNote} style={button}>
            Save Note
          </button>
        </div>

        {/* NOTES LIST */}
        <div style={box}>
          <h3>📒 Notes Timeline</h3>

          {notes.length === 0 && (
            <p style={{ color: "#64748b" }}>No notes yet</p>
          )}

          {notes.map((n) => (
            <div key={n.id} style={item}>
              {n.content}
            </div>
          ))}
        </div>

        {/* ADD REMINDER */}
        <div style={box}>
          <h3>⏰ Add Follow-up Reminder</h3>

          <input
            placeholder="Reminder text"
            value={reminderText}
            onChange={(e) => setReminderText(e.target.value)}
            style={input}
          />

          <input
            type="datetime-local"
            value={remindAt}
            onChange={(e) => setRemindAt(e.target.value)}
            style={input}
          />

          <button onClick={addReminder} style={button}>
            Add Reminder
          </button>
        </div>

        {/* REMINDERS LIST */}
        <div style={box}>
          <h3>📅 Reminders</h3>

          {reminders.length === 0 && (
            <p style={{ color: "#64748b" }}>No reminders set</p>
          )}

          {reminders.map((r) => (
            <div key={r.id} style={reminderCard}>
              <div>
                <p style={{ margin: 0 }}>{r.note}</p>
                <small style={{ color: "#64748b" }}>
                  {r.remind_at}
                </small>
              </div>

              {!r.done ? (
                <button
                  onClick={() => markDone(r.id)}
                  style={smallBtn}
                >
                  Done
                </button>
              ) : (
                <span style={{ color: "#10b981" }}>✓ Done</span>
              )}
            </div>
          ))}
        </div>

      </div>
    </AppShell>
  );
}

/* ================= STYLES ================= */

const card: React.CSSProperties = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  display: "flex",
  flexDirection: "column",
  gap: 5,
};

const tag: React.CSSProperties = {
  marginTop: 10,
  background: "#0f172a",
  color: "white",
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: 12,
  width: "fit-content",
};

const box: React.CSSProperties = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const textarea: React.CSSProperties = {
  minHeight: 80,
  padding: 10,
  borderRadius: 8,
  border: "1px solid #e2e8f0",
};

const input: React.CSSProperties = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #e2e8f0",
};

const button: React.CSSProperties = {
  padding: 10,
  borderRadius: 8,
  border: "none",
  background: "#0f172a",
  color: "white",
  cursor: "pointer",
};

const item: React.CSSProperties = {
  padding: 10,
  background: "#f1f5f9",
  borderRadius: 8,
};

const reminderCard: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 10,
  background: "#f8fafc",
  borderRadius: 8,
};

const smallBtn: React.CSSProperties = {
  padding: "5px 10px",
  borderRadius: 6,
  border: "none",
  background: "#10b981",
  color: "white",
  cursor: "pointer",
};