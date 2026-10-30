import { useEffect, useState } from "react";
import { useStore } from "@/context/Store";
import { api } from "@/lib/api";
import { errorText, money, Notice, Spinner, SectionTitle, Panel } from "../components/AdminUI";
import type { AdminStats, AdminSection } from "../types";
function Overview({ onSelect }: { onSelect: (section: AdminSection) => void }) {
  const { token } = useStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); api<{ stats: AdminStats }>("/admin/dashboard", { token }).then(r => { if (active) setStats(r.stats); }).catch(e => { if (active) setError(errorText(e)); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [token]);
  const cards = stats ? [["Products", stats.products, "Catalogue records"], ["Orders", stats.orders, "All order records"], ["Customers", stats.customers, "Customer accounts"], ["Low stock", stats.lowStock, "1–5 units remaining"], ["Pending payment", stats.pendingPayments, "Awaiting payment verification"], ["Enquiries", stats.enquiries, "Stored customer enquiries"]] as const : [];
  return <>
    <SectionTitle title="Overview" subtitle="Live summary from the Cortex backend." />
    {error ? <Notice notice={{ kind: "error", text: error }} /> : null}
    {loading ? <Spinner label="Loading dashboard statistics" /> : stats ? <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label, value, detail]) => <Panel key={label}><p className="text-sm font-semibold text-[#666]">{label}</p><p className="mt-2 text-3xl font-extrabold tracking-tight">{value.toLocaleString()}</p><p className="mt-1 text-xs text-[#888]">{detail}</p></Panel>)}</div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2"><Panel><h2 className="font-bold">Paid revenue by currency</h2><p className="mt-1 text-xs text-[#777]">Amounts remain separated; currencies are not added together.</p>{stats.revenueByCurrency.length ? <div className="mt-4 divide-y">{stats.revenueByCurrency.map(row => <div key={row._id} className="flex justify-between py-3 text-sm"><span>{row._id} · {row.paidOrders} paid orders</span><b>{money(row.revenue, row._id)}</b></div>)}</div> : <p className="mt-4 text-sm text-[#777]">No paid order revenue recorded.</p>}</Panel><Panel><h2 className="font-bold">Admin tools</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{([["Manage products", "products"], ["Review orders", "orders"], ["Sourcing staging", "sourcing"], ["Inventory", "inventory"]] as const).map(([label, section]) => <button key={section} type="button" onClick={() => onSelect(section)} className="rounded-xl border px-4 py-3 text-left text-sm font-semibold hover:border-[#1d349a] hover:text-[#1d349a]">{label} →</button>)}</div></Panel></div>
    </> : null}
  </>;
}
export default Overview;
