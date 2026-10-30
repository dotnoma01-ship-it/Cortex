import { useEffect, useState, type FormEvent } from "react";
import { useStore } from "@/context/Store";
import { api } from "@/lib/api";
import { errorText, Field, Notice, Spinner, SectionTitle, Pager, Panel, Pill, Confirmation } from "../components/AdminUI";
import { formFromProduct, parseProductForm } from "../services/productForm";
import useCategories from "../hooks/useCategories";
import type { AdminProduct, PageInfo, NoticeState, ProductForm } from "../types";
import { pageSize } from "../types";
function ProductDialog({ product, onClose, onSaved, onDeleted }: { product?: AdminProduct; onClose: () => void; onSaved: () => void; onDeleted: () => void }) {
  const { token } = useStore();
  const editing = Boolean(product);
  const [form, setForm] = useState<ProductForm>(() => formFromProduct(product));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmSave, setConfirmSave] = useState<ReturnType<typeof parseProductForm> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const update = (key: keyof ProductForm, value: string) => setForm(current => ({ ...current, [key]: value }));

  async function save(payload: ReturnType<typeof parseProductForm>) {
    if (!token) return;
    setBusy(true); setError("");
    try {
      if (editing && product) {
        await api(`/products/${encodeURIComponent(product._id)}`, { method: "PATCH", token, body: JSON.stringify({ ...payload, expectedUpdatedAt: product.updatedAt }) });
      } else await api("/products", { method: "POST", token, body: JSON.stringify(payload) });
      onSaved();
    } catch (err) { setError(errorText(err)); }
    finally { setBusy(false); setConfirmSave(null); }
  }
  async function remove() {
    if (!token || !product) return;
    setBusy(true); setError("");
    try { await api(`/products/${encodeURIComponent(product._id)}`, { method: "DELETE", token, body: JSON.stringify({ confirmationHandle: deleteText }) }); onDeleted(); }
    catch (err) { setError(errorText(err)); }
    finally { setBusy(false); }
  }
  function submit(event: FormEvent) { event.preventDefault(); setError(""); try { const payload = parseProductForm(form); if (editing) setConfirmSave(payload); else void save(payload); } catch (err) { setError(errorText(err)); } }

  return <div className="fixed inset-0 z-50 grid place-items-end bg-black/40 p-0 sm:place-items-center sm:p-5" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="product-dialog-title" className="max-h-[96vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-3xl sm:rounded-3xl sm:p-7">
      <div className="mb-5 flex items-start justify-between gap-3"><div><h2 id="product-dialog-title" className="text-xl font-bold">{editing ? "Edit product" : "Add product"}</h2><p className="mt-1 text-sm text-[#666]">Fields and variants are saved to the existing Product API schema.</p></div><button type="button" onClick={onClose} aria-label="Close product editor" className="grid h-9 w-9 place-items-center rounded-lg border text-xl">×</button></div>
      <Notice notice={error ? { kind: "error", text: error } : null} />
      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product ID / external ID"><input disabled={editing} required value={form.externalId} onChange={e => update("externalId", e.target.value)} className="admin-input" />{editing ? <small className="mt-1 block font-normal text-[#777]">Stable ID cannot be changed.</small> : null}</Field>
          <Field label="SKU"><input required value={form.sku} onChange={e => update("sku", e.target.value)} className="admin-input" /></Field>
          <Field label="Title"><input required maxLength={180} value={form.title} onChange={e => update("title", e.target.value)} className="admin-input" /></Field>
          <Field label="Handle"><input required value={form.handle} onChange={e => update("handle", e.target.value)} className="admin-input" /></Field>
          <Field label="Category (product type)"><input required value={form.type} onChange={e => update("type", e.target.value)} className="admin-input" /></Field>
          <Field label="Stock quantity"><input required type="number" min="0" step="1" value={form.stock} onChange={e => update("stock", e.target.value)} className="admin-input" /></Field>
          <Field label="Rating"><input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => update("rating", e.target.value)} className="admin-input" /></Field>
          <Field label="Review count"><input type="number" min="0" step="1" value={form.reviews} onChange={e => update("reviews", e.target.value)} className="admin-input" /></Field>
        </div>
        <Field label="Description"><textarea rows={3} value={form.description} onChange={e => update("description", e.target.value)} className="admin-input h-auto py-3" /></Field>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Tags (comma separated)"><input value={form.tags} onChange={e => update("tags", e.target.value)} className="admin-input" /></Field><Field label="Image URLs (one per line)"><textarea rows={3} value={form.images} onChange={e => update("images", e.target.value)} className="admin-input h-auto py-3" /></Field></div>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Dimensions"><input value={form.dims} onChange={e => update("dims", e.target.value)} className="admin-input" /></Field><Field label="Weight"><input value={form.weight} onChange={e => update("weight", e.target.value)} className="admin-input" /></Field><Field label="Seat"><input value={form.seat} onChange={e => update("seat", e.target.value)} className="admin-input" /></Field><Field label="Origin"><input value={form.origin} onChange={e => update("origin", e.target.value)} className="admin-input" /></Field></div>
        <Field label="Options (JSON array)" hint={'Example: [{"name":"Color","values":["Black"]}]'}><textarea rows={4} value={form.options} onChange={e => update("options", e.target.value)} className="admin-input h-auto font-mono text-xs" /></Field>
        <Field label="Variants (JSON array)" hint={'Each variant needs externalId, title, price, available. Use option1/option2 and image where appropriate.'}><textarea required rows={9} value={form.variants} onChange={e => update("variants", e.target.value)} className="admin-input h-auto font-mono text-xs" placeholder={'[{"externalId":"variant-1","title":"Default","option1":null,"option2":null,"price":0,"compare":null,"available":false,"image":null}]'} /></Field>
        <div className="flex flex-wrap justify-between gap-3 border-t pt-4"><div>{editing ? <button type="button" onClick={() => { setConfirmDelete(true); setDeleteText(""); }} className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50">Remove product</button> : null}</div><div className="flex gap-2"><button type="button" onClick={onClose} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">Cancel</button><button disabled={busy} className="rounded-xl bg-[#1d349a] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy ? "Saving…" : editing ? "Review changes" : "Create product"}</button></div></div>
      </form>
      {confirmSave ? <Confirmation title="Confirm product changes" message={`Save changes to “${product?.title}”? This updates the current catalogue record. The product ID, handle and SKU must remain unique.`} confirmLabel="Apply changes" busy={busy} onCancel={() => setConfirmSave(null)} onConfirm={() => void save(confirmSave)} /> : null}
      {confirmDelete && product ? <Confirmation title="Remove product permanently?" message={<span>This schema has no archive or restore feature. To confirm removal, type the exact product handle: <code className="font-bold">{product.handle}</code><input autoFocus value={deleteText} onChange={e => setDeleteText(e.target.value)} className="admin-input mt-3" aria-label="Type product handle to confirm" /></span>} confirmLabel="Remove permanently" danger busy={busy} disabled={deleteText !== product.handle} onCancel={() => setConfirmDelete(false)} onConfirm={() => void remove()} /> : null}
    </section>
  </div>;
}

