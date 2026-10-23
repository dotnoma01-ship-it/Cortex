import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct, type Product } from "@/data/catalog";
import { api } from "@/lib/api";

export type CartLine = { handle: string; variantId: number; qty: number };

type Persisted = {
  cart: CartLine[];
  wishlist: string[];
  compare: string[];
  currency: string;
  code: string | null;
  user: { name: string; email: string; role?: string } | null;
  token?: string | null;
};

type Store = Persisted & {
  cartOpen: boolean;
  searchOpen: boolean;
  quick: string | null;
  menuOpen: boolean;
  toast: string | null;
  offersOpen: boolean;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setQuick: (h: string | null) => void;
  setMenuOpen: (v: boolean) => void;
  setOffersOpen: (v: boolean) => void;
  setCurrency: (c: string) => void;
  notify: (m: string) => void;
  add: (handle: string, variantId: number, qty?: number) => void;
  setQty: (variantId: number, qty: number) => void;
  remove: (variantId: number) => void;
  clearCart: () => void;
  toggleWish: (handle: string) => void;
  wished: (handle: string) => boolean;
  toggleCompare: (handle: string) => void;
  clearCompare: () => void;
  applyCode: (code: string) => boolean;
  clearCode: () => void;
  signIn: (name: string, email: string, token?: string, role?: string) => void;
  signOut: () => void;
  count: number;
  subtotal: number;
  discount: number;
  total: number;
};

const KEY = "garace-hyper-v1";
const Ctx = createContext<Store | null>(null);

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Persisted;
      return {
        cart: p.cart ?? [],
        wishlist: p.wishlist ?? [],
        compare: p.compare ?? [],
        currency: p.currency ?? "USD",
        code: p.code ?? null,
        user: p.user ?? null,
        token: p.token ?? null,
      };
    }
  } catch {
    /* ignore */
  }
  return { cart: [], wishlist: [], compare: [], currency: "USD", code: null, user: null, token: null };
}

export function linePrice(line: CartLine) {
  const p = getProduct(line.handle);
  const v = p?.variants.find((x) => x.id === line.variantId) ?? p?.variants[0];
  return v ? v.price * line.qty : 0;
}

