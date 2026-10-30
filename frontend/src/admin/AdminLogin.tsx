import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "@/context/Store";
import { api } from "@/lib/api";
import { errorText, Field, Notice } from "./components/AdminUI";
import type { NoticeState } from "./types";
function AdminLogin() {
  const store = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<NoticeState>(null);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const result = await api<{ token: string; user: { name: string; email: string; role: string } }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      if (result.user.role !== "admin") {
        setError("This account does not have administrator access. Ask an existing administrator to provision your role.");
        return;
      }
      store.signIn(result.user.name, result.user.email, result.token, result.user.role);
      navigate("/admin", { replace: true });
    } catch (err) { setError(errorText(err)); }
    finally { setBusy(false); }
  }

  if (store.token && store.user?.role === "admin") return <Navigate to="/admin" replace />;
  return <main className="grid min-h-screen place-items-center bg-[#f6f7fb] px-4 py-10 text-[#171717]">
    <div className="w-full max-w-md rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-[0_20px_70px_rgba(24,42,122,0.1)] sm:p-9">
      <Link to="/" className="inline-flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1d349a] text-lg font-black text-white">C</span><span className="text-xl font-extrabold tracking-tight">CORTEX <span className="text-xs font-semibold text-[#777]">ADMIN</span></span></Link>
      <h1 className="mt-8 text-2xl font-bold">Administrator sign in</h1>
      <p className="mt-2 text-sm text-[#666]">Use an existing Cortex account with the administrator role.</p>
      <Notice notice={notice} onClose={() => setNotice(null)} />
      <form onSubmit={submit} className="mt-6 space-y-4">
        <Field label="Email"><input required type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} className="h-12 w-full rounded-xl border border-[#ddd] px-3 outline-none focus:border-[#1d349a]" /></Field>
        <Field label="Password"><input required type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="h-12 w-full rounded-xl border border-[#ddd] px-3 outline-none focus:border-[#1d349a]" /></Field>
        {error ? <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
        <button disabled={busy} className="h-12 w-full rounded-xl bg-[#1d349a] font-bold text-white hover:bg-[#142773] disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
      <p className="mt-5 text-xs leading-5 text-[#777]">Administrator accounts are not created here. Public registration remains a customer-only flow.</p>
      <Link to="/" className="mt-5 inline-block text-sm font-semibold underline">Return to Cortex store</Link>
    </div>
  </main>;
}

function AdminGate({ children }: { children: ReactNode }) {
  const { token, user, signOut } = useStore();
  const [state, setState] = useState<"checking" | "allowed" | "denied">("checking");
  const location = useLocation();
  useEffect(() => {
    if (!token || user?.role !== "admin") { setState("denied"); return; }
    let active = true;
    api<{ user: { role: string } }>("/auth/me", { token }).then(result => {
      if (!active) return;
      if (result.user.role === "admin") setState("allowed");
      else { signOut(); setState("denied"); }
    }).catch(() => { if (active) { signOut(); setState("denied"); } });
    return () => { active = false; };
  }, [token, user?.role, signOut]);
  if (state === "checking") return <main className="grid min-h-screen place-items-center bg-[#f7f8fb] text-sm text-[#666]">Checking administrator access…</main>;
  if (state === "denied") return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}
export { AdminLogin, AdminGate };
