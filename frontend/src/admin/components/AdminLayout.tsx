import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/Store";
import { cn } from "@/utils/cn";
import { Pill } from "./AdminUI";
import { adminNav, sectionTitles, type AdminSection } from "../types";
import Overview from "../sections/Overview";
import Products from "../sections/Products";
import Categories from "../sections/Categories";
import Orders from "../sections/Orders";
import Customers from "../sections/Customers";
import Inventory from "../sections/Inventory";
import AlibabaSourcing from "../sections/AlibabaSourcing";
import Settings from "../sections/Settings";
function AdminLayout() {
  const { user, signOut } = useStore();
  const [mobileNav, setMobileNav] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [categoryFilter, setCategoryFilter] = useState("");
  function selectSection(section: AdminSection) {
    if (section === "products") setCategoryFilter("");
    setActiveSection(section);
    setMobileNav(false);
  }
  function showCategoryProducts(category: string) {
    setCategoryFilter(category);
    setActiveSection("products");
    setMobileNav(false);
  }
  return <div className="min-h-screen bg-[#f6f7fb] text-[#191919]">
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e7e8ec] bg-white px-4 sm:px-6 lg:pl-[264px]">
      <div className="flex items-center gap-3"><button type="button" className="grid h-10 w-10 place-items-center rounded-lg border lg:hidden" onClick={() => setMobileNav(v => !v)} aria-label="Toggle admin navigation" aria-expanded={mobileNav} aria-controls="admin-navigation-panel">☰</button><span className="text-sm font-semibold text-[#666]">Cortex / Admin / <span className="text-[#222]">{sectionTitles[activeSection]}</span></span></div>
      <div className="flex items-center gap-3"><span className="hidden text-sm text-[#555] sm:block">{user?.name || user?.email}</span><button onClick={signOut} className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-[#f7f7f7]">Log out</button></div>
    </header>
    <aside id="admin-navigation-panel" className={cn("fixed inset-y-0 left-0 z-40 w-[248px] border-r border-[#e7e8ec] bg-white px-4 py-5 transition-transform lg:translate-x-0", mobileNav ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:shadow-none")}>
      <div className="mb-8 flex items-center justify-between px-2"><Link to="/admin" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#1d349a] font-black text-white">C</span><span><b className="block text-sm tracking-wider">CORTEX</b><small className="text-xs text-[#777]">ADMIN CONSOLE</small></span></Link><button className="grid h-9 w-9 place-items-center rounded-lg border lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close admin navigation">×</button></div>
      <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#888]">Workspace</p>
      <nav className="space-y-1" aria-label="Admin navigation">{adminNav.map(([label, section, icon]) => <button key={section} type="button" onClick={() => selectSection(section)} aria-current={activeSection === section ? "page" : undefined} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d349a]", activeSection === section ? "bg-[#eaf0ff] text-[#1d349a]" : "text-[#555] hover:bg-[#f5f6f8]")}><span className="grid w-5 place-items-center text-base" aria-hidden="true">{icon}</span>{label}</button>)}</nav>
      <div className="absolute inset-x-4 bottom-5 rounded-2xl bg-[#f7f8fb] p-4"><p className="text-xs font-bold">Signed in as</p><p className="mt-1 truncate text-sm text-[#555]">{user?.email}</p><Pill tone="green">Administrator</Pill></div>
    </aside>
    {mobileNav ? <button aria-label="Close navigation overlay" onClick={() => setMobileNav(false)} className="fixed inset-0 z-30 bg-black/30 lg:hidden" /> : null}
    <main className="min-w-0 px-4 py-6 sm:px-6 lg:ml-[248px] lg:px-8 lg:py-8"><div className="mx-auto max-w-[1500px]" key={activeSection}>
      {activeSection === "overview" ? <Overview onSelect={selectSection} /> : null}
      {activeSection === "products" ? <Products initialType={categoryFilter} /> : null}
      {activeSection === "categories" ? <Categories onViewProducts={showCategoryProducts} /> : null}
      {activeSection === "orders" ? <Orders /> : null}
      {activeSection === "customers" ? <Customers /> : null}
      {activeSection === "inventory" ? <Inventory /> : null}
      {activeSection === "sourcing" ? <AlibabaSourcing /> : null}
      {activeSection === "settings" ? <Settings /> : null}
    </div></main>
  </div>;
}
export default AdminLayout;
