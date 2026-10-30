import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Btn } from "@/components/ui";

type EnquiryConfig = { emailEnabled: boolean; whatsappNumber: string };

export function ProductEnquiry({
  productTitle = "",
  productUrl = "",
  selectedOptions = [],
}: {
  productTitle?: string;
  productUrl?: string;
  selectedOptions?: string[];
}) {
  const [config, setConfig] = useState<EnquiryConfig>({ emailEnabled: false, whatsappNumber: "" });
  const [configLoaded, setConfigLoaded] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let active = true;
    void api<EnquiryConfig & { success: boolean }>("/enquiries/config")
      .then((result) => {
        if (active) setConfig({ emailEnabled: result.emailEnabled, whatsappNumber: result.whatsappNumber });
      })
      .catch(() => {
        if (active) setStatus("Enquiry options are unavailable right now. Please try again later.");
      })
      .finally(() => { if (active) setConfigLoaded(true); });
    return () => { active = false; };
  }, []);

  const pageUrl = productUrl || (productTitle && typeof window !== "undefined" ? window.location.href : "");
  const whatsappHref = useMemo(() => {
    if (!config.whatsappNumber || !question.trim()) return "";
    const message = [
      `Product: ${productTitle || "Cortex product enquiry"}`,
      `Product page: ${pageUrl}`,
      selectedOptions.length ? `Selected options: ${selectedOptions.join(", ")}` : "",
      `Question: ${question.trim()}`,
    ].filter(Boolean).join("\n");
    return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [config.whatsappNumber, pageUrl, productTitle, question, selectedOptions]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    setSending(true);
    try {
      const result = await api<{ recorded: boolean; emailStatus: string; message?: string }>("/enquiries", {
        method: "POST",
        body: JSON.stringify({ name, email, question, productTitle, productUrl: pageUrl, selectedOptions }),
      });
      setStatus(result.emailStatus === "accepted"
        ? "Your enquiry was recorded and accepted by the studio email service."
        : "Your enquiry was recorded, but the studio email notification failed. Please contact the studio by WhatsApp if available.");
      setQuestion("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "We could not submit your enquiry. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="mt-8 rounded-3xl border border-[#eee] p-5 sm:p-6" aria-label="Product enquiry">
      <h2 className="text-xl font-bold">{productTitle ? "Ask about this product" : "Email the studio"}</h2>
      <p className="mt-1 text-sm text-[#666]">Send a question about product details, quantity, availability, or delivery.</p>
      <form className="mt-4 space-y-3" onSubmit={submit}>
        <input required maxLength={120} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" autoComplete="name" className="h-12 w-full rounded-2xl bg-[#ededed] px-4 outline-none" />
        <input required maxLength={254} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoComplete="email" className="h-12 w-full rounded-2xl bg-[#ededed] px-4 outline-none" />
        <textarea required maxLength={5000} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Your question" className="h-32 w-full rounded-2xl bg-[#ededed] p-4 outline-none" />
        <div className="flex flex-wrap gap-3">
          <Btn type="submit" disabled={!configLoaded || !config.emailEnabled || sending}>
            {sending ? "Sending…" : "Send by email"}
          </Btn>
          {whatsappHref ? (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center rounded-full bg-[#ededed] px-7 text-[15px] font-bold capitalize transition-colors hover:bg-black hover:text-white">
              Continue in WhatsApp
            </a>
          ) : (
            <button type="button" disabled className="inline-flex h-12 cursor-not-allowed items-center justify-center rounded-full bg-[#ededed] px-7 text-[15px] font-bold opacity-50">
              WhatsApp unavailable
            </button>
          )}
        </div>
      </form>
      {!configLoaded ? <p className="mt-3 text-sm text-[#666]">Loading enquiry options…</p> : null}
      {configLoaded && !config.emailEnabled ? <p className="mt-3 text-sm text-[#666]">Email enquiries are not configured yet. The studio must configure its server-side email service and receiving address.</p> : null}
      {configLoaded && !config.whatsappNumber ? <p className="mt-3 text-sm text-[#666]">WhatsApp is not configured yet.</p> : null}
      {config.whatsappNumber ? <p className="mt-2 text-xs text-[#666]">WhatsApp will open with a prepared message. Review it and press Send in WhatsApp.</p> : null}
      {status ? <p role="status" className="mt-3 text-sm font-semibold text-[#444]">{status}</p> : null}
    </section>
  );
}
