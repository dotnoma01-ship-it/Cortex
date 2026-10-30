import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  colorOption,
  discountPct,
  file,
  findVariant,
  pickVariant,
  priceUnitLabel,
  getCollection,
  getProduct,
  img,
  products as localProducts,
  related,
} from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Btn, Crumbs, Heart, Money, Qty, Stars, Swatch } from "@/components/ui";
import { useStore } from "@/context/Store";
import { cn } from "@/utils/cn";
import { api, ApiError } from "@/lib/api";
import { ProductEnquiry } from "@/components/ProductEnquiry";

function useApiProducts() {
  const [items, setItems] = useState(localProducts);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    void api<{ products: typeof localProducts }>("/products?limit=100")
      .then((result) => {
        if (!active) return;
        const localPreorders = localProducts.filter((product) => product.inventoryPolicy === "preorder");
        const preorderHandles = new Set(localPreorders.map((product) => product.handle));
        setItems([...result.products.filter((product) => !preorderHandles.has(product.handle)), ...localPreorders]);
      })
      .catch((err) => { if (active) setError(err instanceof ApiError ? err.message : "Unable to load products."); });
    return () => { active = false; };
  }, []);
  return { items, error };
}

export function CollectionPage() {
  const { handle = "all" } = useParams();
  const [params, setParams] = useSearchParams();
  const col = getCollection(handle) ?? getCollection("all")!;
  const layout = params.get("layout") || "banner";
  const [sort, setSort] = useState("featured");
  const [grid, setGrid] = useState<"grid" | "list">("grid");
  const [cols, setCols] = useState(4);
  const [maxPrice, setMaxPrice] = useState(4000);
  const [inStock, setInStock] = useState(false);
  const [types, setTypes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [openFilters, setOpenFilters] = useState(false);
  const { items: apiProducts, error: productError } = useApiProducts();

  const base = apiProducts.filter(col.match);
  const allTypes = Array.from(new Set(base.map((p) => p.type))).sort();
  const allColors = Array.from(
    new Set(base.flatMap((p) => colorOption(p)?.values ?? [])),
  ).sort();

  const list = useMemo(() => {
    let items = base.filter((p) => p.variants[0].price <= maxPrice);
    if (inStock) items = items.filter((p) => p.stock > 0 && !p.tags.includes("Coming Soon"));
    if (types.length) items = items.filter((p) => types.includes(p.type));
    if (colors.length) items = items.filter((p) => colorOption(p)?.values.some((c) => colors.includes(c)));
    const arr = [...items];
    if (sort === "az") arr.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "za") arr.sort((a, b) => b.title.localeCompare(a.title));
    if (sort === "low") arr.sort((a, b) => a.variants[0].price - b.variants[0].price);
    if (sort === "high") arr.sort((a, b) => b.variants[0].price - a.variants[0].price);
    if (sort === "new") arr.sort((a, b) => Number(b.tags.includes("New")) - Number(a.tags.includes("New")));
    return arr;
  }, [base, maxPrice, inStock, types, colors, sort]);

  const toggle = (arr: string[], v: string, set: (n: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const banner = (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl",
        layout === "none" && "hidden",
        layout === "bg" && "bg-[#1d349a] text-white",
        layout === "cards" && "bg-[#f6f6f6]",
      )}
    >
      {layout !== "bg" && layout !== "cards" ? (
        <img src={file(col.image, 1800)} alt="" className="h-56 w-full object-cover sm:h-72" referrerPolicy="no-referrer" />
      ) : (
        <div className="h-48" />
      )}
      <div className={cn("absolute inset-0 flex flex-col justify-end p-8", layout === "bg" || layout === "cards" ? "relative" : "bg-gradient-to-t from-black/55 to-transparent text-white")}>
        <p className="text-sm font-bold opacity-80">{base.length} products</p>
        <h1 className="text-4xl font-bold">{col.title}</h1>
        <p className="mt-1 max-w-xl text-sm opacity-90">{col.blurb}</p>
      </div>
    </div>
  );

  const filters = (
    <div className="space-y-6">
      <div>
        <p className="font-bold">Availability</p>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={inStock} onChange={() => setInStock((v) => !v)} /> In stock ({base.filter((p) => p.stock > 0).length})
        </label>
      </div>
      <div>
        <p className="font-bold">Price</p>
        <input type="range" min={10} max={4000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="mt-3 w-full accent-black" />
        <p className="text-sm text-[#666]">Up to ${maxPrice.toLocaleString()}</p>
      </div>
      <div>
        <p className="font-bold">Color</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {allColors.map((c) => (
            <button key={c} type="button" onClick={() => toggle(colors, c, setColors)} className={cn("rounded-full", colors.includes(c) && "ring-2 ring-black ring-offset-2")}>
              <Swatch name={c} />
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="font-bold">Product type</p>
        <ul className="mt-2 space-y-1 text-sm">
          {allTypes.map((t) => (
            <li key={t}>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={types.includes(t)} onChange={() => toggle(types, t, setTypes)} />
                {t}
                <span className="text-[#999]">({base.filter((p) => p.type === t).length})</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        className="text-sm font-bold underline"
        onClick={() => {
          setTypes([]);
          setColors([]);
          setInStock(false);
          setMaxPrice(4000);
        }}
      >
        Clear filters
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1680px] px-4 py-8 sm:px-6 lg:px-10">
      <Crumbs items={[{ label: col.title }]} />
      <div className={cn("mb-8", layout === "right" && "lg:ml-auto lg:max-w-3xl", layout === "left" && "lg:max-w-3xl")}>{banner}</div>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{filters}</aside>
        <div>
          {productError ? <p className="mb-3 text-sm text-[#666]">{productError} Showing the catalog currently available in this browser.</p> : null}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <button type="button" className="h-10 rounded-full bg-[#ededed] px-4 text-sm font-bold lg:hidden" onClick={() => setOpenFilters(true)}>
              Filter
            </button>
            <p className="text-sm text-[#666]">{list.length} products</p>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 rounded-full bg-[#ededed] px-3 text-sm font-bold">
                <option value="featured">Featured</option>
                <option value="new">New</option>
                <option value="az">Alphabetically, A–Z</option>
                <option value="za">Alphabetically, Z–A</option>
                <option value="low">Price, low to high</option>
                <option value="high">Price, high to low</option>
              </select>
              <button type="button" className={cn("h-10 rounded-full px-3 text-sm font-bold", grid === "grid" ? "bg-black text-white" : "bg-[#ededed]")} onClick={() => setGrid("grid")}>
                Grid
              </button>
              <button type="button" className={cn("h-10 rounded-full px-3 text-sm font-bold", grid === "list" ? "bg-black text-white" : "bg-[#ededed]")} onClick={() => setGrid("list")}>
                List
              </button>
              <button type="button" className="hidden h-10 rounded-full bg-[#ededed] px-3 text-sm font-bold xl:inline" onClick={() => setCols(cols === 4 ? 3 : 4)}>
                {cols} col
              </button>
            </div>
          </div>
          {list.length === 0 ? (
            <p className="py-16 text-center text-[#666]">No pieces match those filters.</p>
          ) : (
            <div className={cn("grid gap-5", grid === "list" ? "grid-cols-1" : cols === 3 ? "grid-cols-2 xl:grid-cols-3" : "grid-cols-2 xl:grid-cols-4")}>
              {list.map((p) => (
                <ProductCard key={p.handle} product={p} layout={grid} swatch={params.get("swatch") === "image" ? "image" : "color"} />
              ))}
            </div>
          )}
        </div>
      </div>
      {openFilters ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/40" onClick={() => setOpenFilters(false)} aria-label="Close filters" />
          <div className="absolute inset-y-0 left-0 w-[min(100%,340px)] overflow-auto bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-bold">Filter</p>
              <button type="button" onClick={() => setOpenFilters(false)}>Close</button>
            </div>
            {filters}
          </div>
        </div>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-2 text-xs">
        {["banner", "left", "right", "bg", "cards", "none"].map((l) => (
          <button key={l} type="button" className="rounded-full bg-[#f3f3f3] px-3 py-1 font-bold capitalize" onClick={() => setParams({ layout: l })}>
            {l} layout
          </button>
        ))}
      </div>
    </div>
  );
}

export function MarbleProductsPage() {
  const { items, error } = useApiProducts();
  const marbleProducts = items.filter((product) => product.type === "Marble Products");

  return (
    <section className="mx-auto max-w-[1680px] px-4 py-10 sm:px-6 lg:px-10">
      <Crumbs items={[{ label: "Marble Products" }]} />
      <header className="mb-8 border-b border-[#eee] pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1d349a]">Cortex materials</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Marble Products</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#666]">Review marble-effect panels listed by Cortex. Price and current availability are confirmed on enquiry.</p>
      </header>
      {error ? <p className="mb-4 text-sm text-[#666]">{error} Showing products currently available in this browser.</p> : null}
      {marbleProducts.length ? (
        <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
          {marbleProducts.map((product) => <ProductCard key={product.handle} product={product} />)}
        </div>
      ) : (
        <div className="rounded-2xl bg-[#f6f6f6] px-6 py-14 text-center">
          <p className="text-lg font-semibold">No marble products are currently listed.</p>
          <p className="mt-2 text-sm text-[#666]">Please check back while we confirm product details.</p>
        </div>
      )}
    </section>
  );
}

export function ProductPage() {
  const { handle = "" } = useParams();
  const [params] = useSearchParams();
  const [remoteProduct, setRemoteProduct] = useState<ReturnType<typeof getProduct>>();
  const [productError, setProductError] = useState("");
  const localProduct = getProduct(handle);
  const product = localProduct?.inventoryPolicy === "preorder" ? localProduct : remoteProduct ?? localProduct;
  const gallery = params.get("gallery") || "vertical";
  const swatch = params.get("swatch") === "image" ? "image" : "color";
  const store = useStore();
  const colors = product ? colorOption(product) : undefined;
  const other = product?.options.find((o) => o.name !== colors?.name);
  const [color, setColor] = useState(colors?.values[0]);
  const [mat, setMat] = useState(other?.values[0]);
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);
  const [tab, setTab] = useState("Description");
  const [zip, setZip] = useState("");
  const [eta, setEta] = useState("");
  const [notify, setNotify] = useState("");
  const [noted, setNoted] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    let active = true;
    setRemoteProduct(undefined);
    setProductError("");
    void api<{ product: NonNullable<ReturnType<typeof getProduct>> }>(`/products/${encodeURIComponent(handle)}`)
      .then((result) => { if (active) setRemoteProduct(result.product); })
      .catch((err) => { if (active) setProductError(err instanceof ApiError ? err.message : "Unable to load this product."); });
    return () => { active = false; };
  }, [handle]);

  useEffect(() => {
    if (!product) return;
    setColor(colorOption(product)?.values[0]);
    setMat(product.options.find((o) => o.name !== colorOption(product)?.name)?.values[0]);
    setQty(1);
    setShot(0);
    setTab("Description");
    setNoted(false);
  }, [product]);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 580);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold">Piece not found</h1>
        <Btn to="/collections/all" className="mt-6">
          Back to the collection
        </Btn>
      </div>
    );
  }

  const variant = pickVariant(product, {
    ...(colors && color ? { [colors.name]: color } : {}),
    ...(other && mat ? { [other.name]: mat } : {}),
  });
  const images = product.images.length ? product.images : [variant.image || ""];
  const active = images[Math.min(shot, images.length - 1)];
  const coming = product.tags.includes("Coming Soon");
  const preorder = product.inventoryPolicy === "preorder";
  const sold = !preorder && (product.stock === 0 || product.handle === "victoria-ottoman" || !variant.available);
  const pct = discountPct(variant.price, variant.compare);
  const more = related(product, 4);
  const selectedOptions = product.options.map((option, index) => {
    const value = index === 0 ? variant.option1 : variant.option2;
    return value ? `${option.name}: ${value}` : null;
  }).filter((value): value is string => Boolean(value));

  return (
    <div className="mx-auto max-w-[1680px] px-4 py-8 sm:px-6 lg:px-10">
      {productError ? <p className="mb-3 text-sm text-[#666]">{productError} Showing the catalog currently available in this browser.</p> : null}
      <Crumbs items={[{ label: product.type, to: product.type === "Marble Products" ? "/pages/marble-products" : `/collections/${product.type === "Lamps" ? "lighting" : "all"}` }, { label: product.title }]} />
      <div className="grid gap-10 lg:grid-cols-2">
        <Gallery images={images} active={active} shot={shot} setShot={setShot} gallery={gallery} title={product.title} />
        <div className="lg:sticky lg:top-36 lg:self-start">
          <div className="flex items-start justify-between gap-4">
            <div>
              {pct > 0 ? <p className="text-sm font-bold text-[#c4301c]">Save {pct}%</p> : null}
              <h1 className="text-3xl font-bold sm:text-4xl">{product.title}</h1>
              <p className="mt-1 text-sm text-[#666]">
                Vendor: Cortex · Type: {product.type} · SKU: {product.sku}
              </p>
            </div>
            <button type="button" aria-label="Save" onClick={() => store.toggleWish(product.handle)} className={store.wished(product.handle) ? "text-[#c4301c]" : ""}>
              <Heart filled={store.wished(product.handle)} />
            </button>
          </div>
          {!preorder ? <div className="mt-3 flex items-center gap-3">
            <Stars value={product.rating} />
            <span className="text-sm text-[#666]">{product.rating} · {product.reviews} reviews</span>
          </div> : null}
          <div className="mt-4 text-2xl">
            <><Money amount={variant.price} compare={variant.compare} /><span className="ml-2 text-sm text-[#666]">{priceUnitLabel(product)}</span></>
          </div>
          {product.priceStatus === "estimated" ? <p className="mt-1 text-xs font-semibold text-[#8a5a00]">Estimated Cortex retail price · review pending</p> : null}
          {!preorder ? <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
            {["Modern", "Eco-certified", "Warranty"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ededed] text-[#1d349a]">✦</span>
                {t}
              </span>
            ))}
          </div> : null}
          {!preorder && product.stock > 0 && product.stock <= 5 && !coming ? (
            <p className="mt-4 text-sm font-bold text-[#c4301c]">Hurry up, only {product.stock} items left in stock.</p>
          ) : null}
          <p className="mt-3 text-sm text-[#444]">{product.desc}</p>
          {!preorder ? <p className="mt-3 rounded-2xl bg-[#f4f691] px-4 py-3 text-sm font-semibold">Limited offer: $20 off orders past $1,000 — applied automatically at checkout.</p> : null}

          {colors ? (
            <div className="mt-5">
              <p className="mb-2 text-sm font-bold">Color: {color}</p>
              <div className="flex flex-wrap gap-2">
                {colors.values.map((c) => (
                  <Swatch
                    key={c}
                    name={c}
                    active={color === c}
                    mode={swatch}
                    image={findVariant(product, c).image || product.images[0]}
                    onClick={() => {
                      setColor(c);
                      setShot(0);
                    }}
                  />
                ))}
              </div>
            </div>
          ) : null}
          {other ? (
            <div className="mt-4">
              <p className="mb-2 text-sm font-bold">{other.name}</p>
              <div className="flex flex-wrap gap-2">
                {other.values.map((m) => {
                  const v = findVariant(product, color, m);
                  const off = !v.available;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMat(m)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-semibold",
                        mat === m ? "border-black bg-black text-white" : "border-[#e5e5e5]",
                        off && "line-through opacity-50",
                      )}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {!preorder ? <div className="mt-5 rounded-2xl border border-[#eee] p-4 text-sm">
            <p className="font-bold">Volume pricing</p>
            <p className="text-[#666]">5+ save 5% · 10+ save 10% on this piece. Discount shows in the cart.</p>
          </div> : null}

          {preorder ? (
            <div className="mt-5 rounded-2xl bg-[#f6f6f6] p-4 text-sm text-[#444]">
              <p className="font-bold">Pre-order · supplier availability not yet confirmed</p>
              <p className="mt-1">Your payment uses this estimated Cortex price. We will confirm supply and delivery timing after checkout. If we cannot secure the selected configuration, we will cancel and refund the order.</p>
            </div>
          ) : coming || sold ? (
            <form
              className="mt-5"
              onSubmit={(e) => {
                e.preventDefault();
                setNoted(true);
              }}
            >
              <p className="mb-2 text-sm font-bold">{coming ? "Coming soon — get notified" : "Sold out — join the waitlist"}</p>
              {noted ? (
                <p className="text-sm font-semibold text-[#0d8756]">We’ll write when it’s back.</p>
              ) : (
                <div className="flex gap-2">
                  <input required type="email" value={notify} onChange={(e) => setNotify(e.target.value)} placeholder="Email" className="h-12 flex-1 rounded-full bg-[#ededed] px-4 outline-none" />
                  <Btn type="submit">Notify me</Btn>
                </div>
              )}
            </form>
          ) : (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Qty value={qty} onChange={setQty} label={product.title} />
              <Btn className="min-w-44" onClick={() => store.add(product.handle, variant.id, qty)}>
                Add to cart
              </Btn>
              <Btn variant="ghost" to="/checkout" onClick={() => store.add(product.handle, variant.id, qty)}>
                Buy now
              </Btn>
            </div>
          )}

          <ProductEnquiry productTitle={product.title} productUrl={window.location.href} selectedOptions={selectedOptions} />

          {!preorder ? <ul className="mt-5 space-y-1 text-sm text-[#444]">
            <li>Free international shipping over $500</li>
            <li>Free returns within 30 days</li>
            <li>In-store pickup from New York, Miami, and Los Angeles</li>
          </ul> : null}
          {!preorder ? <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setEta(zip ? `Arrives in 4–7 days to ${zip}` : "");
            }}
          >
            <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="Estimate delivery ZIP" className="h-11 flex-1 rounded-full bg-[#ededed] px-4 text-sm outline-none" />
            <button className="h-11 rounded-full bg-[#ededed] px-4 text-sm font-bold">Check</button>
          </form> : null}
          {eta ? <p className="mt-2 text-sm font-semibold">{eta}</p> : null}
          <div className="mt-4 flex gap-3 text-sm font-bold">
            {!preorder ? <button type="button" className="underline" onClick={() => store.toggleCompare(product.handle)}>
              {store.compare.includes(product.handle) ? "In compare" : "Add to compare"}
            </button> : null}
            {!preorder ? <Link to="/pages/find-a-store" className="underline">Find in store</Link> : null}
          </div>
        </div>
      </div>

      <div className="mt-14 border-t pt-8">
        <div className="flex gap-6 border-b">
          {(preorder ? ["Description", "Specifications"] : ["Description", "Specifications", "Shipping", "Reviews"]).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={cn("pb-3 text-sm font-bold", tab === t ? "border-b-2 border-black" : "text-[#888]")}>
              {t}
            </button>
          ))}
        </div>
        <div className="max-w-3xl py-6 text-sm leading-relaxed text-[#444]">
          {tab === "Description" ? <p>{product.desc}{!preorder ? " Designed to sit beside other Cortex pieces without matching them. The finish is meant to be lived with — a mark is a history, not a defect." : ""}</p> : null}
          {tab === "Specifications" ? (
            <table className="w-full text-left">
              <tbody>
                {[
                  ...(preorder ? [["Dimensions / listed range", product.dims], ["Availability", "Pre-order; supplier availability confirmed after checkout"]] : [
                    ["Brand", "Cortex"],
                    ["Origin", product.origin],
                    ["Dimensions", product.dims],
                    ["Seat height", product.seat],
                    ["Weight", product.weight],
                    ["SKU", product.sku],
                  ]),
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-[#eee]">
                    <th className="py-3 pr-4 font-bold text-black">{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
          {tab === "Shipping" ? (
            <p>Most in-stock pieces leave within 3–5 business days. Express is free over $500. White-glove delivery is available in New York, Miami, and Los Angeles. Large furniture ships in a recyclable crate.</p>
          ) : null}
          {tab === "Reviews" ? (
            <div className="space-y-4">
              {[
                ["Quiet and exact", "The proportions are better in the room than in the photograph. Sat in it for a week and it still looks new."],
                ["Worth the wait", "Delivery was careful. The oak has a warmth the swatch only hinted at."],
                ["Trade order", "We specified six for a project. Volume pricing was clear and the finish matched across the set."],
              ].map(([t, b]) => (
                <div key={t} className="rounded-2xl bg-[#f7f7f7] p-4">
                  <Stars value={5} />
                  <p className="mt-1 font-bold text-black">{t}</p>
                  <p>{b}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {!preorder ? <section className="mt-10 grid gap-6 rounded-3xl bg-[#f7f7f7] p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1d349a]">Craftsmanship</p>
          <h2 className="mt-2 text-3xl font-bold">Make it yours</h2>
          <p className="mt-2 text-sm text-[#555]">
            Personalize your furniture to match your unique style, with customizable options for colors, finishes, materials, and fabrics.
          </p>
          <div className="mt-6 space-y-4">
            {[
              ["01", "FSC & EU Ecolabel timber", "Responsibly harvested solid oak and ash kiln-dried for decades of stability."],
              ["02", "Architectural joinery", "Precision-milled hardware and concealed fasteners engineered for daily commercial & home use."],
              ["03", "Made to age gracefully", "Hand-rubbed oils, woven textiles, and powder-coated steel finished in small batches."],
            ].map(([num, h, body]) => (
              <div key={num} className="flex gap-4 rounded-2xl bg-white p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1d349a] text-xs font-bold text-white">
                  {num}
                </span>
                <div>
                  <p className="font-bold">{h}</p>
                  <p className="text-sm text-[#666]">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl">
          <img
            src={file("lookbook-slider-2-v2.jpg", 1200)}
            alt="Styled interior space"
            className="h-full max-h-[480px] w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </section> : null}

      <div className="mt-12">
        <h2 className="mb-5 text-2xl font-bold">You may also like</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {more.map((p) => (
            <ProductCard key={p.handle} product={p} swatch={swatch} />
          ))}
        </div>
      </div>

      {showSticky && !coming && !sold ? (
        <div
          className={cn(
            "fixed inset-x-0 z-30 border-t border-[#e5e5e5] bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur",
            store.compare.length > 0 ? "bottom-[68px]" : "bottom-0",
          )}
        >
          <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-4 sm:px-6 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={img(active, 120)}
                alt=""
                className="h-12 w-12 shrink-0 rounded-xl bg-[#f3f3f3] object-cover"
                referrerPolicy="no-referrer"
                onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/marble-product-placeholder.svg"; }}
              />
              <div className="min-w-0">
                <p className="truncate font-bold">{product.title}</p>
                <p className="truncate text-xs text-[#666]">{variant.title}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <Money amount={variant.price} compare={variant.compare} className="hidden sm:inline-flex" />
              <Btn className="h-10 px-5 text-sm" onClick={() => store.add(product.handle, variant.id, qty)}>
                Add to cart
              </Btn>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Gallery({
  images,
  active,
  shot,
  setShot,
  gallery,
  title,
}: {
  images: string[];
  active: string;
  shot: number;
  setShot: (n: number) => void;
  gallery: string;
  title: string;
}) {
  if (gallery === "grid") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {images.map((src, i) => (
          <img key={src + i} src={img(src, 900)} alt={title} className="aspect-square w-full rounded-2xl object-cover bg-[#f3f3f3]" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/marble-product-placeholder.svg"; }} />
        ))}
      </div>
    );
  }
  if (gallery === "mix") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <img src={img(images[0], 1000)} alt={title} className="col-span-2 aspect-[4/3] w-full rounded-2xl object-cover bg-[#f3f3f3]" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/marble-product-placeholder.svg"; }} />
        {images.slice(1).map((src, i) => (
          <img key={src + i} src={img(src, 700)} alt="" className="aspect-square w-full rounded-2xl object-cover bg-[#f3f3f3]" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/marble-product-placeholder.svg"; }} />
        ))}
      </div>
    );
  }
  const thumbs = (
    <div className={cn("flex gap-2", gallery === "vertical" ? "flex-col" : "mt-3 flex-row")}>
      {images.map((src, i) => (
        <button key={src + i} type="button" onClick={() => setShot(i)} className={cn("overflow-hidden rounded-xl bg-[#f3f3f3]", gallery === "vertical" ? "h-20 w-20" : "h-16 w-16", i === shot && "ring-2 ring-black")}>
          <img src={img(src, 160)} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/marble-product-placeholder.svg"; }} />
        </button>
      ))}
    </div>
  );
  return (
    <div className={cn(gallery === "vertical" && "flex gap-3")}>
      {gallery === "vertical" ? thumbs : null}
      <div className="relative min-w-0 flex-1 overflow-hidden rounded-3xl bg-[#f3f3f3]">
        <img src={img(active, 1400)} alt={title} className="aspect-square w-full object-cover" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/marble-product-placeholder.svg"; }} />
      </div>
      {gallery !== "vertical" ? thumbs : null}
    </div>
  );
}

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const type = params.get("type") || "All Categories";
  const { items: apiProducts, error: productError } = useApiProducts();
  const hits = apiProducts.filter((p) => {
    const okType = !type || type === "All Categories" || p.type === type;
    const okQ = !q || `${p.title} ${p.type} ${p.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase());
    return okType && okQ;
  });
  return (
    <div className="mx-auto max-w-[1680px] px-4 py-10 sm:px-6 lg:px-10">
      <h1 className="text-3xl font-bold">Search {q ? `“${q}”` : ""}</h1>
      <p className="mt-1 text-sm text-[#666]">{hits.length} results {type !== "All Categories" ? `in ${type}` : ""}</p>
      {productError ? <p className="mt-2 text-sm text-[#666]">{productError} Showing the catalog currently available in this browser.</p> : null}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {hits.map((p) => (
          <ProductCard key={p.handle} product={p} />
        ))}
      </div>
      {hits.length === 0 ? <p className="py-16 text-[#666]">Nothing matched. Try “chair”, “lamp”, or “table”.</p> : null}
    </div>
  );
}

export function CheckoutPage() {
  const s = useStore();
  const [placed, setPlaced] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [paymentChecked, setPaymentChecked] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    s.setCartOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * Paystack returns the customer to this route with a reference.
   * Never trust the URL alone: ask the backend to verify payment.
   */
  useEffect(() => {
    const reference =
      searchParams.get("reference") || searchParams.get("trxref");

    if (!reference || !s.token || paymentChecked) return;

    let active = true;

    setPaymentChecked(true);
    setVerifying(true);
    setError("");

    void api<{
      success: boolean;
      message: string;
      order: { orderNumber: string };
    }>(
      `/orders/verify/${encodeURIComponent(reference)}`,
      { token: s.token },
    )
      .then((result) => {
        if (!active) return;

        s.clearCart();
        setPlaced(result.order.orderNumber);

        // Remove payment parameters from the visible URL.
        window.history.replaceState(
          window.history.state,
          "",
          window.location.pathname + window.location.hash.split("?")[0],
        );
      })
      .catch((err) => {
        if (!active) return;

        setError(
          err instanceof ApiError
            ? err.message
            : "We could not verify your payment. Please check your order before trying again.",
        );
      })
      .finally(() => {
        if (active) setVerifying(false);
      });

    return () => {
      active = false;
    };
  }, [searchParams, s.token, paymentChecked]);

  const [ship, setShip] = useState(
    s.subtotal >= 500 ? "express" : "standard",
  );

  const shipping =
    ship === "express"
      ? s.subtotal >= 500
        ? 0
        : 45
      : ship === "pickup"
        ? 0
        : 29;

  const extra = s.subtotal >= 1000 ? 20 : 0;
  const due = Math.max(0, s.subtotal - s.discount - extra + shipping);

  if (verifying) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#1d349a]">
          Payment verification
        </p>
        <h1 className="mt-2 text-3xl font-bold">Confirming your payment</h1>
        <p className="mt-3 text-[#555]">
          Please wait while we verify your transaction with Paystack.
        </p>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#1d349a]">
          Order confirmed
        </p>
        <h1 className="mt-2 text-4xl font-bold">Thank you</h1>
        <p className="mt-3 text-[#555]">
          Order {placed} has been confirmed. Your payment was verified
          successfully.
        </p>
        <Btn to="/" className="mt-6">
          Back to Cortex
        </Btn>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-10 lg:grid-cols-[1.2fr_.8fr] sm:px-6">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();

          if (!s.token) {
            setError("Please sign in before placing your order.");
            return;
          }

          if (!s.cart.length) {
            setError("Your cart is empty.");
            return;
          }

          setSubmitting(true);
          setError("");

          const data = new FormData(e.currentTarget);

          try {
            const result = await api<{
              success: boolean;
              authorizationUrl: string;
              order: { orderNumber: string; total: number; currency: string };
            }>("/orders", {
              method: "POST",
              token: s.token,
              body: JSON.stringify({
                items: s.cart.map((line) => ({
                  handle: line.handle,
                  variantId: line.variantId,
                  qty: line.qty,
                })),
                discountCode: s.code,
                shippingMethod: ship,
                shippingAddress: {
                  email: data.get("email"),
                  firstName: data.get("first"),
                  lastName: data.get("last"),
                  address: data.get("address"),
                  city: data.get("city"),
                  region: data.get("region"),
                  zip: data.get("zip"),
                },
              }),
            });

            if (!result.authorizationUrl) {
              throw new Error("Paystack did not return a checkout URL.");
            }

            // Keep the cart until the backend verifies successful payment.
            window.location.assign(result.authorizationUrl);
          } catch (err) {
            setError(
              err instanceof ApiError
                ? err.message
                : err instanceof Error
                  ? err.message
                  : "Unable to start checkout. Please try again.",
            );
            setSubmitting(false);
          }
        }}
      >
        <h1 className="text-3xl font-bold">Checkout</h1>
        {s.cart.some((line) => getProduct(line.handle)?.inventoryPolicy === "preorder") ? <p className="rounded-2xl bg-[#f6f6f6] p-4 text-sm text-[#444]">This cart contains pre-order items priced using Cortex estimates. Supplier availability and delivery timing will be confirmed after payment. If we cannot secure an item, we will cancel it and refund its payment.</p> : null}

        <Field name="email" label="Email" type="email" />

        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="first" label="First name" />
          <Field name="last" label="Last name" />
        </div>

        <Field name="address" label="Address" />

        <div className="grid gap-3 sm:grid-cols-3">
          <Field name="city" label="City" />
          <Field name="region" label="State" />
          <Field name="zip" label="ZIP" />
        </div>

        <fieldset className="space-y-2 rounded-2xl border border-[#eee] p-4">
          <legend className="px-1 text-sm font-bold">Shipping</legend>

          {[
            ["standard", "Standard — $29"],
            [
              "express",
              s.subtotal >= 500
                ? "Express — Free over $500"
                : "Express — $45",
            ],
            ["pickup", "In-store pickup — Free"],
          ].map(([id, label]) => (
            <label
              key={id}
              className="flex items-center gap-2 text-sm"
            >
              <input
                type="radio"
                name="ship"
                checked={ship === id}
                onChange={() => setShip(id)}
              />
              {label}
            </label>
          ))}
        </fieldset>

        <fieldset className="space-y-2 rounded-2xl border border-[#eee] p-4">
          <legend className="px-1 text-sm font-bold">Payment</legend>
          <p className="text-sm text-[#555]">
            You'll be redirected to Paystack's secure checkout to complete
            your payment. Cortex does not collect or store your card
            details.
          </p>
          <p className="text-xs text-[#777]">
            Currency: USD. Payment availability depends on your Paystack
            account's currency permissions.
          </p>
        </fieldset>

        {error ? (
          <p className="text-sm font-semibold text-[#c4301c]" role="alert">
            {error}
          </p>
        ) : null}

        <Btn
          type="submit"
          className="w-full"
          disabled={s.cart.length === 0 || submitting || verifying}
        >
          {s.cart.length === 0
            ? "Cart is empty"
            : submitting
              ? "Connecting to Paystack..."
              : `Continue to payment $${due.toFixed(2)}`}
        </Btn>
      </form>

      <aside className="h-fit rounded-3xl bg-[#f7f7f7] p-5">
        {s.cart.map((line) => {
          const product = getProduct(line.handle);
          if (!product) return null;

          return (
            <div
              key={line.variantId}
              className="mb-3 flex items-center gap-3"
            >
              <img
                src={img(product.images[0], 120)}
                alt=""
                className="h-16 w-16 rounded-xl object-cover"
                referrerPolicy="no-referrer"
                onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/marble-product-placeholder.svg"; }}
              />

              <div className="flex-1 text-sm">
                <p className="font-bold">{product.title}</p>
                <p className="text-xs text-[#666]">{product.variants.find((variant) => variant.id === line.variantId)?.title}</p>
                <p className="text-[#666]">Qty {line.qty}{product.saleUnit && product.saleUnit !== "piece" ? ` ${product.saleUnit}` : ""}</p>
                {product.priceStatus === "estimated" ? <p className="text-xs text-[#8a5a00]">Estimated Cortex price</p> : null}
              </div>

              <Money
                amount={
                  (product.variants.find(
                    (variant) => variant.id === line.variantId,
                  )?.price ?? 0) * line.qty
                }
              />
            </div>
          );
        })}

        <div className="mt-4 space-y-1 border-t pt-3 text-sm">
          <Row k="Subtotal" v={<Money amount={s.subtotal} />} />

          {s.discount > 0 ? (
            <Row
              k="Discounts"
              v={<span>−${s.discount.toFixed(2)}</span>}
            />
          ) : null}

          {extra > 0 ? (
            <Row k="Order offer" v={<span>−$20.00</span>} />
          ) : null}

          <Row
            k="Shipping"
            v={<span>{shipping === 0 ? "Free" : `$${shipping}`}</span>}
          />

          <div className="flex justify-between pt-2 text-base font-bold">
            <span>Total</span>
            <span>${due.toFixed(2)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Field({ name, label, type = "text", placeholder }: { name: string; label: string; type?: string; placeholder?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-bold">{label}</span>
      <input required name={name} type={type} placeholder={placeholder} className="h-12 w-full rounded-2xl border border-[#e5e5e5] px-4 outline-none focus:border-black" />
    </label>
  );
}

function Row({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex justify-between">
      <span>{k}</span>
      <span>{v}</span>
    </div>
  );
}
