import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import type { NoticeState, PageInfo } from "../types";
function errorText(error: unknown) { return error instanceof Error ? error.message : "Something went wrong. Please try again."; }
function money(value: number, currency: string) {
  try { return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(value); }
  catch { return `${currency} ${value.toFixed(2)}`; }
}
function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="block text-sm font-semibold text-[#303030]">{label}<span className="mt-1.5 block">{children}</span>{hint ? <span className="mt-1 block text-xs font-normal text-[#777]">{hint}</span> : null}</label>;
}
function Notice({ notice, onClose }: { notice: NoticeState; onClose?: () => void }) {
  if (!notice) return null;
  const colors = notice.kind === "error" ? "border-red-200 bg-red-50 text-red-800" : notice.kind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-blue-200 bg-blue-50 text-blue-900";
  return <div role={notice.kind === "error" ? "alert" : "status"} className={cn("mb-4 flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-sm", colors)}>{notice.text}{onClose ? <button type="button" aria-label="Dismiss message" onClick={onClose} className="font-bold">×</button> : null}</div>;
}
function Spinner({ label = "Loading" }: { label?: string }) { return <div className="py-12 text-center text-sm text-[#666]" role="status">{label}…</div>; }
function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>{subtitle ? <p className="mt-1 text-sm text-[#666]">{subtitle}</p> : null}</div>{action}</div>;
}
function Pager({ page, pagination, onPage }: { page: number; pagination?: PageInfo; onPage: (next: number) => void }) {
  if (!pagination || pagination.pages <= 1) return null;
  return <div className="mt-5 flex items-center justify-between gap-3 text-sm"><p className="text-[#666]">Page {page} of {pagination.pages} · {pagination.total} records</p><div className="flex gap-2"><button disabled={page <= 1} onClick={() => onPage(page - 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Previous</button><button disabled={page >= pagination.pages} onClick={() => onPage(page + 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Next</button></div></div>;
}
function Panel({ children, className = "" }: { children: ReactNode; className?: string }) { return <section className={cn("rounded-2xl border border-[#e7e7e7] bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.025)] sm:p-5", className)}>{children}</section>; }
function Pill({ children, tone = "gray" }: { children: ReactNode; tone?: "gray" | "green" | "amber" | "red" | "blue" }) {
  const toneClass = { gray: "bg-[#f1f1f1] text-[#444]", green: "bg-emerald-50 text-emerald-800", amber: "bg-amber-50 text-amber-800", red: "bg-red-50 text-red-800", blue: "bg-blue-50 text-blue-800" }[tone];
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-bold", toneClass)}>{children}</span>;
}
function Confirmation({ title, message, confirmLabel, onCancel, onConfirm, busy, danger, disabled }: { title: string; message: ReactNode; confirmLabel: string; onCancel: () => void; onConfirm: () => void; busy?: boolean; danger?: boolean; disabled?: boolean }) {
  return <div className="fixed inset-0 z-[60] grid place-items-center bg-black/45 p-4" role="presentation"><section role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"><h3 id="confirm-title" className="text-lg font-bold">{title}</h3><div className="mt-2 text-sm leading-6 text-[#555]">{message}</div><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm font-semibold">Cancel</button><button type="button" disabled={busy || disabled} onClick={onConfirm} className={cn("rounded-lg px-4 py-2 text-sm font-bold text-white disabled:opacity-40", danger ? "bg-red-700" : "bg-[#1d349a]")}>{busy ? "Working…" : confirmLabel}</button></div></section></div>;
}
export { errorText, money, Field, Notice, Spinner, SectionTitle, Pager, Panel, Pill, Confirmation };
