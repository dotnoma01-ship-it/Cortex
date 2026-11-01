import { useState } from "react";
import { Link } from "react-router-dom";
import { CURRENCIES } from "@/data/catalog";
import { useStore } from "@/context/Store";
import { CortexLogo } from "./CortexLogo";
import { Social } from "./ui";

export function Footer() {
  const store = useStore();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [cur, setCur] = useState(false);

  return (
    <footer className="border-t border-[#eee] bg-white">
      <div className="border-b border-[#eee] bg-[#f7f7f7]">
        <div className="mx-auto grid max-w-[1680px] gap-6 px-4 py-8 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
          <Info icon="chat" title="Customer Service" text="Monâ€“Sat, 9amâ€“6pm EST." />
          <Info icon="phone" title="Call Us" text="+1 888-234-1234 (toll-free)" />
          <Info icon="mail" title="Get in Touch" text="touch@Cortexstore.com" />
          <Info icon="pin" title="Address" text="382 NE 191st St #87394 Miami" />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1680px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_.7fr_.7fr_.7fr] lg:px-10">
        <div>
          <h3 className="text-2xl font-bold">Join Our Newsletter</h3>
          <p className="mt-2 max-w-md text-sm text-[#666]">
            Sign up to our newsletter & receive 10% off your first order.
          </p>
          {done ? (
            <p className="mt-4 font-bold text-[#0d8756]">You are in. Use code WELCOME10 at checkout.</p>
          ) : (
            <form
              className="mt-5 flex max-w-md overflow-hidden rounded-full bg-[#ededed]"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.includes("@")) return;
                setDone(true);
                store.applyCode("WELCOME10");
              }}
            >
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="h-12 min-w-0 flex-1 bg-transparent px-5 outline-none"
              />
              <button className="h-12 rounded-full bg-black px-6 text-sm font-bold text-white">Sign up</button>
            </form>
          )}
          <p className="mt-3 text-xs text-[#888]">
            By subscribing you agree to the{" "}
            <Link to="/pages/policies" className="underline">
              Terms of Services
            </Link>{" "}
            and{" "}
            <Link to="/pages/policies" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <Col
          title="Company"
          links={[
            ["About us", "/pages/about"],
            ["Contact", "/pages/contact"],
            ["FAQs", "/pages/faqs"],
            ["Blog", "/pages/blog"],
            ["Find a Store", "/pages/find-a-store"],
          ]}
        />
        <Col
          title="Collection"
          links={[
            ["Tables", "/collections/tables"],
            ["Bow Chairs", "/collections/bow-chairs"],
            ["Turn Table", "/products/spin-table"],
            ["Turn Chair", "/collections/turn-chairs"],
            ["Cross Bar Chair", "/collections/bow-chairs"],
          ]}
        />
        <Col
          title="Shop"
          links={[
            ["Sofas", "/collections/sofas"],
            ["Outdoor", "/collections/outdoor"],
            ["Seating", "/collections/sofas-seating"],
            ["Lighting", "/collections/lighting"],
            ["Accessories", "/collections/accessories"],
          ]}
        />
      </div>

      <div className="border-t border-[#eee]">
        <div className="mx-auto flex max-w-[1680px] flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex items-center gap-4">
            <CortexLogo className="h-4 w-auto" />
            <p className="text-sm text-[#666]">© {new Date().getFullYear()} Cortex.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link to="/pages/policies" className="rev">
              Terms of Service
            </Link>
            <Link to="/pages/policies" className="rev">
              Privacy Policy
            </Link>
            <div className="relative">
              <button type="button" className="font-bold" onClick={() => setCur((v) => !v)}>
                {CURRENCIES.find((c) => c.code === store.currency)?.label} ({store.currency})
              </button>
              {cur ? (
                <div className="absolute bottom-8 left-0 z-20 max-h-56 w-56 overflow-auto rounded-2xl bg-white py-2 shadow-xl">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      className="block w-full px-3 py-1.5 text-left hover:bg-[#f5f5f5]"
                      onClick={() => {
                        store.setCurrency(c.code);
                        setCur(false);
                      }}
                    >
                      {c.label} ({c.code})
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {["Visa", "Mastercard", "Amex", "PayPal", "Shop"].map((p) => (
              <span key={p} className="rounded-md border border-[#e5e5e5] px-2 py-1 text-[10px] font-bold tracking-wide">
                {p}
              </span>
            ))}
            <Social />
          </div>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="mb-3 font-bold">{title}</p>
      <ul className="space-y-2 text-sm text-[#444]">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="rev">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Info({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-[#1d349a]">
        {icon === "chat" ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 6h14v9H8l-3 3V6z" /></svg>
        ) : icon === "phone" ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 3h3l1 5-2 1a12 12 0 006 6l1-2 5 1v3a2 2 0 01-2 2A16 16 0 015 5a2 2 0 012-2z" /></svg>
        ) : icon === "mail" ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 6h16v12H4zM4 7l8 6 8-6" /></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2" /></svg>
        )}
      </span>
      <div>
        <p className="font-bold">{title}</p>
        <p className="text-sm text-[#666]">{text}</p>
      </div>
    </div>
  );
}