function Products({ initialType = "" }: { initialType?: string }) {
  const { token } = useStore(); const categories = useCategories(token);
  const [products, setProducts] = useState<AdminProduct[]>([]); const [pagination, setPagination] = useState<PageInfo>();
  const [page, setPage] = useState(1); const [queryInput, setQueryInput] = useState(""); const [query, setQuery] = useState(""); const [type, setType] = useState(initialType); const [inStock, setInStock] = useState(false);
  const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [notice, setNotice] = useState<NoticeState>(null); const [selected, setSelected] = useState<AdminProduct | "new" | null>(null);
  async function load() { if (!token) return; setLoading(true); setError(""); const params = new URLSearchParams({ page: String(page), limit: String(pageSize) }); if (query) params.set("q", query); if (type) params.set("type", type); if (inStock) params.set("inStock", "true"); try { const result = await api<{ products: AdminProduct[]; pagination: PageInfo }>(`/products?${params}`, { token }); setProducts(result.products); setPagination(result.pagination); } catch (e) { setError(errorText(e)); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, [token, page, query, type, inStock]);
  useEffect(() => { setType(initialType); setPage(1); }, [initialType]);
  const applyQuery = (event: FormEvent) => { event.preventDefault(); setPage(1); setQuery(queryInput.trim()); };
  const saved = () => { setSelected(null); setNotice({ kind: "success", text: "Product saved." }); void load(); };
  const deleted = () => { setSelected(null); setNotice({ kind: "success", text: "Product removed." }); void load(); };
  return <>
    <SectionTitle title="Products" subtitle="Search and edit product records from the backend catalogue." action={<button onClick={() => setSelected("new")} className="rounded-xl bg-[#1d349a] px-4 py-2.5 text-sm font-bold text-white">+ Add product</button>} />
    <Notice notice={notice} onClose={() => setNotice(null)} />{error ? <Notice notice={{ kind: "error", text: error }} /> : null}
    <Panel>
      <form onSubmit={applyQuery} className="grid gap-3 md:grid-cols-[minmax(180px,1fr)_200px_180px_auto]">
        <input value={queryInput} onChange={e => setQueryInput(e.target.value)} placeholder="Search title, type or tags" aria-label="Search products" className="admin-input" />
        <select value={type} onChange={e => { setType(e.target.value); setPage(1); }} aria-label="Filter by category" className="admin-input"><option value="">All categories</option>{categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</select>
        <select value={inStock ? "yes" : "all"} onChange={e => { setInStock(e.target.value === "yes"); setPage(1); }} aria-label="Filter stock" className="admin-input"><option value="all">All availability</option><option value="yes">In stock</option></select>
        <button className="rounded-xl border px-5 py-2.5 text-sm font-bold hover:bg-[#f8f8f8]">Search</button>
      </form>
      {loading ? <Spinner label="Loading products" /> : products.length ? <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[780px] border-collapse text-left text-sm"><thead className="text-xs uppercase tracking-wide text-[#777]"><tr className="border-b"><th className="px-3 py-3">Product</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Variants</th><th className="px-3 py-3">Stock</th><th className="px-3 py-3">SKU</th><th className="px-3 py-3">Actions</th></tr></thead><tbody>{products.map(p => <tr key={p._id} className="border-b last:border-0"><td className="px-3 py-3"><b className="block">{p.title}</b><span className="text-xs text-[#777]">/{p.handle}</span></td><td className="px-3 py-3">{p.type}</td><td className="px-3 py-3">{p.variants.length}</td><td className="px-3 py-3"><Pill tone={p.stock === 0 ? "red" : p.stock <= 5 ? "amber" : "green"}>{p.stock}</Pill></td><td className="px-3 py-3">{p.sku}</td><td className="px-3 py-3"><button onClick={() => setSelected(p)} className="rounded-lg border px-3 py-1.5 font-semibold hover:border-[#1d349a]">Edit</button></td></tr>)}</tbody></table></div> : <p className="py-10 text-center text-sm text-[#666]">No products matched these filters.</p>}
      <Pager page={page} pagination={pagination} onPage={setPage} />
    </Panel>
    {selected ? <ProductDialog product={selected === "new" ? undefined : selected} onClose={() => setSelected(null)} onSaved={saved} onDeleted={deleted} /> : null}
  </>;
}
export default Products;
