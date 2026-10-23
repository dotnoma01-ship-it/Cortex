import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  circleCats,
  file,
  getProduct,
  img,
  products,
  testimonials,
  type Product,
} from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Btn, Money } from "@/components/ui";
import { useStore } from "@/context/Store";

const picks = (handles: string[]) => handles.map((h) => getProduct(h)).filter((p): p is Product => Boolean(p));

export default function Home() {
  return (
    <div>
      <CircleRow />
      <Hero />
      <NewArrivals />
      <FlashSale />
      <Editorial />
      <ShopCats />
      <FeaturedCols />
      <Favorites />
      <Lookbook />
      <PromoPair />
      <IconRow />
      <Offers />
      <Team />
      <Quotes />
      <Deals />
      <Marquee />
      <Approach />
      <Gallery />
    </div>
  );
}

function CircleRow() {
  return (
    <section className="border-b border-[#f2f2f2]">
      <div className="hide-scroll mx-auto flex max-w-[1680px] gap-6 overflow-x-auto px-4 py-6 sm:px-6 lg:px-10">
        {circleCats.map((c) => (
          <Link key={c.title} to={c.to} className="group w-[92px] shrink-0 text-center">
            <span className="mx-auto block h-[84px] w-[84px] overflow-hidden rounded-full bg-[#f3f3f3] ring-1 ring-black/5">
              <img src={file(c.image, 300)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
            </span>
            <span className="mt-2 block text-[13px] font-bold leading-tight">{c.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Hero() {
  const slides = [
    {
      image: "slideshow-2_4b9bfed8-4c88-4c34-a970-423353d0b03e.jpg",
      kicker: "Modern Elegance",
      title: "Spoke Sofa",
      to: "/collections/sofas",
    },
    {
      image: "slideshow-3_a5017f29-7d75-4e6a-9052-3a6b84946846.jpg",
      kicker: "Contemporary Grace",
      title: "Dining & Kitchen",
      to: "/collections/dining-kitchen",
    },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % slides.length), 6500);
    return () => window.clearInterval(t);
  }, [slides.length]);
  const s = slides[i];
  return (
    <section className="relative h-[68vw] min-h-[420px] max-h-[720px] overflow-hidden bg-[#ece7df]">
      {slides.map((sl, idx) => (
        <img
          key={sl.title}
          src={file(sl.image, 2000)}
          alt=""
          referrerPolicy="no-referrer"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-[1680px] px-6 lg:px-16">
          <div className="max-w-xl text-black">
            <p className="text-sm font-bold sm:text-base">{s.kicker}</p>
            <h1 className="mt-2 text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-[88px]">{s.title}</h1>
            <Btn to={s.to} className="mt-6">
              Shop collection
            </Btn>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((sl, idx) => (
          <button key={sl.title} aria-label={sl.title} onClick={() => setI(idx)} className={`h-2.5 rounded-full transition-all ${idx === i ? "w-8 bg-black" : "w-2.5 bg-black/30"}`} />
        ))}
      </div>
      <button type="button" aria-label="Previous slide" className="absolute left-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90" onClick={() => setI((n) => (n + slides.length - 1) % slides.length)}>
        ‹
      </button>
      <button type="button" aria-label="Next slide" className="absolute right-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90" onClick={() => setI((n) => (n + 1) % slides.length)}>
        ›
      </button>
    </section>
  );
}

function NewArrivals() {
  const tabs = [
    { id: "new", label: "New Arrivals", handles: ["cross-chair-heritage", "ray-sofa-basic", "turn-chair-vivid", "loop-sofa-armrest"] },
    { id: "hot", label: "Hot Items", handles: ["arc-chair", "spoke-sofa-mix-copy", "halo-lamp", "dining-table-haven"] },
    { id: "promo", label: "Promotion", handles: ["swivel-table", "axis-storage-system", "task-chair-luxe", "bottle-grinder"] },
    { id: "stools", label: "Soft Stools", handles: ["plush-stool", "bar-stool-sand", "stride-stool", "bar-chair-ash"] },
    { id: "design", label: "Design", handles: ["grid-chair-frame", "arc-chair-dune", "pixel-shelves", "sculpt-table-lamp"] },
  ];
  const [tab, setTab] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === tab)!;
  const list = picks(current.handles);
  return (
    <section className="mx-auto max-w-[1680px] px-4 py-14 sm:px-6 lg:px-10">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold sm:text-4xl">New Arrivals</h2>
          <p className="mt-1 text-sm text-[#666]">Traditional divides between personal and professional space.</p>
        </div>
        <div className="hide-scroll flex gap-2 overflow-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`h-10 shrink-0 rounded-full px-4 text-sm font-bold ${tab === t.id ? "bg-black text-white" : "bg-[#ededed]"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Link to="/collections/new" className="relative hidden min-h-[420px] overflow-hidden rounded-3xl bg-[#f3f1ec] lg:block">
          <img src={file("collection-tabs-banner-1-v2.jpg", 800)} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-2xl font-bold">New Arrivals</p>
            <span className="mt-3 inline-flex h-10 items-center rounded-full bg-black px-5 text-sm font-bold text-white">Shop now</span>
          </div>
        </Link>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlashSale() {
  const [left, setLeft] = useState(calc());
  const [copied, setCopied] = useState(false);
  const store = useStore();
  useEffect(() => {
    const t = window.setInterval(() => setLeft(calc()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const parts = [
    ["Days", Math.floor(left / 86400)],
    ["Hours", Math.floor((left % 86400) / 3600)],
    ["Mins", Math.floor((left % 3600) / 60)],
    ["Secs", left % 60],
  ];
  return (
    <section className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-10">
      <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#f4f691] px-6 py-8 lg:flex-row lg:px-10">
        <div>
          <p className="text-lg font-bold">Flash Sale now on!</p>
          <p className="text-sm text-[#333]">Save on modern table office, best sellers + more</p>
        </div>
        <div className="flex gap-3">
          {parts.map(([label, n]) => (
            <div key={label as string} className="grid h-[72px] w-[68px] place-items-center rounded-2xl bg-white/70 text-center">
              <span className="text-2xl font-bold leading-none">{String(n).padStart(2, "0")}</span>
              <span className="text-[11px] font-semibold uppercase">{label}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="h-12 rounded-full bg-black px-6 text-sm font-bold text-white"
          onClick={() => {
            navigator.clipboard?.writeText("FLASH30").catch(() => {});
            store.applyCode("FLASH30");
            setCopied(true);
          }}
        >
          {copied ? "Copied" : "Use Code: FLASH30"}
        </button>
      </div>
    </section>
  );
}

function calc() {
  const end = new Date();
  end.setMonth(end.getMonth() + 1, 1);
  end.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((end.getTime() - Date.now()) / 1000));
}

function Editorial() {
  const cards = [
    { kicker: "Danish Design", title: "Material Natural", product: "grid-chair-frame", image: "card-image-1-v2.jpg", to: "/collections/chairs" },
    { kicker: "Cotton Collection", title: "Authority Design", product: "papilio-tea-towel-copy", image: "card-image-2-v2.jpg", to: "/collections/accessories" },
    { kicker: "Minimalism Style", title: "Steels Lighting", product: "sculpt-table-lamp", image: "card-image-3-v2.jpg", to: "/collections/lighting" },
    { kicker: "Danish Design", title: "Nightstand", product: "pixel-shelves", image: "card-image-4-v2.jpg", to: "/collections/storage" },
  ];
  return (
    <section className="mx-auto grid max-w-[1680px] gap-4 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
      {cards.map((c) => {
        const p = getProduct(c.product);
        return (
          <article key={c.title + c.kicker} className="overflow-hidden rounded-3xl bg-[#f6f6f6]">
            <Link to={c.to}>
              <img src={file(c.image, 800)} alt="" className="aspect-[4/5] w-full object-cover" referrerPolicy="no-referrer" />
            </Link>
            <div className="p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#888]">{c.kicker}</p>
              <h3 className="text-xl font-bold">{c.title}</h3>
              {p ? (
                <Link to={`/products/${p.handle}`} className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-2">
                  <img src={img(p.images[0], 120)} alt="" className="h-14 w-14 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <span>
                    <span className="block text-sm font-semibold">{p.title}</span>
                    <Money amount={p.variants[0].price} compare={p.variants[0].compare} className="text-sm" />
                  </span>
                </Link>
              ) : null}
              <Link to={c.to} className="mt-3 inline-block text-sm font-bold underline">
                Shop
              </Link>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function ShopCats() {
  return (
    <section className="mx-auto max-w-[1680px] px-4 pb-6 sm:px-6 lg:px-10">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-3xl font-bold sm:text-4xl">Shop By Categories</h2>
        <Link to="/collections/all" className="text-sm font-bold underline">
          Shop All Products
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {circleCats.map((c) => (
          <Link key={c.title} to={c.to} className="group">
            <span className="block overflow-hidden rounded-3xl bg-[#f3f3f3]">
              <img src={file(c.image, 500)} alt="" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
            </span>
            <span className="mt-2 block text-center text-sm font-bold">{c.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedCols() {
  const items = [
    {
      title: "Heritage Living",
      text: "With a shape inspired by the bollards used to secure vessels to a jetty.",
      image: "collection-tab-1-v2.jpg",
      to: "/collections/living-room",
    },
    {
      title: "The Haven Collection",
      text: "Anchored in design, inspired by the sturdy bollards that secure ships to docks.",
      image: "collection-tab-2-v2.jpg",
      to: "/collections/bed-room",
    },
    {
      title: "Solace Series",
      text: "Designed with a silhouette inspired by the crossbars that provide strength and stability.",
      image: "collection-tab-3-v2.jpg",
      to: "/collections/work-room",
    },
  ];
  return (
    <section className="mx-auto max-w-[1680px] px-4 py-14 sm:px-6 lg:px-10">
      <h2 className="mb-6 text-3xl font-bold sm:text-4xl">Featured Collections</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        {items.map((it) => (
          <Link key={it.title} to={it.to} className="group relative min-h-[420px] overflow-hidden rounded-3xl">
            <img src={file(it.image, 1000)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <h3 className="text-2xl font-bold">{it.title}</h3>
              <p className="mt-1 max-w-sm text-sm text-white/90">{it.text}</p>
              <span className="mt-4 inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-bold text-black">Shop Collection</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Favorites() {
  const cards = [
    { image: "favorite-prd-1-v2.jpg", handle: "turn-chair-vivid" },
    { image: "favorite-prd-2-v2.jpg", handle: "highline-table" },
    { image: "favorite-prd-3_25a13224-385b-469f-b6a9-e3d4245c7da0.jpg", handle: "cross-chair-walnut" },
  ];
  const [i, setI] = useState(0);
  const quotes = testimonials.slice(0, 3);
  const q = quotes[i % quotes.length];
  return (
    <section className="bg-[#f7f7f7] py-14">
      <div className="mx-auto grid max-w-[1680px] items-center gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <h2 className="text-3xl font-bold sm:text-4xl">Our Favorite Products</h2>
          <blockquote className="mt-6 text-xl font-medium leading-snug">“{q.quote}”</blockquote>
          <p className="mt-4 font-bold">{q.name}</p>
          <p className="text-sm text-[#666]">{q.place}</p>
          <div className="mt-5 flex gap-2">
            {quotes.map((_, idx) => (
              <button key={idx} aria-label={`Quote ${idx + 1}`} onClick={() => setI(idx)} className={`h-2.5 rounded-full ${idx === i ? "w-7 bg-black" : "w-2.5 bg-black/25"}`} />
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((c) => {
            const p = getProduct(c.handle);
            return (
              <div key={c.handle} className="relative overflow-hidden rounded-3xl">
                <img src={file(c.image, 700)} alt="" className="aspect-[3/4] w-full object-cover" referrerPolicy="no-referrer" />
                {p ? (
                  <Link to={`/products/${p.handle}`} className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-2xl bg-white p-2 shadow-lg">
                    <img src={img(p.images[0], 120)} alt="" className="h-12 w-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{p.title}</span>
                      <Money amount={p.variants[0].price} compare={p.variants[0].compare} className="text-sm" />
                    </span>
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Lookbook() {
  const slides = [
    { image: "lookbook-slider-1-v2.jpg", handles: ["loop-sofa-armrest", "flip-table-lamp", "swivel-table"] },
    { image: "lookbook-slider-2-v2.jpg", handles: ["arc-chair", "arc-chair-dune", "bar-chair-ash"] },
    { image: "lookbook-slider-3-v2.jpg", handles: ["nook-table", "swivel-table", "swing-wall-lamp"] },
    { image: "lookbook-slider-5-v2.jpg", handles: ["ray-table-lamp-1", "arc-rack-shelf", "axis-storage-system"] },
    { image: "lookbook-slider-6-v2.jpg", handles: ["arc-chair", "arc-chair-dune", "swivel-table"] },
  ];
  const [i, setI] = useState(0);
  const [pin, setPin] = useState(0);
  const store = useStore();
  const s = slides[i];
  const list = picks(s.handles);
  return (
    <section className="mx-auto max-w-[1680px] px-4 py-14 sm:px-6 lg:px-10">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-3xl font-bold sm:text-4xl">Get Inspired by Spaces</h2>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous look"
            className="grid h-10 w-10 place-items-center rounded-full bg-[#ededed] transition hover:bg-black hover:text-white"
            onClick={() => {
              setI((n) => (n + slides.length - 1) % slides.length);
              setPin(0);
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next look"
            className="grid h-10 w-10 place-items-center rounded-full bg-black text-white transition hover:bg-[#1d349a]"
            onClick={() => {
              setI((n) => (n + 1) % slides.length);
              setPin(0);
            }}
          >
            ›
          </button>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-3xl">
        <div className="relative overflow-hidden rounded-3xl">
          <img src={file(s.image, 1800)} alt="Styled room" className="max-h-[640px] w-full object-cover" referrerPolicy="no-referrer" />
          {[18, 44, 68].map((left, idx) => (
            <button
              key={left}
              type="button"
              aria-label={`Select look item ${idx + 1}`}
              onClick={() => setPin(idx)}
              className={`absolute grid h-9 w-9 place-items-center rounded-full text-sm font-bold shadow-lg transition ${
                pin === idx ? "scale-110 bg-[#1d349a] text-white ring-4 ring-white/70" : "bg-white text-black hover:scale-105"
              }`}
              style={{ left: `${left}%`, top: `${32 + idx * 14}%` }}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        <div className="mt-3 w-full rounded-3xl bg-white p-4 shadow-xl lg:absolute lg:bottom-4 lg:right-4 lg:mt-0 lg:w-[min(100%-2rem,350px)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">{list.length} · Shop this look</p>
            <span className="text-xs text-[#666]">Slide {i + 1}/{slides.length}</span>
          </div>
          <ul className="mt-3 space-y-2.5">
            {list.map((p, idx) => (
              <li
                key={p.handle + idx}
                className={`rounded-2xl p-1.5 transition ${pin === idx ? "bg-[#f3f5ff] ring-1 ring-[#1d349a]/30" : "hover:bg-[#f7f7f7]"}`}
                onMouseEnter={() => setPin(idx)}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#ededed] text-xs font-bold">
                    {idx + 1}
                  </span>
                  <Link to={`/products/${p.handle}`} className="flex min-w-0 flex-1 items-center gap-3">
                    <img src={img(p.images[0], 140)} alt="" className="h-13 w-13 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{p.title}</span>
                      <Money amount={p.variants[0].price} compare={p.variants[0].compare} className="text-sm" />
                    </span>
                  </Link>
                  <button
                    type="button"
                    aria-label={`Add ${p.title} to cart`}
                    onClick={() => store.add(p.handle, p.variants[0].id, 1)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black text-xs font-bold text-white hover:bg-[#1d349a]"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => list.forEach((p) => store.add(p.handle, p.variants[0].id, 1))}
            className="mt-3 h-10 w-full rounded-full bg-black text-xs font-bold text-white transition hover:bg-[#1d349a]"
          >
            Add look to cart
          </button>
        </div>
      </div>
    </section>
  );
}

function PromoPair() {
  const items = [
    { image: "home-banner-01.webp", kicker: "Save 40%", title: "Turn Chairs", text: "Elevate your space with 40% off our timeless designs!", to: "/collections/turn-chairs" },
    { image: "home-banner-02.webp", kicker: "Save 30%", title: "Cross Chairs", text: "Get 30% off elegant, timeless seating—don’t miss out!", to: "/collections/bow-chairs" },
  ];
  return (
    <section className="mx-auto grid max-w-[1680px] gap-4 px-4 sm:px-6 lg:grid-cols-2 lg:px-10">
      {items.map((it) => (
        <Link key={it.title} to={it.to} className="relative min-h-[320px] overflow-hidden rounded-3xl">
          <img src={file(it.image, 1200)} alt="" className="absolute inset-0 h-full w-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="relative max-w-sm p-8 text-white">
            <p className="text-sm font-bold">{it.kicker}</p>
            <h3 className="text-4xl font-bold">{it.title}</h3>
            <p className="mt-2 text-sm text-white/90">{it.text}</p>
            <span className="mt-5 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-bold text-black">Shop Now</span>
          </div>
        </Link>
      ))}
    </section>
  );
}

function IconRow() {
  const items = [
    ["Living Room", "/collections/living-room", "collection-tab-1-v2.jpg"],
    ["Planters", "/collections/outdoor", "collection-slider-2.jpg"],
    ["Gravel Rug", "/products/gravel-rug-copy", "collection-slider-10.jpg"],
    ["Table Mirror", "/collections/accessories", "collection-slider-7.jpg"],
    ["Dining Decor", "/collections/dining-kitchen", "slideshow-3_a5017f29-7d75-4e6a-9052-3a6b84946846.jpg"],
    ["Ray Table Lamp", "/products/ray-table-lamp-1", "collection-slider-2.jpg"],
    ["Chairs", "/collections/chairs", "collection-slider-6.jpg"],
  ];
  return (
    <section className="hide-scroll mx-auto flex max-w-[1680px] gap-8 overflow-auto px-4 py-12 sm:px-6 lg:justify-center lg:px-10">
      {items.map(([label, to, image]) => (
        <Link key={label} to={to} className="w-24 shrink-0 text-center">
          <span className="mx-auto block h-20 w-20 overflow-hidden rounded-full bg-[#f3f3f3]">
            <img src={file(image, 240)} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </span>
          <span className="mt-2 block text-xs font-bold">{label}</span>
        </Link>
      ))}
    </section>
  );
}

function Offers() {
  const list = picks(["cross-table-bark", "axis-storage-system", "task-chair-luxe", "cross-chair-heritage", "plush-stool", "bottle-grinder"]);
  return (
    <section className="mx-auto max-w-[1680px] px-4 pb-8 sm:px-6 lg:px-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold sm:text-4xl">Shop Our Offers</h2>
          <p className="text-sm text-[#666]">Traditional divides between personal and professional space.</p>
        </div>
        <Link to="/collections/sale-items" className="text-sm font-bold underline">
          Shop All Products
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {list.map((p) => (
          <ProductCard key={p.handle} product={p} />
        ))}
      </div>
    </section>
  );
}

function Team() {
  return (
    <section className="mx-auto grid max-w-[1680px] items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-10">
      <div className="relative">
        <img src={file("home-iwt_1-v2.jpg", 1400)} alt="Cortex studio interior" className="w-full rounded-3xl object-cover" referrerPolicy="no-referrer" />
        <img src={file("iwt-badge.png", 320)} alt="Cortex — where design meets function" className="absolute -bottom-6 left-6 w-36 sm:w-44" referrerPolicy="no-referrer" />
      </div>
      <div className="lg:pl-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1d349a]">Meet Our Team</p>
        <h2 className="mt-2 text-4xl font-bold leading-tight">The creative minds behind our studio</h2>
        <p className="mt-4 max-w-lg text-[#555]">
          As designers we are constantly thinking about how people live and what problems we could solve for them.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Product locally in New York", "Studio"],
            ["4,8 Review Score", "Loved"],
            ["Over 50 Products", "Collection"],
          ].map(([t, k]) => (
            <div key={t} className="rounded-2xl bg-[#f6f6f6] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#1d349a]">{k}</p>
              <p className="mt-1 font-bold leading-snug">{t}</p>
            </div>
          ))}
        </div>
        <Btn to="/pages/contact" className="mt-8">
          Contact Us
        </Btn>
      </div>
    </section>
  );
}

function Quotes() {
  const list = testimonials.slice(3);
  return (
    <section className="bg-[#f7f7f7] py-16">
      <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-10">
        <h2 className="mb-8 text-3xl font-bold sm:text-4xl">What Clients Talk About Us</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {list.map((t) => (
            <figure key={t.name + t.place} className="rounded-3xl bg-white p-6">
              <div className="text-[#1d349a]">★★★★★</div>
              <blockquote className="mt-3 text-lg font-medium leading-snug">“{t.quote}”</blockquote>
              <figcaption className="mt-5">
                <p className="font-bold">{t.name}</p>
                <p className="text-sm text-[#666]">{t.place}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Deals() {
  const slides = [
    { kicker: "Hot Deals", title: "The Bow Chairs Under $200", text: "Introducing the latest styles in seating tailored for every occasion and taste.", image: "slider-w-multi-slide1-v2.jpg", to: "/collections/bow-chairs" },
    { kicker: "Dining & Kitchen", title: "Difference in the Details", text: "Highlighting the unique touches that set every piece apart, crafted to elevate your space.", image: "slider-w-multi-slide2-v2.jpg", to: "/collections/dining-kitchen" },
  ];
  const tiles = [
    { title: "Select Table Lamps", text: "Get up to $100 Off", image: "slider-w-multi-col1-v2.jpg", to: "/collections/lighting" },
    { title: "Select Lounge Chairs", text: "From $200", image: "slider-w-multi-col2-v2.jpg", to: "/collections/bend-chairs" },
    { title: "Select Side tables", text: "Get up to $1,000", image: "slider-w-multi-col3-v2.jpg", to: "/collections/tables" },
    { title: "Select Home Decors", text: "Buy One Get One", image: "slider-w-multi-col4-v2.jpg", to: "/collections/accessories" },
  ];
  const [i, setI] = useState(0);
  const s = slides[i];
  return (
    <section className="mx-auto grid max-w-[1680px] gap-4 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-10">
      <div className="relative min-h-[460px] overflow-hidden rounded-3xl">
        <img src={file(s.image, 1200)} alt="" className="absolute inset-0 h-full w-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-white">
          <p className="text-sm font-bold">{s.kicker}</p>
          <h3 className="max-w-md text-4xl font-bold leading-tight">{s.title}</h3>
          <p className="mt-2 max-w-md text-sm text-white/90">{s.text}</p>
          <Btn to={s.to} variant="light" className="mt-5">
            Shop Now
          </Btn>
        </div>
        <div className="absolute right-4 top-4 flex gap-2">
          {slides.map((_, idx) => (
            <button key={idx} aria-label={`Deal ${idx + 1}`} onClick={() => setI(idx)} className={`h-2.5 rounded-full ${idx === i ? "w-7 bg-white" : "w-2.5 bg-white/60"}`} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {tiles.map((t) => (
          <Link key={t.title} to={t.to} className="relative min-h-[220px] overflow-hidden rounded-3xl">
            <img src={file(t.image, 700)} alt="" className="absolute inset-0 h-full w-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/25" />
            <div className="relative p-5 text-white">
              <p className="text-lg font-bold leading-tight">{t.title}</p>
              <p className="text-sm">{t.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Marquee() {
  const text = ["Lounge Chairs", "Bow Chairs", "Cross Chair", "Spoke Sofa", "Arc Lamp", "Cortex Studio"];
  const row = [...text, ...text, ...text, ...text];
  return (
    <div className="overflow-hidden bg-[#1d349a] py-4 text-white">
      <div className="marquee-track flex w-max gap-10 text-lg font-bold">
        {[0, 1].map((k) => (
          <div key={k} className="flex gap-10 pr-10">
            {row.map((t, i) => (
              <span key={k + t + i} className="flex items-center gap-10">
                {t} <span className="text-[#f4f691]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Approach() {
  const cols = [
    { image: "multicolumn-1-v2.jpg", title: "Comfortable", text: "Bow Chair is available in Natural or Black-stained Oak with full EU Ecolabel certification." },
    { image: "multicolumn-2-v2.jpg", title: "Price transparency", text: "Fair pricing ensures you know exactly what you’re paying for, with no hidden costs or markups." },
    { image: "multicolumn-3-v2.jpg", title: "All eco-certified", text: "All products consider a more holistic environmental impact and are designed for a longer lifetime." },
    { image: "multicolumn-4-v2.jpg", title: "Sustainability", text: "Committed to sustainable practices, ethical sourcing, and reducing environmental impact." },
  ];
  return (
    <section className="mx-auto max-w-[1680px] px-4 py-16 sm:px-6 lg:px-10">
      <h2 className="mb-8 max-w-xl text-3xl font-bold sm:text-4xl">This approach resulted in the beautiful structure</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cols.map((c) => (
          <article key={c.title}>
            <img src={file(c.image, 700)} alt="" className="aspect-[4/5] w-full rounded-3xl object-cover" referrerPolicy="no-referrer" />
            <h3 className="mt-3 text-lg font-bold">{c.title}</h3>
            <p className="text-sm text-[#555]">{c.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Gallery() {
  const shots = [
    ["instagram-5-v2.jpg", "@north.room"],
    ["instagram-7-v2.jpg", "@studio.edit"],
    ["instagram-2-v2.jpg", "@Cortex.home"],
    ["instagram-3-v2.jpg", "@linen.days"],
    ["instagram-4-v2.jpg", "@slow.objects"],
    ["instagram-6-v2.jpg", "@arc.living"],
  ];
  return (
    <section className="pb-16">
      <div className="mb-5 px-4 text-center sm:px-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1d349a]">Follow along</p>
        <h2 className="text-3xl font-bold">@Cortex</h2>
      </div>
      <div className="hide-scroll flex gap-3 overflow-auto px-4">
        {shots.map(([image, user]) => (
          <a key={image} href="#" onClick={(e) => e.preventDefault()} className="group relative w-[240px] shrink-0 overflow-hidden rounded-2xl sm:w-[280px]">
            <img src={file(image, 600)} alt="" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
            <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold">{user}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export const featuredHandles = products.slice(0, 4).map((p) => p.handle);
