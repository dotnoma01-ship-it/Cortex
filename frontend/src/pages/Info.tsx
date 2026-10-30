import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  COLORS,
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
  const features: { label: string; to: string; kind: string; handles: string[]; asset?: string }[] = [
    { label: "Vertical thumbnails", to: "/products/arc-chair?gallery=vertical", kind: "vertical", handles: ["arc-chair"] },
    { label: "Horizontal thumbnails", to: "/products/arc-chair?gallery=horizontal", kind: "horizontal", handles: ["loop-sofa-armrest"] },
    { label: "Grid 2 columns", to: "/products/loop-sofa-armrest?gallery=grid", kind: "grid", handles: ["loop-sofa-armrest"] },
    { label: "Grid mix", to: "/products/swivel-table?gallery=mix", kind: "mix", handles: ["swivel-table", "highline-table", "nook-table"] },
    { label: "Color swatches", to: "/products/arc-chair?swatch=color", kind: "colors", handles: ["arc-chair"] },
    { label: "Image swatches", to: "/products/cozy-chair?swatch=image", kind: "image-swatches", handles: ["cozy-chair"] },
    { label: "Flash sale product", to: "/products/arc-chair", kind: "sale-product", handles: ["arc-chair"] },
    { label: "Coming soon", to: "/products/rio-ottoman", kind: "coming", handles: ["rio-ottoman"] },
    { label: "Out of stock", to: "/products/victoria-ottoman", kind: "sold", handles: ["victoria-ottoman"] },
    { label: "On sale collection", to: "/collections/sale-items", kind: "sale-collection", handles: ["loop-sofa-armrest"], asset: "collection-sales.webp" },
    { label: "Left banner collection", to: "/collections/chairs?layout=left", kind: "left-banner", handles: ["arc-chair"], asset: "collection-slider-6.jpg" },
    { label: "Card collection", to: "/collections/lighting?layout=cards", kind: "cards", handles: ["ray-table-lamp-1", "halo-lamp", "swing-wall-lamp"] },
    { label: "Quick order list", to: "/pages/quick-order", kind: "quick-order", handles: ["arc-chair", "highline-table", "ray-table-lamp-1"] },
    { label: "Compare", to: "/pages/compare", kind: "compare", handles: ["arc-chair", "swivel-table"] },
    { label: "Gift card", to: "/products/hyper-gift-card", kind: "gift-card", handles: ["hyper-gift-card"] },
  ];

  const imageFor = (handle: string, index = 0, width = 520) => {
    const product = getProduct(handle);
    const source = product?.images[index] || product?.images[0];
    return source ? img(source, width) : "";
  };

  const preview = (feature: (typeof features)[number]) => {
    const product = getProduct(feature.handles[0])!;
    const productImages = product.images;
    const stage = "relative aspect-[4/3] overflow-hidden bg-[#f1f1ef]";
    const productPhoto = (handle: string, index = 0, className = "") => (
      <img src={imageFor(handle, index)} alt="" className={`object-cover ${className}`} referrerPolicy="no-referrer" />
    );

    if (feature.kind === "vertical") {
      return <div className={`${stage} flex gap-1.5 p-2`}><div className="min-w-0 flex-1 overflow-hidden rounded-lg">{productPhoto(product.handle, 0, "h-full w-full")}</div><div className="flex w-[19%] flex-col gap-1.5">{productImages.slice(1, 4).map((_, index) => <div key={index} className="min-h-0 flex-1 overflow-hidden rounded-md">{productPhoto(product.handle, index + 1, "h-full w-full")}</div>)}</div></div>;
    }
    if (feature.kind === "horizontal") {
      return <div className={`${stage} flex flex-col gap-1.5 p-2`}><div className="min-h-0 flex-1 overflow-hidden rounded-lg">{productPhoto(product.handle, 0, "h-full w-full")}</div><div className="flex h-[22%] gap-1.5">{productImages.slice(1, 4).map((_, index) => <div key={index} className="min-w-0 flex-1 overflow-hidden rounded-md">{productPhoto(product.handle, index + 1, "h-full w-full")}</div>)}</div></div>;
    }
    if (feature.kind === "grid") {
      return <div className={`${stage} grid grid-cols-2 gap-1.5 p-2`}>{productImages.slice(0, 4).map((_, index) => <div key={index} className="min-h-0 overflow-hidden rounded-md">{productPhoto(product.handle, index, "h-full w-full")}</div>)}</div>;
    }
    if (feature.kind === "mix") {
      return <div className={`${stage} grid grid-cols-[1.35fr_1fr] gap-1.5 p-2`}><div className="overflow-hidden rounded-lg">{productPhoto(feature.handles[0], 0, "h-full w-full")}</div><div className="grid min-h-0 grid-rows-2 gap-1.5">{feature.handles.slice(1, 3).map((handle) => <div key={handle} className="overflow-hidden rounded-md">{productPhoto(handle, 0, "h-full w-full")}</div>)}</div></div>;
    }
    if (feature.kind === "colors") {
      const colors = product.options.find((option) => /color|colour/i.test(option.name))?.values ?? [];
      return <div className={stage}>{productPhoto(product.handle, 0, "absolute inset-0 h-full w-full") }<div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-white/95 px-3 py-2"><span className="text-[10px] font-bold text-[#555]">COLOR</span><div className="flex gap-1.5">{colors.slice(0, 5).map((color) => <span key={color} title={color} className="h-4 w-4 rounded-full border border-black/15" style={{ backgroundColor: COLORS[color] ?? "#bbb" }} />)}</div></div></div>;
    }
    if (feature.kind === "image-swatches") {
      return <div className={`${stage} flex flex-col gap-1.5 p-2`}><div className="min-h-0 flex-1 overflow-hidden rounded-lg">{productPhoto(product.handle, 0, "h-full w-full")}</div><div className="flex h-[22%] gap-1.5">{productImages.map((_, index) => <div key={index} className="min-w-0 flex-1 overflow-hidden rounded-md border border-white">{productPhoto(product.handle, index, "h-full w-full")}</div>)}</div></div>;
    }
    if (feature.kind === "sale-product") {
      return <div className={stage}>{productPhoto(product.handle, 0, "absolute inset-0 h-full w-full") }<span className="absolute left-3 top-3 rounded-md bg-[#c4301c] px-2.5 py-1 text-[10px] font-bold text-white">SALE</span><div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-lg bg-white/95 px-3 py-2"><span className="truncate text-xs font-bold">{product.title}</span><span className="ml-2 shrink-0 text-[10px] font-bold text-[#c4301c]">-{Math.round((1 - product.variants[0].price / (product.variants[0].compare ?? product.variants[0].price)) * 100)}%</span></div></div>;
    }
    if (feature.kind === "coming" || feature.kind === "sold") {
      return <div className={stage}>{productPhoto(product.handle, 0, `absolute inset-0 h-full w-full ${feature.kind === "sold" ? "grayscale" : ""}`)}<div className="absolute inset-0 grid place-items-center bg-black/20"><span className="rounded-md bg-white/95 px-3 py-1.5 text-xs font-bold">{feature.kind === "coming" ? "COMING SOON" : "SOLD OUT"}</span></div></div>;
    }
    if (feature.kind === "sale-collection") {
      return <div className={stage}><img src={file(feature.asset!, 640)} alt="" className="absolute inset-0 h-full w-full object-cover" referrerPolicy="no-referrer" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white"><span className="text-[10px] font-bold uppercase">Cortex collection</span><p className="text-lg font-bold">Sale Items</p></div></div>;
    }
    if (feature.kind === "left-banner") {
      return <div className={`${stage} grid grid-cols-[0.8fr_1.2fr]`}><div className="flex flex-col justify-center bg-[#f4f1ea] p-3"><span className="text-[9px] font-bold uppercase text-[#1d349a]">Collection</span><span className="mt-1 text-sm font-bold leading-tight">Chairs</span><span className="mt-2 text-[9px] text-[#555]">Discover the range</span></div><img src={file(feature.asset!, 640)} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" /></div>;
    }
    if (feature.kind === "cards") {
      return <div className={`${stage} grid grid-cols-3 gap-1.5 p-2`}>{feature.handles.map((handle) => <div key={handle} className="overflow-hidden rounded-lg bg-white shadow-sm">{productPhoto(handle, 0, "h-[78%] w-full") }<span className="block truncate px-1.5 py-1 text-[9px] font-bold">{getProduct(handle)?.title}</span></div>)}</div>;
    }
    if (feature.kind === "quick-order") {
      return <div className={`${stage} flex flex-col justify-center gap-1.5 bg-[#f7f7f7] p-2.5`}>{feature.handles.map((handle) => {const item = getProduct(handle)!; return <div key={handle} className="flex min-w-0 items-center gap-2 rounded-md border border-[#eee] bg-white px-2 py-1"><span className="h-9 w-9 shrink-0 overflow-hidden rounded">{productPhoto(handle, 0, "h-full w-full")}</span><span className="min-w-0 flex-1"><span className="block truncate text-[9px] font-bold">{item.title}</span><span className="block text-[8px] text-[#777]">{item.sku}</span></span><span className="text-[9px] font-bold">QTY 1</span></div>})}</div>;
    }
    if (feature.kind === "compare") {
      return <div className={`${stage} grid grid-cols-2 gap-2 p-2.5`}>{feature.handles.map((handle) => {const item = getProduct(handle)!; return <div key={handle} className="min-w-0 overflow-hidden rounded-lg bg-white"><div className="h-[74%] overflow-hidden">{productPhoto(handle, 0, "h-full w-full")}</div><p className="truncate px-2 pt-1 text-[9px] font-bold">{item.title}</p><p className="px-2 text-[9px] text-[#555]">{item.dims}</p></div>})}<span className="absolute left-1/2 top-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#1d349a] text-[9px] font-bold text-white">VS</span></div>;
    }
    if (feature.kind === "gift-card") {
      return <div className={`${stage} flex items-center justify-center bg-[#f4f1ea] p-3`}><div className="relative h-full w-full overflow-hidden rounded-lg shadow-md">{productPhoto(product.handle, 0, "h-full w-full") }<div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-black/65 p-1.5">{product.variants.map((variant) => <span key={variant.id} className="rounded bg-white/95 px-1.5 py-0.5 text-[8px] font-bold">{variant.option1}</span>)}</div></div></div>;
    }
    return <div className={stage}>{productPhoto(product.handle, 0, "h-full w-full")}</div>;
  };

  return (
    <div className="mx-auto max-w-[1680px] px-4 py-10 sm:px-6 lg:px-10">
      <h1 className="text-4xl font-bold">Theme Features</h1>
      <p className="mt-2 max-w-2xl text-[#555]">The Hyper preset is built for deep catalogs: mega menus, swatches, compare, volume pricing, and several ways to open a collection or a product.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map((feature) => (
          <Link key={feature.label} to={feature.to} className="theme-feature-card group overflow-hidden rounded-xl border border-[#e9e9e9] bg-white transition duration-200 ease-out hover:-translate-y-1 hover:border-[#1d349a]/35 hover:shadow-[0_12px_30px_rgba(17,17,17,.10)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            {preview(feature)}
            <h2 className="px-3.5 py-3 text-sm font-bold leading-snug group-hover:text-[#1d349a] sm:text-base">{feature.label}</h2>
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
    ["Price", (p) => p.priceStatus === "estimated" ? "Price on enquiry" : `${formatMoney(p.variants[0].price, currency)}${priceUnitLabel(p)}`],
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
                <td>{p.priceStatus === "estimated" ? <span className="text-xs font-semibold">Price on enquiry</span> : <><Money amount={p.variants[0].price} /><span className="ml-1 text-xs">{priceUnitLabel(p)}</span></>}</td>
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
