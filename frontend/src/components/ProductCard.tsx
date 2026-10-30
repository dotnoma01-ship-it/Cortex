import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  badges,
  colorOption,
  findVariant,
  img,
  priceRange,
  priceUnitLabel,
  type Product,
} from "@/data/catalog";
import { useStore } from "@/context/Store";
import { Heart, Money, Swatch } from "./ui";
import { cn } from "@/utils/cn";

export function ProductCard({
  product,
  layout = "grid",
  swatch = "color",
}: {
  product: Product;
  layout?: "grid" | "list";
  swatch?: "color" | "image";
}) {
  const { add, toggleWish, wished, toggleCompare, compare, setQuick } = useStore();
  const nav = useNavigate();
  const [hover, setHover] = useState(false);
  const colors = colorOption(product);
  const [color, setColor] = useState(colors?.values[0]);
  const variant = findVariant(product, color);
  const range = priceRange(product);
  const shot = variant.image || product.images[0];
  const alt = product.images.find((i) => i !== shot) || product.images[1];
  const marks = badges(product);
  const preorder = product.inventoryPolicy === "preorder";
  const coming = product.tags.includes("Coming Soon") || (!preorder && product.stock === 0);
  const saved = wished(product.handle);
  const compared = compare.includes(product.handle);

  const choose = () => {
    if (coming) {
      nav(`/products/${product.handle}`);
      return;
    }
    if ((product.options[0]?.values.length ?? 0) > 1) setQuick(product.handle);
    else add(product.handle, variant.id, 1);
  };

  return (
    <article
      className={cn("group", layout === "list" && "grid grid-cols-[180px_1fr] gap-5 sm:grid-cols-[240px_1fr]")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#f3f3f3]">
        <Link to={`/products/${product.handle}`} className="block aspect-square">
          <img
            src={img(shot, 800)}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/marble-product-placeholder.svg"; }}
            className={cn(
              "h-full w-full object-cover transition duration-500",
              hover && alt ? "opacity-0" : "opacity-100",
              hover && "scale-[1.03]",
            )}
          />
          {alt ? (
            <img
              src={img(alt, 800)}
              alt=""
              referrerPolicy="no-referrer"
              onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/marble-product-placeholder.svg"; }}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition duration-500",
                hover ? "opacity-100" : "opacity-0",
              )}
            />
          ) : null}
        </Link>
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {marks.map((b) => (
            <span
              key={b.label}
              className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
              style={{ background: b.bg }}
            >
              {b.label}
            </span>
          ))}
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            aria-label="Quick view"
            onClick={() => setQuick(product.handle)}
            className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Wishlist"
            onClick={() => toggleWish(product.handle)}
            className={cn("grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm", saved && "text-[#c4301c]")}
          >
            <Heart filled={saved} />
          </button>
        </div>
        <label className="absolute bottom-3 left-3 z-10 flex cursor-pointer items-center gap-2 rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-semibold shadow-sm transition-transform duration-300 group-hover:-translate-y-12">
          <input
            type="checkbox"
            checked={compared}
            onChange={() => toggleCompare(product.handle)}
            className="accent-black"
          />
          Compare
        </label>
        <button
          type="button"
          onClick={choose}
          className="pointer-events-none absolute inset-x-3 bottom-3 h-11 translate-y-3 rounded-full bg-black text-sm font-bold text-white opacity-0 transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100"
        >
          {coming ? "View product" : product.variants.length > 1 ? "Choose options" : "Add to cart"}
        </button>
      </div>
      <div className={cn("pt-3", layout === "list" && "flex flex-col justify-center pt-0")}>
        <p className="text-[12px] font-semibold uppercase tracking-wide text-[#888]">{product.type}</p>
        <Link to={`/products/${product.handle}`} className="mt-0.5 line-clamp-2 min-h-[2.75rem] block font-semibold leading-snug hover:underline">
          {product.title}
        </Link>
        <div className="mt-1">
          {product.priceStatus === "estimated" ? <span className="text-sm font-semibold">Price on enquiry</span> : <><Money amount={range.min} compare={!range.from ? range.compare : null} /><span className="ml-1 text-[12px] text-[#666]">{priceUnitLabel(product)}</span>{range.from ? <span className="ml-1 text-[13px] text-[#666]">from</span> : null}</>}
        </div>
        {product.priceStatus === "estimated" ? <p className="mt-0.5 text-[11px] font-semibold text-[#8a5a00]">Retail price not approved · checkout unavailable</p> : null}
        {colors && colors.values.length > 0 ? (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {colors.values.slice(0, 5).map((c) => {
              const v = findVariant(product, c);
              return (
                <Swatch
                  key={c}
                  name={c}
                  active={color === c}
                  mode={swatch}
                  image={v.image || product.images[0]}
                  onClick={() => setColor(c)}
                />
              );
            })}
            {colors.values.length > 5 ? (
              <span className="text-xs text-[#666]">+{colors.values.length - 5}</span>
            ) : null}
          </div>
        ) : null}
        {layout === "list" ? (
          <p className="mt-3 max-w-xl text-sm text-[#666]">{product.desc}</p>
        ) : null}
      </div>
    </article>
  );
}