export function volumeRate(qty: number) {
  if (qty >= 10) return 0.1;
  if (qty >= 5) return 0.05;
  return 0;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<Persisted>(load);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quick, setQuick] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [offersOpen, setOffersOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(persisted));
  }, [persisted]);

  useEffect(() => {
    if (!persisted.token) return;
    void api("/store/cart", { method: "PUT", token: persisted.token, body: JSON.stringify({ items: persisted.cart.map((line) => ({ handle: line.handle, variantId: line.variantId, qty: line.qty })) }) }).catch(() => undefined);
  }, [persisted.cart, persisted.token]);

  useEffect(() => {
    if (!persisted.token) return;
    void api("/store/wishlist", { method: "PUT", token: persisted.token, body: JSON.stringify({ handles: persisted.wishlist }) }).catch(() => undefined);
  }, [persisted.wishlist, persisted.token]);

  const notify = useCallback((m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const add = useCallback(
    (handle: string, variantId: number, qty = 1) => {
      const p = getProduct(handle);
      const v = p?.variants.find((x) => x.id === variantId);
      if (!p || !v || !v.available || p.tags.includes("Coming Soon") || p.stock === 0) {
        notify("This piece is not available to add right now.");
        return;
      }
      setPersisted((s) => {
        const i = s.cart.findIndex((l) => l.variantId === variantId);
        const cart = [...s.cart];
        if (i >= 0) cart[i] = { ...cart[i], qty: cart[i].qty + qty };
        else cart.push({ handle, variantId, qty });
        return { ...s, cart };
      });
      setCartOpen(true);
      notify(`${p.title} added to cart`);
    },
    [notify],
  );

  const setQty = useCallback((variantId: number, qty: number) => {
    setPersisted((s) => ({
      ...s,
      cart:
        qty <= 0
          ? s.cart.filter((l) => l.variantId !== variantId)
          : s.cart.map((l) => (l.variantId === variantId ? { ...l, qty } : l)),
    }));
  }, []);

  const remove = useCallback((variantId: number) => setQty(variantId, 0), [setQty]);
  const clearCart = useCallback(() => setPersisted((s) => ({ ...s, cart: [], code: null })), []);

  const toggleWish = useCallback(
    (handle: string) => {
      setPersisted((s) => {
        const has = s.wishlist.includes(handle);
        return {
          ...s,
          wishlist: has ? s.wishlist.filter((h) => h !== handle) : [...s.wishlist, handle],
        };
      });
      const p = getProduct(handle);
      notify(
        persisted.wishlist.includes(handle)
          ? "Removed from wishlist"
          : `${p?.title ?? "Piece"} saved`,
      );
    },
    [notify, persisted.wishlist],
  );

  const wished = useCallback(
    (handle: string) => persisted.wishlist.includes(handle),
    [persisted.wishlist],
  );

  const toggleCompare = useCallback(
    (handle: string) => {
      setPersisted((s) => {
        if (s.compare.includes(handle)) return { ...s, compare: s.compare.filter((h) => h !== handle) };
        if (s.compare.length >= 5) return s;
        return { ...s, compare: [...s.compare, handle] };
      });
    },
    [],
  );

  const clearCompare = useCallback(() => setPersisted((s) => ({ ...s, compare: [] })), []);

  const applyCode = useCallback(
    (code: string) => {
      const c = code.trim().toUpperCase();
      if (c === "FLASH30" || c === "WELCOME10") {
        setPersisted((s) => ({ ...s, code: c }));
        notify(`Code ${c} applied`);
        return true;
      }
      notify("That code is not recognized");
      return false;
    },
    [notify],
  );

  const clearCode = useCallback(() => setPersisted((s) => ({ ...s, code: null })), []);
  const setCurrency = useCallback(
    (currency: string) => setPersisted((s) => ({ ...s, currency })),
    [],
  );
  const signIn = useCallback((name: string, email: string, token?: string, role?: string) => {
    setPersisted((s) => ({ ...s, user: { name, email, role }, token: token ?? s.token ?? null }));
    notify(`Welcome, ${name.split(" ")[0]}`);
  }, [notify]);
  const signOut = useCallback(() => setPersisted((s) => ({ ...s, user: null, token: null })), []);

  const subtotal = persisted.cart.reduce((n, l) => n + linePrice(l), 0);
  const volumeOff = persisted.cart.reduce((n, l) => n + linePrice(l) * volumeRate(l.qty), 0);
  const codeRate = persisted.code === "FLASH30" ? 0.3 : persisted.code === "WELCOME10" ? 0.1 : 0;
  const discount = volumeOff + (subtotal - volumeOff) * codeRate;
  const total = Math.max(0, subtotal - discount);
  const count = persisted.cart.reduce((n, l) => n + l.qty, 0);

  const value = useMemo<Store>(
    () => ({
      ...persisted,
      cartOpen,
      searchOpen,
      quick,
      menuOpen,
      toast,
      offersOpen,
      setCartOpen,
      setSearchOpen,
      setQuick,
      setMenuOpen,
      setOffersOpen,
      setCurrency,
      notify,
      add,
      setQty,
      remove,
      clearCart,
      toggleWish,
      wished,
      toggleCompare,
      clearCompare,
      applyCode,
      clearCode,
      signIn,
      signOut,
      count,
      subtotal,
      discount,
      total,
    }),
    [
      persisted,
      cartOpen,
      searchOpen,
      quick,
      menuOpen,
      toast,
      offersOpen,
      setCurrency,
      notify,
      add,
      setQty,
      remove,
      clearCart,
      toggleWish,
      wished,
      toggleCompare,
      clearCompare,
      applyCode,
      clearCode,
      signIn,
      signOut,
      count,
      subtotal,
      discount,
      total,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("store");
  return v;
}

export function useMoney() {
  const { currency } = useStore();
  return currency;
}

export type { Product };
