import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collections,
  faqs,
  file,
  formatMoney,
  getProduct,
  img,
  posts,
  priceUnitLabel,
  products,
  stores,
} from "@/data/catalog";
import { useStore } from "@/context/Store";
import { Btn, Crumbs, Money, Stars } from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";
import { api, ApiError } from "@/lib/api";
import { ProductEnquiry } from "@/components/ProductEnquiry";

export function AboutPage() {
  return (
    <div>
      <div className="relative h-[420px]">
        <img src={file("home-iwt_1-v2.jpg", 1800)} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1680px] px-6 pb-10 text-white lg:px-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em]">The studio</p>
            <h1 className="text-5xl font-bold">About Cortex</h1>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold">Where design meets function</h2>
          <p className="mt-4 text-[#444]">
            Cortex is a furniture studio working between New York and Copenhagen. We design pieces for rooms that have to work on a Tuesday and still feel considered on Sunday — sofas with a low line, tables with a precise edge, lamps that behave like objects.
          </p>
          <p className="mt-3 text-[#444]">
            The collection is small on purpose. Oak, wool, steel, and glaze. Prices are published without ceremony. Volume rules exist for designers and small trade accounts who specify the same piece more than once.
          </p>
        </div>
        <img src={file("multicolumn-1-v2.jpg", 900)} alt="" className="rounded-3xl object-cover" referrerPolicy="no-referrer" />
      </div>
      <div className="bg-[#1d349a] py-14 text-white">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-6 px-6 text-center">
          {[
            ["2014", "Studio founded"],
            ["5", "Cities with a showroom"],
            ["4.8", "Review score"],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="text-4xl font-bold">{n}</p>
              <p className="text-sm text-white/80">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 lg:grid-cols-2">
      <div>
        <Crumbs items={[{ label: "Contact" }]} />
        <h1 className="text-4xl font-bold">Contact</h1>
        <p className="mt-3 text-[#555]">Write to the studio for a project, a trade account, or a piece you cannot find.</p>
        <p className="mt-6 text-sm text-[#555]">Use the configured email form or continue the conversation in WhatsApp. Product questions can include the product page link and selected options.</p>
      </div>
      <ProductEnquiry />
    </div>
  );
}

