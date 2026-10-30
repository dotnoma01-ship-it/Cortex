import { useEffect, useState } from "react";
import { useStore } from "@/context/Store";
import { api } from "@/lib/api";
import { errorText, Notice, Spinner, SectionTitle, Panel, Pill } from "../components/AdminUI";
import type { AdminCategory } from "../types";
function Categories({ onViewProducts }: { onViewProducts: (category: string) => void }) {
  const { token } = useStore(); const [categories, setCategories] = useState<AdminCategory[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { if (!token) return; let active = true; api<{ categories: AdminCategory[] }>("/admin/categories", { token }).then(r => { if (active) setCategories(r.categories); }).catch(e => { if (active) setError(errorText(e)); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [token]);
  return <><SectionTitle title="Categories" subtitle="Category values are stored as Product.type in the existing schema." />{error ? <Notice notice={{ kind: "error", text: error }} /> : null}<Panel><p className="mb-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-900">There is no separate Category model or category CRUD route. This view reports real product types; change a product’s category in its product editor.</p>{loading ? <Spinner /> : <div className="divide-y">{categories.map(c => <div key={c.name} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><b>{c.name}</b><p className="text-xs text-[#777]">Product type</p></div><div className="flex items-center gap-3"><Pill>{c.productCount} products</Pill><button type="button" onClick={() => onViewProducts(c.name)} className="text-sm font-semibold text-[#1d349a] underline">View products</button></div></div>)}</div>}</Panel></>;
}
export default Categories;
