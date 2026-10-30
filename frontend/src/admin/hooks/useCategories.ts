import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { AdminCategory } from "../types";
export default function useCategories(token: string | null | undefined) {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  useEffect(() => { if (!token) return; let active = true; api<{ categories: AdminCategory[] }>("/admin/categories", { token }).then(r => { if (active) setCategories(r.categories); }).catch(() => undefined); return () => { active = false; }; }, [token]);
  return categories;
}