export function FaqPage() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Crumbs items={[{ label: "FAQs" }]} />
      <h1 className="text-4xl font-bold">Help Center</h1>
      <div className="mt-8 divide-y border-y">
        {faqs.map((f, i) => (
          <div key={f.q}>
            <button type="button" className="flex w-full items-center justify-between py-4 text-left font-bold" onClick={() => setOpen(open === i ? -1 : i)}>
              {f.q}
              <span>{open === i ? "–" : "+"}</span>
            </button>
            {open === i ? <p className="pb-4 text-sm text-[#555]">{f.a}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StoresPage() {
  const [q, setQ] = useState("");
  const list = stores.filter((s) => `${s.city} ${s.name} ${s.address}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Crumbs items={[{ label: "Find a Store" }]} />
      <h1 className="text-4xl font-bold">Find a Store</h1>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search city" className="mt-6 h-12 w-full max-w-md rounded-full bg-[#ededed] px-5 outline-none" />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {list.map((s) => (
          <article key={s.city} className="rounded-3xl border border-[#eee] p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[#1d349a]">{s.city}</p>
            <h2 className="text-xl font-bold">{s.name}</h2>
            <p className="mt-2 text-sm text-[#555]">{s.address}</p>
            <p className="text-sm">{s.hours}</p>
            <p className="text-sm font-semibold">{s.phone}</p>
            <a className="mt-3 inline-block text-sm font-bold underline" href={`https://maps.google.com/?q=${encodeURIComponent(s.address)}`} target="_blank" rel="noreferrer">
              Open map
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

export function BlogPage() {
  return (
    <div className="mx-auto max-w-[1680px] px-6 py-12 lg:px-10">
      <h1 className="text-4xl font-bold">Journal</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.slug} to={`/pages/blog/${p.slug}`} className="group">
            <img src={file(p.image, 800)} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover" referrerPolicy="no-referrer" />
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#888]">{p.date}</p>
            <h2 className="text-xl font-bold group-hover:underline">{p.title}</h2>
            <p className="text-sm text-[#555]">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PostPage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return <div className="px-6 py-20 text-center">Article not found.</div>;
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Crumbs items={[{ label: "Journal", to: "/pages/blog" }, { label: post.title }]} />
      <p className="text-sm text-[#888]">{post.date}</p>
      <h1 className="mt-2 text-4xl font-bold">{post.title}</h1>
      <img src={file(post.image, 1400)} alt="" className="mt-6 w-full rounded-3xl object-cover" referrerPolicy="no-referrer" />
      <p className="mt-6 text-lg leading-relaxed text-[#333]">{post.body}</p>
    </article>
  );
}

export function FeaturesPage() {
  const links = [
    ["Vertical thumbnails", "/products/arc-chair?gallery=vertical"],
    ["Horizontal thumbnails", "/products/arc-chair?gallery=horizontal"],
    ["Grid 2 columns", "/products/loop-sofa-armrest?gallery=grid"],
    ["Grid mix", "/products/swivel-table?gallery=mix"],
    ["Color swatches", "/products/arc-chair?swatch=color"],
    ["Image swatches", "/products/cozy-chair?swatch=image"],
    ["Flash sale product", "/products/arc-chair"],
    ["Coming soon", "/products/rio-ottoman"],
    ["Out of stock", "/products/victoria-ottoman"],
    ["On sale collection", "/collections/sale-items"],
    ["Left banner collection", "/collections/chairs?layout=left"],
    ["Card collection", "/collections/lighting?layout=cards"],
    ["Quick order list", "/pages/quick-order"],
    ["Compare", "/pages/compare"],
    ["Gift card", "/products/hyper-gift-card"],
  ];
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-bold">Theme Features</h1>
      <p className="mt-2 max-w-2xl text-[#555]">The Hyper preset is built for deep catalogs: mega menus, swatches, compare, volume pricing, and several ways to open a collection or a product.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map(([label, to]) => (
          <Link key={label} to={to} className="rounded-2xl bg-[#f6f6f6] p-5 font-bold hover:bg-[#ededed]">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ComparePage() {
  const { compare, toggleCompare, clearCompare, currency } = useStore();
  const list = compare.map((h) => getProduct(h)).filter(Boolean);
  if (list.length === 0) {
    return (
      <div className="px-6 py-24 text-center">
        <h1 className="text-3xl font-bold">Compare</h1>
        <p className="mt-2 text-[#666]">Select up to five pieces from any collection.</p>
        <Btn to="/collections/chairs" className="mt-6">Browse chairs</Btn>
      </div>
    );
  }
  const rows: [string, (p: NonNullable<(typeof list)[number]>) => string][] = [
    ["Price", (p) => `${formatMoney(p.variants[0].price, currency)}${priceUnitLabel(p)}${p.priceStatus === "estimated" ? " (estimate)" : ""}`],
    ["Type", (p) => p.type],
    ["Rating", (p) => String(p.rating)],
    ["Dimensions", (p) => p.dims],
    ["Seat", (p) => p.seat],
    ["Weight", (p) => p.weight],
    ["Origin", (p) => p.origin],
    ["Stock", (p) => p.inventoryPolicy === "preorder" ? "Pre-order; supplier availability confirmed after checkout" : p.stock ? `${p.stock} in studio` : "Waitlist"],
  ];
  return (
    <div className="mx-auto max-w-[1680px] overflow-auto px-6 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compare</h1>
        <button type="button" className="text-sm font-bold underline" onClick={clearCompare}>Clear all</button>
      </div>
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr>
            <th />
            {list.map((p) => (
              <th key={p!.handle} className="p-3 align-top">
                <img src={img(p!.images[0], 300)} alt="" className="mb-2 h-36 w-full rounded-2xl object-cover" referrerPolicy="no-referrer" />
                <Link to={`/products/${p!.handle}`} className="font-bold hover:underline">{p!.title}</Link>
                <button type="button" className="mt-1 block text-xs underline" onClick={() => toggleCompare(p!.handle)}>Remove</button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, fn]) => (
            <tr key={label} className="border-t">
              <th className="py-3 pr-4 font-bold">{label}</th>
              {list.map((p) => (
                <td key={p!.handle} className="p-3">{fn(p!)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WishlistPage() {
  const { wishlist, toggleWish } = useStore();
  const list = wishlist.map((h) => getProduct(h)).filter(Boolean);
  return (
    <div className="mx-auto max-w-[1680px] px-6 py-10 lg:px-10">
      <h1 className="text-4xl font-bold">Wishlist</h1>
      {list.length === 0 ? (
        <div className="py-16">
          <p className="text-[#666]">Nothing saved yet.</p>
          <Btn to="/collections/new" className="mt-4">See new arrivals</Btn>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {list.map((p) => (
            <div key={p!.handle}>
              <ProductCard product={p!} />
              <button type="button" className="mt-2 text-xs font-bold underline" onClick={() => toggleWish(p!.handle)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AccountPage() {
  const { user, signIn, signOut } = useStore();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  if (user) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <h1 className="text-3xl font-bold">Hello, {user.name.split(" ")[0]}</h1>
        <p className="mt-2 text-sm text-[#666]">{user.email}</p>
        <div className="mt-6 space-y-2 text-sm font-bold">
          <Link to="/pages/wishlist" className="block underline">Wishlist</Link>
          <Link to="/pages/quick-order" className="block underline">Quick order</Link>
          <Link to="/collections/sale-items" className="block underline">Your offers</Link>
        </div>
        <button type="button" className="mt-6 text-sm font-bold underline" onClick={signOut}>Sign out</button>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="mb-6 flex gap-4 font-bold">
        <button type="button" className={mode === "in" ? "underline" : "text-[#888]"} onClick={() => setMode("in")}>Sign in</button>
        <button type="button" className={mode === "up" ? "underline" : "text-[#888]"} onClick={() => setMode("up")}>Register</button>
      </div>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          setSubmitting(true);
          setError("");
          try {
            const body = { name: String(data.get("name") || ""), email: String(data.get("email") || ""), password: String(data.get("password") || "") };
            const result = await api<{ token: string; user: { name: string; email: string; role: string } }>(mode === "in" ? "/auth/login" : "/auth/register", { method: "POST", body: JSON.stringify(body) });
            signIn(result.user.name, result.user.email, result.token, result.user.role);
          } catch (err) {
            setError(err instanceof ApiError ? err.message : "Unable to sign in. Please retry.");
          } finally { setSubmitting(false); }
        }}
      >
        {mode === "up" ? <input name="name" required placeholder="Name" className="h-12 w-full rounded-2xl bg-[#ededed] px-4 outline-none" /> : <input type="hidden" name="name" value="Studio Guest" />}
        <input name="email" type="email" required placeholder="Email" className="h-12 w-full rounded-2xl bg-[#ededed] px-4 outline-none" />
        <input name="password" type="password" required minLength={8} placeholder="Password" className="h-12 w-full rounded-2xl bg-[#ededed] px-4 outline-none" />
        {error ? <p className="text-sm font-semibold text-[#c4301c]" role="alert">{error}</p> : null}
        <Btn type="submit" className="w-full" disabled={submitting}>{submitting ? "Please wait" : mode === "in" ? "Sign in" : "Create account"}</Btn>
      </form>
    </div>
  );
}

export function PoliciesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-bold">Policies</h1>
      <h2 className="mt-8 text-xl font-bold">Shipping</h2>
      <p className="mt-2 text-sm text-[#444]">Express shipping is free on orders over $500. Standard delivery is a flat $29. In-store pickup is free from New York, Miami, and Los Angeles.</p>
      <h2 className="mt-6 text-xl font-bold">Returns</h2>
      <p className="mt-2 text-sm text-[#444]">Unused goods may be returned within 30 days. Furniture must be in original condition. Contact the studio and we will arrange collection in most metro areas.</p>
      <h2 className="mt-6 text-xl font-bold">Privacy</h2>
      <p className="mt-2 text-sm text-[#444]">We keep your name, email, and order details to fulfill what you asked for. We do not sell them. Newsletter mail can be stopped from any message.</p>
    </div>
  );
}

export function QuickOrderPage() {
  const [qty, setQty] = useState<Record<string, number>>({});
  const { add } = useStore();
  const rows = useMemo(() => products.filter((p) => ["Chairs", "Tables", "Sofas", "Desks", "Bar Stools"].includes(p.type)).slice(0, 18), []);
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-bold">Quick order</h1>
      <p className="mt-2 text-sm text-[#555]">A list for trade accounts. Set quantities and add the whole sheet to the cart. Volume pricing applies at 5 and 10.</p>
      <div className="mt-6 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Piece</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.handle} className="border-b">
                <td className="py-2">
                  <Link to={`/products/${p.handle}`} className="font-semibold hover:underline">{p.title}</Link>
                </td>
                <td className="text-[#666]">{p.sku}</td>
                <td><Money amount={p.variants[0].price} /><span className="ml-1 text-xs">{priceUnitLabel(p)}</span>{p.priceStatus === "estimated" ? <span className="ml-1 text-xs text-[#8a5a00]">Est.</span> : null}</td>
                <td>
                  <input
                    type="number" min={0} value={qty[p.handle] || 0}
                    onChange={(e) => setQty({ ...qty, [p.handle]: Number(e.target.value) })}
                    className="h-10 w-20 rounded-xl bg-[#ededed] px-2"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 0 ? <Btn
        className="mt-6"
        onClick={() => {
          rows.forEach((p) => {
            const n = qty[p.handle] || 0;
            if (n > 0) add(p.handle, p.variants[0].id, n);
          });
        }}
      >
        Add selected to cart
      </Btn> : null}
    </div>
  );
}

export function CollectionsIndex() {
  return (
    <div className="mx-auto max-w-[1680px] px-6 py-12 lg:px-10">
      <h1 className="text-4xl font-bold">Collections</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {collections.slice(0, 16).map((c) => (
          <Link key={c.handle} to={`/collections/${c.handle}`} className="group">
            <img src={file(c.image, 600)} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover" referrerPolicy="no-referrer" />
            <p className="mt-2 font-bold group-hover:underline">{c.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="px-6 py-24 text-center">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <Btn to="/" className="mt-6">Home</Btn>
    </div>
  );
}

export function RatingNote() {
  return <Stars value={5} />;
}
