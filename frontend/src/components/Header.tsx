import { useEffect, useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  CURRENCIES,
  LOGO,
  categoryColumns,
  featureLinks,
  file,
  getProduct,
  img,
  pageLinks,
  products,
  rooms,
  searchTypes,
} from "@/data/catalog";
import { useStore } from "@/context/Store";
import { Bag, Caret, CloseIcon, Heart, SearchIcon, Social, UserIcon } from "./ui";
import { cn } from "@/utils/cn";

const trending = ["arc-chair", "feast-chair", "bar-chair-sand", "swivel-table", "etruscan-jug-copy", "beam-table"]
  .map((h) => getProduct(h))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

export function Header() {
  const store = useStore();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All Categories");
  const [focus, setFocus] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [room, setRoom] = useState(rooms[0].label);
  const [curOpen, setCurOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const results = products
    .filter((p) => (cat === "All Categories" ? true : p.type === cat || p.type.startsWith(cat.replace(/s$/, ""))))
    .filter((p) => !q.trim() || `${p.title} ${p.type} ${p.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 6);

  const goSearch = (e?: FormEvent) => {
    e?.preventDefault();
    setFocus(false);
    nav(`/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(cat)}`);
  };

  const currency = CURRENCIES.find((c) => c.code === store.currency) ?? CURRENCIES[0];

  return (
    <header className={cn("sticky top-0 z-40 bg-white", scrolled && "shadow-[0_1px_0_#eee]")}>
      {focus ? (
        <button type="button" aria-label="Close search suggestions" className="fixed inset-0 z-30 cursor-default" onClick={() => setFocus(false)} />
      ) : null}
      <div className="bg-[#1d349a] text-white">
        <div className="mx-auto grid h-11 max-w-[1680px] grid-cols-1 items-center px-4 text-[13px] sm:px-6 lg:grid-cols-3 lg:px-10">
          <div className="hidden items-center gap-5 lg:flex">
            <Link to="/pages/faqs" className="hover:underline">
              Help Center
            </Link>
            <Link to="/pages/find-a-store" className="hover:underline">
              Find a Store
            </Link>
            <Link to="/pages/contact" className="hover:underline">
              Contact
            </Link>
          </div>
          <p className="text-center font-semibold">✌️ Free Express Shipping on orders $500!</p>
          <div className="hidden items-center justify-end gap-4 lg:flex">
            <div className="relative">
              <button type="button" className="inline-flex items-center gap-1 font-semibold" onClick={() => setCurOpen((v) => !v)}>
                {currency.label} ({currency.code} {currency.symbol.trim()})
                <Caret />
              </button>
              {curOpen ? (
                <div className="absolute right-0 top-8 z-50 max-h-72 w-64 overflow-auto rounded-2xl bg-white py-2 text-black shadow-2xl">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-[#f5f5f5]"
                      onClick={() => {
                        store.setCurrency(c.code);
                        setCurOpen(false);
                      }}
                    >
                      {c.label} ({c.code} {c.symbol.trim()})
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <Social light />
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1680px] items-center gap-4 px-4 py-3 sm:px-6 lg:gap-8 lg:px-10">
        <button type="button" className="lg:hidden" aria-label="Menu" onClick={() => store.setMenuOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <Link to="/" className="shrink-0" aria-label="Cortex home">
          <img src={LOGO} alt="Cortex" className="h-[22px] w-auto sm:h-[26px]" />
        </Link>

        <form
          onSubmit={goSearch}
          className="relative z-50 hidden h-12 min-w-0 flex-1 items-center rounded-full bg-[#ededed] lg:flex"
          onFocus={() => setFocus(true)}
        >
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="h-full max-w-[170px] rounded-l-full bg-transparent pl-5 pr-2 text-sm font-bold outline-none"
            aria-label="Category"
          >
            {searchTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <span className="h-5 w-px bg-black/10" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocus(true)}
            placeholder="Search"
            className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
          />
          <button type="submit" aria-label="Search" className="mr-1.5 grid h-9 w-9 place-items-center rounded-full">
            <SearchIcon />
          </button>
          {focus ? (
            <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 rounded-3xl border border-[#eee] bg-white p-5 shadow-2xl">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold">{q ? "Products" : "Most searched products"}</p>
                <button type="button" className="text-xs font-bold" onClick={() => setFocus(false)}>
                  Close
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {(q ? results : trending.slice(0, 4)).map((p) => (
                  <Link
                    key={p.handle}
                    to={`/products/${p.handle}`}
                    onClick={() => setFocus(false)}
                    className="flex items-center gap-3 rounded-2xl p-2 hover:bg-[#f6f6f6]"
                  >
                    <img src={img(p.images[0], 120)} alt="" className="h-14 w-14 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <span>
                      <span className="block text-sm font-semibold">{p.title}</span>
                      <span className="text-xs text-[#666]">{p.type}</span>
                    </span>
                  </Link>
                ))}
                {q && results.length === 0 ? <p className="text-sm text-[#666]">No matches. Try a chair, lamp, or table.</p> : null}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-[#888]">Most searched keywords</span>
                {["Tables & Desks", "Chairs & Stools", "Lighting", "Sofas"].map((k) => (
                  <button
                    key={k}
                    type="button"
                    className="rounded-full bg-[#ededed] px-3 py-1 text-xs font-bold"
                    onClick={() => {
                      setQ(k);
                      setFocus(false);
                      nav(`/search?q=${encodeURIComponent(k)}`);
                    }}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </form>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link to="/pages/find-a-store" className="mr-2 hidden text-sm font-bold xl:inline">
            Find a store
          </Link>
          <Link to="/account" className="mr-1 hidden text-sm font-bold lg:inline">
            {store.user ? store.user.name.split(" ")[0] : "Sign in / Register"}
          </Link>
          <button type="button" className="grid h-10 w-10 place-items-center lg:hidden" aria-label="Search" onClick={() => store.setSearchOpen(true)}>
            <SearchIcon />
          </button>
          <Link to="/account" className="hidden h-10 w-10 place-items-center sm:grid" aria-label="Account">
            <UserIcon />
          </Link>
          <Link to="/pages/wishlist" className="relative grid h-10 w-10 place-items-center" aria-label="Wishlist">
            <Heart filled={store.wishlist.length > 0} />
            {store.wishlist.length > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-black px-1 text-[10px] font-bold text-white">
                {store.wishlist.length}
              </span>
            ) : null}
          </Link>
          <button type="button" className="relative grid h-10 w-10 place-items-center" aria-label="Cart" onClick={() => store.setCartOpen(true)}>
            <Bag />
            <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#c4301c] px-1 text-[10px] font-bold text-white">
              {store.count}
            </span>
          </button>
        </div>
      </div>

      <nav
        className="relative hidden border-t border-[#f0f0f0] lg:block"
        onMouseLeave={() => setOpen(null)}
      >
        <ul className="mx-auto flex h-[52px] max-w-[1680px] items-center gap-8 px-10 text-[15px] font-bold">
          <li onMouseEnter={() => setOpen("cats")}>
            <button type="button" className="inline-flex items-center gap-1">
              Shop By Categories <Caret />
            </button>
          </li>
          <li onMouseEnter={() => setOpen("rooms")}>
            <button type="button" className="inline-flex items-center gap-1">
              Shop By Room <Caret />
            </button>
          </li>
          <li onMouseEnter={() => setOpen("tables")}>
            <Link to="/collections/dining-tables" className="inline-flex items-center gap-1">
              Tables & Desks <Caret />
            </Link>
          </li>
          <li onMouseEnter={() => setOpen("chairs")}>
            <Link to="/collections/chairs" className="inline-flex items-center gap-1">
              Chairs & Stools <Caret />
            </Link>
          </li>
          <li onMouseEnter={() => setOpen("pages")}>
            <button type="button" className="inline-flex items-center gap-1">
              Pages <Caret />
            </button>
          </li>
          <li onMouseEnter={() => setOpen("features")}>
            <Link to="/pages/theme-features" className="inline-flex items-center gap-1">
              Theme Features <Caret />
            </Link>
          </li>
          <li onMouseEnter={() => setOpen(null)}>
            <NavLink to="/pages/marble-products" className={({ isActive }) => cn("inline-flex items-center", isActive && "text-[#1d349a]")}>Marble Products</NavLink>
          </li>
          <li onMouseEnter={() => setOpen(null)}>
            <Link to="/collections/sale-items" className="inline-flex items-center gap-1.5 text-[#1d349a]">
              <span className="twinkle">✦</span> On Sale
            </Link>
          </li>
        </ul>

        {open ? (
          <div className="absolute left-0 right-0 top-full border-t border-[#eee] bg-white shadow-[0_24px_50px_rgba(0,0,0,.08)]">
            <div className="mx-auto grid max-w-[1680px] gap-8 px-10 py-8">
              {open === "cats" ? (
                <div className="grid grid-cols-5 gap-8">
                  {categoryColumns.map((col) => (
                    <div key={col.title}>
                      <p className="mb-3 font-bold">{col.title}</p>
                      <ul className="space-y-2 text-sm text-[#444]">
                        {col.links.map((l) => (
                          <li key={l.label}>
                            <Link to={l.to} className="rev" onClick={() => setOpen(null)}>
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <Link to="/collections/accessories" onClick={() => setOpen(null)} className="relative overflow-hidden rounded-2xl bg-[#f4f1ea]">
                    <img src={file("collection-slider-10.jpg", 700)} alt="" className="h-56 w-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                      <p className="text-sm">Home & Decor</p>
                      <p className="text-lg font-bold">Decoration From $10</p>
                      <span className="mt-2 inline-flex h-9 items-center rounded-full bg-white px-4 text-xs font-bold text-black">Shop Now</span>
                    </div>
                  </Link>
                </div>
              ) : null}

              {open === "rooms" ? (
                <div className="grid grid-cols-[220px_1fr] gap-10">
                  <div className="space-y-1">
                    {rooms.map((r) => (
                      <button
                        key={r.label}
                        type="button"
                        onMouseEnter={() => setRoom(r.label)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-bold",
                          room === r.label ? "bg-[#ededed]" : "hover:bg-[#f6f6f6]",
                        )}
                      >
                        {r.label}
                        <Caret className="-rotate-90" />
                      </button>
                    ))}
                  </div>
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-lg font-bold">{room}</p>
                      <Link to={rooms.find((r) => r.label === room)!.to} className="text-sm font-bold underline" onClick={() => setOpen(null)}>
                        Shop collection
                      </Link>
                    </div>
                    <ul className="grid grid-cols-3 gap-y-3 text-sm">
                      {rooms
                        .find((r) => r.label === room)!
                        .links.map((l) => (
                          <li key={l.label}>
                            <Link to={l.to} className="rev" onClick={() => setOpen(null)}>
                              {l.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              ) : null}

              {open === "tables" || open === "chairs" ? (
                <MegaProducts
                  columns={
                    open === "tables"
                      ? [
                          { title: "Tables", links: [{ label: "Side Tables", to: "/collections/tables" }, { label: "Dining Tables", to: "/collections/tables" }, { label: "Coffee Tables", to: "/collections/tables" }] },
                          { title: "Desks", links: [{ label: "Office Desks", to: "/collections/desks" }, { label: "The Nova Desk", to: "/products/the-nova-desk" }, { label: "Bracket Desk", to: "/products/bracket-desk" }] },
                          { title: "Trending Now", links: [{ label: "Turn Table", to: "/products/spin-table" }, { label: "Cross Tables", to: "/collections/tables" }, { label: "Nesting Side Table", to: "/products/nook-table" }] },
                        ]
                      : [
                          { title: "Chairs", links: [{ label: "Dining Chairs", to: "/collections/chairs" }, { label: "Office Chairs", to: "/collections/work-room" }, { label: "Accent Chairs", to: "/collections/bend-chairs" }, { label: "Lounge Chairs", to: "/collections/bend-chairs" }] },
                          { title: "Stools", links: [{ label: "Bar Stools", to: "/collections/bar-chairs" }, { label: "Counter Stool", to: "/collections/bar-chairs" }, { label: "Ottomans", to: "/collections/soft-stools" }] },
                          { title: "Trending Now", links: [{ label: "Cross Chair", to: "/products/cross-chair-heritage" }, { label: "Bow Chairs", to: "/collections/bow-chairs" }, { label: "Turn Chairs", to: "/collections/turn-chairs" }] },
                        ]
                  }
                  handles={open === "tables" ? ["feast-chair", "bar-chair-sand", "swivel-table", "etruscan-jug-copy"] : ["arc-chair", "etruscan-jug-copy", "plant-mister-copy", "cozy-chair"]}
                  onNav={() => setOpen(null)}
                />
              ) : null}

              {open === "pages" ? (
                <div className="grid grid-cols-4 gap-8">
                  {pageLinks.map((col) => (
                    <div key={col.title}>
                      <p className="mb-3 font-bold">{col.title}</p>
                      <ul className="space-y-2 text-sm">
                        {col.links.map((l) => (
                          <li key={l.label}>
                            <Link to={l.to} className="rev" onClick={() => setOpen(null)}>
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}

              {open === "features" ? (
                <div className="grid grid-cols-4 gap-3">
                  {featureLinks.map((l) => (
                    <Link
                      key={l.label}
                      to={l.to}
                      onClick={() => setOpen(null)}
                      className="rounded-2xl bg-[#f6f6f6] px-4 py-4 text-sm font-bold hover:bg-[#ededed]"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}

function MegaProducts({
  columns,
  handles,
  onNav,
}: {
  columns: { title: string; links: { label: string; to: string }[] }[];
  handles: string[];
  onNav: () => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_1.1fr] gap-10">
      <div className="grid grid-cols-3 gap-6">
        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-3 font-bold">{col.title}</p>
            <ul className="space-y-2 text-sm text-[#444]">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="rev" onClick={onNav}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div>
        <p className="mb-3 font-bold">Trending Products</p>
        <div className="grid grid-cols-4 gap-3">
          {handles.map((h) => {
            const p = getProduct(h);
            if (!p) return null;
            return (
              <Link key={h} to={`/products/${p.handle}`} onClick={onNav} className="group">
                <img src={img(p.images[0], 300)} alt={p.title} className="aspect-square w-full rounded-xl object-cover bg-[#f3f3f3]" referrerPolicy="no-referrer" />
                <p className="mt-2 text-sm font-semibold leading-tight group-hover:underline">{p.title}</p>
                <p className="text-sm font-bold">${p.variants[0].price.toFixed(2)}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MobileMenu() {
  const store = useStore();
  const [section, setSection] = useState<string | null>(null);
  if (!store.menuOpen) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => store.setMenuOpen(false)} />
      <div className="absolute inset-y-0 left-0 flex w-[min(100%,380px)] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <img src={LOGO} alt="Cortex" className="h-5" />
          <button type="button" aria-label="Close" onClick={() => store.setMenuOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <div className="flex-1 overflow-auto px-5 py-4">
          {[
            ["Shop By Categories", categoryColumns.flatMap((c) => c.links)],
            ["Shop By Room", rooms.map((r) => ({ label: r.label, to: r.to }))],
            ["Tables & Desks", [{ label: "All tables", to: "/collections/dining-tables" }]],
            ["Chairs & Stools", [{ label: "All chairs", to: "/collections/chairs" }]],
            ["Pages", pageLinks.flatMap((c) => c.links)],
            ["Theme Features", featureLinks],
          ].map(([title, links]) => (
            <div key={title as string} className="border-b border-[#eee]">
              <button
                type="button"
                className="flex w-full items-center justify-between py-3.5 font-bold"
                onClick={() => setSection(section === title ? null : (title as string))}
              >
                {title as string}
                <Caret className={section === title ? "rotate-180" : ""} />
              </button>
              {section === title ? (
                <ul className="space-y-2 pb-3 text-sm text-[#444]">
                  {(links as { label: string; to: string }[]).map((l) => (
                    <li key={l.label + l.to}>
                      <Link to={l.to} onClick={() => store.setMenuOpen(false)}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
          <Link to="/collections/sale-items" className="mt-3 block font-bold text-[#1d349a]" onClick={() => store.setMenuOpen(false)}>
            ✦ On Sale
          </Link>
          <NavLink to="/pages/marble-products" className={({ isActive }) => cn("mt-3 block font-bold", isActive ? "text-[#1d349a]" : "text-[#111]")} onClick={() => store.setMenuOpen(false)}>
            Marble Products
          </NavLink>
        </div>
        <div className="border-t px-5 py-4 text-sm">
          <Link to="/account" className="font-bold" onClick={() => store.setMenuOpen(false)}>
            Sign in / Register
          </Link>
          <div className="mt-3">
            <Social />
          </div>
        </div>
      </div>
    </div>
  );
}
