"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useSubscription(userId?: string) {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<"free" | "pro">("free");

  useEffect(() => {
    if (!userId) return;

    const fetchPlan = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", userId)
        .single();

      if (data?.plan) {
        setPlan(data.plan);
      }

      setLoading(false);
    };

    fetchPlan();
  }, [userId]);

  return { plan, loading };
}