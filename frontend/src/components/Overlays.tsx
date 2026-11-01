import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  colorOption,
  categoryRoutesByType,
  findVariant,
  pickVariant,
  priceUnitLabel,
  formatMoney,
  getProduct,
  img,
  products,
} from "@/data/catalog";
import { linePrice, useStore, volumeRate } from "@/context/Store";
import { Btn, CloseIcon, Money, Qty, Swatch } from "./ui";

export function Overlays() {
  return (
    <>
      <CartDrawer />
      <QuickView />
      <MobileSearch />
      <CompareBar />
      <Offers />
      <Popup />
      <Toast />
    </>
  );
}

function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-xl">
      {toast}
    </div>
  );
}

function CartDrawer() {
  const s = useStore();
  const [note, setNote] = useState("");
  const [code, setCode] = useState("");
  if (!s.cartOpen) return null;
  const shipLeft = Math.max(0, 500 - s.subtotal);
  return (
    <div className="fixed inset-0 z-[60]">
      <button className="absolute inset-0 bg-black/40" aria-label="Close cart" onClick={() => s.setCartOpen(false)} />
      <aside className="slide-in absolute inset-y-0 right-0 flex w-[min(100%,420px)] flex-col bg-white">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-bold">Cart ({s.count})</h2>
          <button type="button" aria-label="Close" onClick={() => s.setCartOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <div className="border-b px-5 py-4">
          <div className="mb-2 flex justify-between text-xs font-semibold">
            <span>{shipLeft === 0 ? "You have unlocked free express shipping" : `${formatMoney(shipLeft, s.currency)} away from free express shipping`}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#eee]">
            <div className="h-full bg-[#0d8756]" style={{ width: `${Math.min(100, (s.subtotal / 500) * 100)}%` }} />
          </div>
        </div>
        <div className="flex-1 overflow-auto px-5 py-4">
          {s.cart.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-bold">Your cart is empty</p>
              <p className="mt-1 text-sm text-[#666]">The studio is open. Start with a chair.</p>
              <Btn className="mt-5" to="/collections/all" onClick={() => s.setCartOpen(false)}>
                Shop all products
              </Btn>
            </div>
          ) : (
            <ul className="space-y-5">
              {s.cart.map((line) => {
                const p = getProduct(line.handle);
                const v = p?.variants.find((x) => x.id === line.variantId);
                if (!p || !v) return null;
                return (
                  <li key={line.variantId} className="flex gap-3">
                    <Link to={`/products/${p.handle}`} onClick={() => s.setCartOpen(false)}>
                      <img src={img(v.image || p.images[0], 200)} alt="" className="h-24 w-24 rounded-xl object-cover bg-[#f3f3f3]" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/marble-product-placeholder.svg"; }} />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <Link to={`/products/${p.handle}`} className="font-semibold leading-tight" onClick={() => s.setCartOpen(false)}>
                          {p.title}
                        </Link>
                        <button type="button" className="text-xs text-[#888]" onClick={() => s.remove(line.variantId)}>
                          Remove
                        </button>
                      </div>
                      <p className="text-xs text-[#666]">{v.title}</p>
                      <p className="text-xs text-[#666]">Qty {line.qty}{p.saleUnit && p.saleUnit !== "piece" ? ` ${p.saleUnit}` : ""}</p>
                      {p.priceStatus === "estimated" ? <p className="text-[11px] text-[#8a5a00]">Unapproved price estimate · checkout unavailable</p> : null}
                      {volumeRate(line.qty) > 0 ? (
                        <p className="text-xs font-bold text-[#0d8756]">Volume −{volumeRate(line.qty) * 100}%</p>
                      ) : null}
                      <div className="mt-2 flex items-center justify-between">
                        <Qty value={line.qty} onChange={(n) => s.setQty(line.variantId, n)} label={p.title} />
                        {p.priceStatus === "estimated" ? <span className="text-xs font-semibold">Quote required</span> : <Money amount={linePrice(line)} />}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {s.cart.length > 0 ? (
            <label className="mt-6 block text-sm">
              <span className="font-bold">Order note</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-2 h-20 w-full rounded-2xl border border-[#e5e5e5] p-3 outline-none focus:border-black"
                placeholder="Delivery notes, floor, or a trade account reference"
              />
            </label>
          ) : null}
        </div>
        {s.cart.length > 0 ? (
          <div className="border-t px-5 py-4">
            <form
              className="mb-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                s.applyCode(code);
              }}
            >
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Discount code"
                className="h-11 flex-1 rounded-full bg-[#ededed] px-4 text-sm outline-none"
              />
              <button className="h-11 rounded-full bg-[#ededed] px-4 text-sm font-bold">Apply</button>
            </form>
            {s.code ? (
              <p className="mb-2 text-sm font-bold text-[#0d8756]">
                {s.code} applied{" "}
                <button type="button" className="underline" onClick={s.clearCode}>
                  remove
                </button>
              </p>
            ) : null}
            {s.cart.some((line) => getProduct(line.handle)?.priceStatus === "estimated") ? <p className="mt-3 border-t pt-3 text-sm font-semibold">A confirmed retail quote is required before checkout.</p> : <><div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <Money amount={s.subtotal} />
            </div></>}
            {s.discount > 0 ? (
              <div className="flex justify-between text-sm text-[#0d8756]">
                <span>Savings</span>
                <span>−{formatMoney(s.discount, s.currency)}</span>
              </div>
            ) : null}
            <div className="mt-1 flex justify-between font-bold">
              <span>Total</span>
              <Money amount={s.total} />
            </div>
            {s.cart.some((line) => getProduct(line.handle)?.inventoryPolicy === "preorder") ? <p className="mt-2 rounded-xl bg-[#f6f6f6] p-3 text-xs text-[#555]">Supply and delivery timing are confirmed after checkout. If supply cannot be secured, Cortex will contact you to arrange cancellation and a refund; refunds are not automatic.</p> : null}
            <p className="mt-1 text-xs text-[#888]">Taxes and shipping calculated at checkout.</p>
            <Btn className="mt-3 w-full" disabled={s.cart.some((line) => getProduct(line.handle)?.priceStatus === "estimated")} to="/checkout" onClick={() => s.setCartOpen(false)}>
              Checkout
            </Btn>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function QuickView() {
  const s = useStore();
  const p = s.quick ? getProduct(s.quick) : undefined;
  const colors = p ? colorOption(p) : undefined;
  const [color, setColor] = useState<string | undefined>();
  const [mat, setMat] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  useEffect(() => {
    if (!p) return;
    setColor(colorOption(p)?.values[0]);
    const other = p.options.find((o) => o.name !== colorOption(p)?.name);
    setMat(other?.values[0]);
    setQty(1);
  }, [p]);
  if (!s.quick || !p) return null;
  const other = p.options.find((o) => o.name !== colors?.name);
  const variant = pickVariant(p, {
    ...(colors && color ? { [colors.name]: color } : {}),
    ...(other && mat ? { [other.name]: mat } : {}),
  });
  const preorder = p.inventoryPolicy === "preorder";
  const coming = p.tags.includes("Coming Soon") || (!preorder && p.stock === 0);
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">
      <button className="absolute inset-0 bg-black/45" aria-label="Close quick view" onClick={() => s.setQuick(null)} />
      <div className="rise relative grid max-h-[90vh] w-full max-w-4xl overflow-auto rounded-3xl bg-white md:grid-cols-2">
        <button type="button" className="absolute right-4 top-4 z-10" aria-label="Close" onClick={() => s.setQuick(null)}>
          <CloseIcon />
        </button>
        <img src={img(variant.image || p.images[0], 1000)} alt={p.title} className="h-full max-h-[70vh] w-full object-cover bg-[#f3f3f3]" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/marble-product-placeholder.svg"; }} />
        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-wide text-[#888]">{p.type}</p>
          <h3 className="mt-1 text-2xl font-bold">{p.title}</h3>
          <div className="mt-2">{p.priceStatus === "estimated" ? <span className="font-semibold">Price on enquiry</span> : <><Money amount={variant.price} compare={variant.compare} /><span className="ml-1 text-sm text-[#666]">{priceUnitLabel(p)}</span></>}</div>
          {p.priceStatus === "estimated" ? <p className="mt-1 text-xs font-semibold text-[#8a5a00]">Retail price is not approved; checkout is unavailable.</p> : null}
          <p className="mt-3 text-sm text-[#555]">{p.desc}</p>
          {colors ? (
            <div className="mt-4">
              <p className="mb-2 text-sm font-bold">Color: {color}</p>
              <div className="flex flex-wrap gap-2">
                {colors.values.map((c) => (
                  <Swatch key={c} name={c} active={color === c} onClick={() => setColor(c)} image={findVariant(p, c).image} />
                ))}
              </div>
            </div>
          ) : null}
          {other ? (
            <div className="mt-4">
              <p className="mb-2 text-sm font-bold">{other.name}: {mat}</p>
              <div className="flex flex-wrap gap-2">
                {other.values.map((m) => (
                  <button key={m} type="button" onClick={() => setMat(m)} className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${mat === m ? "border-black bg-black text-white" : "border-[#e5e5e5]"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {preorder ? <p className="mt-5 rounded-xl bg-[#f6f6f6] p-3 text-sm">Pre-order: price and supplier availability require confirmation. Contact Cortex before purchase. If supply cannot be secured after an approved order, Cortex will contact you to arrange cancellation and a refund; refunds are not automatic.</p> : null}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Qty value={qty} onChange={setQty} label={p.title} />
            <Btn
              disabled={coming || !variant.available}
              onClick={() => {
                s.add(p.handle, variant.id, qty);
                s.setQuick(null);
              }}
            >
              {coming ? "Coming soon" : variant.available ? "Add to cart" : "Sold out"}
            </Btn>
          </div>
          <Link to={`/products/${p.handle}`} className="mt-4 inline-block text-sm font-bold underline" onClick={() => s.setQuick(null)}>
            View full details
          </Link>
        </div>
      </div>
    </div>
  );
}

function MobileSearch() {
  const s = useStore();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoryPickerRef = useRef<HTMLDivElement>(null);
  const categoryTypes = ["All Categories", ...new Set(products.map((product) => product.type).sort((a, b) => a.localeCompare(b)))];
  const hits = useMemo(
    () =>
      products
        .filter((product) => category === "All Categories" || product.type === category)
        .filter((product) => `${product.title} ${product.type}`.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 24),
    [category, q],
  );

  useEffect(() => {
    if (!categoriesOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !categoryPickerRef.current?.contains(target)) setCategoriesOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCategoriesOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [categoriesOpen]);

  if (!s.searchOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white p-4">
      <form
        className="flex shrink-0 items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          s.setSearchOpen(false);
          nav(`/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(category)}`);
        }}
      >
        <input autoFocus value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search" className="h-12 min-w-0 flex-1 rounded-full bg-[#ededed] px-5 outline-none" />
        <button type="button" aria-label="Close search" onClick={() => s.setSearchOpen(false)}>
          <CloseIcon />
        </button>
      </form>
      <div ref={categoryPickerRef} className="relative z-10 mt-3 shrink-0">
        <button type="button" aria-expanded={categoriesOpen} onClick={() => setCategoriesOpen((open) => !open)} className="flex h-11 w-full items-center justify-between rounded-xl border border-[#e5e5e5] px-3 text-left text-sm font-bold">
          <span>{category}</span><span className="text-[#666]">{categoriesOpen ? "Close" : "Browse categories"}</span>
        </button>
        {categoriesOpen ? (
          <div className="absolute inset-x-0 top-[calc(100%+6px)] max-h-[42vh] overflow-y-auto rounded-xl border border-[#e5e5e5] bg-white p-2 shadow-xl">
            <div className="grid grid-cols-2 gap-1">
              {categoryTypes.map((type) => (
                <button key={type} type="button" onClick={() => { setCategory(type); setCategoriesOpen(false); }} className={`rounded-lg px-3 py-2 text-left text-sm ${category === type ? "bg-[#1d349a] font-bold text-white" : "hover:bg-[#f3f3f3]"}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm font-bold">{category === "All Categories" ? "Products" : category} <span className="font-normal text-[#777]">({hits.length}{hits.length === 24 ? "+" : ""})</span></p>
          <Link to={category === "All Categories" ? "/collections/all" : categoryRoutesByType[category] ?? `/search?type=${encodeURIComponent(category)}`} onClick={() => s.setSearchOpen(false)} className="text-xs font-bold text-[#1d349a] underline">View All</Link>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {hits.length ? (
            <div className="grid grid-cols-2 gap-3">
              {hits.map((product) => (
                <Link key={product.handle} to={`/products/${product.handle}`} onClick={() => s.setSearchOpen(false)} className="overflow-hidden rounded-xl border border-[#eee] bg-white">
                  <div className="aspect-[4/3] overflow-hidden bg-[#f3f3f3]"><img src={img(product.images[0], 360)} alt={product.title} loading="lazy" className="h-full w-full object-cover" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/marble-product-placeholder.svg"; }} /></div>
                  <p className="line-clamp-2 px-2.5 py-2 text-xs font-semibold leading-snug">{product.title}</p>
                </Link>
              ))}
            </div>
          ) : <p className="py-8 text-center text-sm text-[#666]">No products match this category and search.</p>}
        </div>
      </div>
    </div>
  );
}

function CompareBar() {
  const s = useStore();
  if (s.compare.length === 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-[1680px] flex-wrap items-center gap-3">
        <p className="font-bold">Compare ({s.compare.length}/5)</p>
        <div className="flex gap-2">
          {s.compare.map((h) => {
            const p = getProduct(h);
            if (!p) return null;
            return (
              <button key={h} type="button" className="relative" onClick={() => s.toggleCompare(h)} aria-label={`Remove ${p.title}`}>
                <img src={img(p.images[0], 80)} alt="" className="h-12 w-12 rounded-lg object-cover" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/marble-product-placeholder.svg"; }} />
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex gap-2">
          <button type="button" className="text-sm font-bold underline" onClick={s.clearCompare}>
            Clear
          </button>
          <Btn to="/pages/compare" className="h-10 px-5 text-sm">
            Compare
          </Btn>
        </div>
      </div>
    </div>
  );
}

function Offers() {
  const s = useStore();
  const [copied, setCopied] = useState("");
  const copy = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    s.applyCode(code);
  };
  return (
    <div className="fixed bottom-24 left-4 z-30 hidden md:block">
      {s.offersOpen ? (
        <div className="mb-2 w-72 rounded-3xl bg-white p-4 shadow-2xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-bold">Offers</p>
            <button type="button" aria-label="Close offers" onClick={() => s.setOffersOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          {[
            ["FLASH30", "30% off the flash sale"],
            ["WELCOME10", "10% off your first order"],
          ].map(([code, label]) => (
            <button key={code} type="button" onClick={() => copy(code)} className="mt-2 flex w-full items-center justify-between rounded-2xl bg-[#f4f691] px-3 py-3 text-left">
              <span>
                <span className="block text-xs">{label}</span>
                <span className="font-bold">{code}</span>
              </span>
              <span className="text-xs font-bold">{copied === code ? "Copied" : "Copy"}</span>
            </button>
          ))}
        </div>
      ) : null}
      <button type="button" onClick={() => s.setOffersOpen(!s.offersOpen)} className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white">
        Offers
      </button>
    </div>
  );
}

function Popup() {
  const s = useStore();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (localStorage.getItem("garace-popup")) return;
    const t = window.setTimeout(() => setOpen(true), 14000);
    return () => window.clearTimeout(t);
  }, []);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[65] grid place-items-center p-4">
      <button className="absolute inset-0 bg-black/50" aria-label="Close popup" onClick={() => { setOpen(false); localStorage.setItem("garace-popup", "1"); }} />
      <div className="rise relative grid w-full max-w-3xl overflow-hidden rounded-3xl bg-white md:grid-cols-2">
        <img src="https://hyper-theme-demo.myshopify.com/cdn/shop/files/home-iwt_1-v2.jpg?width=800" alt="" className="hidden h-full object-cover md:block" referrerPolicy="no-referrer" />
        <div className="p-8">
          <button type="button" className="absolute right-4 top-4" aria-label="Close" onClick={() => { setOpen(false); localStorage.setItem("garace-popup", "1"); }}>
            <CloseIcon />
          </button>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1d349a]">The studio list</p>
          <h3 className="mt-2 text-3xl font-bold leading-tight">10% off your first order</h3>
          <p className="mt-2 text-sm text-[#555]">Sign up for new pieces, studio notes, and the code WELCOME10.</p>
          <form
            className="mt-5"
            onSubmit={(e) => {
              e.preventDefault();
              s.applyCode("WELCOME10");
              localStorage.setItem("garace-popup", "1");
              setOpen(false);
            }}
          >
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="h-12 w-full rounded-full bg-[#ededed] px-5 outline-none" />
            <Btn type="submit" className="mt-3 w-full">
              Sign up
            </Btn>
          </form>
        </div>
      </div>
    </div>
  );
}
