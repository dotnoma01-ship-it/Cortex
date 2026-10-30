import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { COLORS, formatMoney, img } from "@/data/catalog";
import { useStore } from "@/context/Store";

export function Money({
  amount,
  className,
  compare,
}: {
  amount: number;
  className?: string;
  compare?: number | null;
}) {
  const { currency } = useStore();
  const sale = compare && compare > amount;
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={cn("font-bold", sale && "text-[#c4301c]")}>{formatMoney(amount, currency)}</span>
      {sale ? (
        <span className="text-[13px] font-medium text-[#999] line-through">
          {formatMoney(compare!, currency)}
        </span>
      ) : null}
    </span>
  );
}

export function Btn({
  children,
  className,
  to,
  onClick,
  type = "button",
  disabled,
  variant = "primary",
}: {
  children: ReactNode;
  className?: string;
  to?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "ghost" | "light";
}) {
  const cls = cn(
    "inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-bold capitalize transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" && "bg-black text-white hover:bg-[#1d349a]",
    variant === "light" && "bg-white text-black hover:bg-black hover:text-white",
    variant === "ghost" && "bg-[#ededed] text-black hover:bg-black hover:text-white",
    className,
  );
  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" className={i < Math.round(value) ? "text-[#1d349a]" : "text-[#ddd]"}>
          <path
            fill="currentColor"
            d="M10 1.5l2.4 5.2 5.7.7-4.2 3.9 1.1 5.6L10 14.2 4.9 16.9l1.1-5.6L1.8 7.4l5.7-.7L10 1.5z"
          />
        </svg>
      ))}
    </span>
  );
}

export function Crumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-[13px] text-[#666]">
      <Link to="/" className="rev">
        Home
      </Link>
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-2">
          <span>/</span>
          {it.to ? (
            <Link to={it.to} className="rev">
              {it.label}
            </Link>
          ) : (
            <span className="text-black">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Qty({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  label?: string;
}) {
  return (
    <div className="inline-flex h-12 items-center rounded-full border border-[#e5e5e5]">
      <button
        type="button"
        aria-label={`Decrease quantity${label ? ` for ${label}` : ""}`}
        className="h-full w-11 text-lg"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-bold">{value}</span>
      <button
        type="button"
        aria-label={`Increase quantity${label ? ` for ${label}` : ""}`}
        className="h-full w-11 text-lg"
        onClick={() => onChange(Math.min(100, value + 1))}
      >
        +
      </button>
    </div>
  );
}

export function IconBtn({
  label,
  onClick,
  children,
  className,
  active,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full transition hover:bg-[#ededed]",
        active && "text-[#c4301c]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Heart({ filled }: { filled?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7">
      <path d="M12 20s-7-4.4-7-9.1C5 8 6.8 6.2 9.1 6.2c1.3 0 2.4.6 2.9 1.6.5-1 1.6-1.6 2.9-1.6C17.2 6.2 19 8 19 10.9 19 15.6 12 20 12 20z" />
    </svg>
  );
}

export function Bag() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M6 8h12l-1 13H7L6 8z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l5 5" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19.2c1.4-3 3.8-4.4 7-4.4s5.6 1.4 7 4.4" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function Caret({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 8l5 5 5-5" />
    </svg>
  );
}

export function Swatch({
  name,
  active,
  onClick,
  image,
  mode = "color",
}: {
  name: string;
  active?: boolean;
  onClick?: () => void;
  image?: string | null;
  mode?: "color" | "image";
}) {
  return (
    <button
      type="button"
      title={name}
      aria-label={name}
      onClick={onClick}
      className={cn(
        "relative h-6 w-6 overflow-hidden rounded-full border ring-2 ring-offset-2",
        active ? "border-black ring-black" : "border-black/10 ring-transparent",
      )}
      style={mode === "color" || !image ? { background: COLORS[name] || "#ddd" } : undefined}
    >
      {mode === "image" && image ? (
        <img src={img(image, 80)} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
      ) : null}
    </button>
  );
}

export function Social({ light }: { light?: boolean }) {
  const cls = light ? "text-white/90 hover:text-white" : "text-black hover:text-[#1d349a]";
  const items = [
    { name: "Facebook", d: "M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.2l.8-3H13V9c0-.6.4-1 1-1z" },
    { name: "X", d: "M6 6l12 12M18 6L6 18" },
    { name: "Instagram", d: "M8 4h8a4 4 0 014 4v8a4 4 0 01-4 4H8a4 4 0 01-4-4V8a4 4 0 014-4zm8 2.2a1 1 0 100 2 1 1 0 000-2zM12 9a3 3 0 100 6 3 3 0 000-6z" },
    { name: "TikTok", d: "M14 6c.6 2.2 2 3.6 4 4v2.2c-1.4 0-2.7-.4-4-1.2v5.4a5 5 0 11-5-5c.3 0 .6 0 .9.1v2.3A2.7 2.7 0 1012 16V6h2z" },
    { name: "YouTube", d: "M5 8.5A2.5 2.5 0 017.5 6h9A2.5 2.5 0 0119 8.5v7a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 015 15.5v-7zM11 9.5v5l4-2.5-4-2.5z" },
  ];
  return (
    <div className="flex items-center gap-3">
      {items.map((it) => (
        <a key={it.name} href="#" aria-label={it.name} className={cls} onClick={(e) => e.preventDefault()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d={it.d} />
          </svg>
        </a>
      ))}
    </div>
  );
}
