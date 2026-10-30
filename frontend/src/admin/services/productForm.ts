import type { AdminProduct, ProductForm } from "../types";
function formFromProduct(product?: AdminProduct): ProductForm {
  if (!product) return { externalId: "", handle: "", title: "", type: "", sku: "", stock: "0", rating: "0", reviews: "0", dims: "", weight: "", seat: "", origin: "", description: "", tags: "", images: "", options: "[]", variants: "" };
  return { externalId: String(product.externalId ?? product.id), handle: product.handle, title: product.title, type: product.type, sku: product.sku, stock: String(product.stock), rating: String(product.rating), reviews: String(product.reviews), dims: product.dims || "", weight: product.weight || "", seat: product.seat || "", origin: product.origin || "", description: product.description || product.desc || "", tags: product.tags.join(", "), images: product.images.join("\n"), options: JSON.stringify(product.options, null, 2), variants: JSON.stringify(product.variants, null, 2) };
}
function parseProductForm(form: ProductForm) {
  let options: unknown; let variants: unknown;
  try { options = JSON.parse(form.options); } catch { throw new Error("Options must be valid JSON."); }
  try { variants = JSON.parse(form.variants); } catch { throw new Error("Variants must be valid JSON."); }
  if (!Array.isArray(options) || !Array.isArray(variants) || variants.length === 0) throw new Error("Options must be a JSON array and at least one variant is required.");
  if (options.some(option => !option || typeof option !== "object" || !String(option.name || "").trim() || !Array.isArray(option.values))) throw new Error("Each product option needs a name and a values array.");
  const stock = Number(form.stock); const rating = Number(form.rating); const reviews = Number(form.reviews);
  if (!form.externalId.trim() || !form.handle.trim() || !form.title.trim() || !form.type.trim() || !form.sku.trim()) throw new Error("Product ID, handle, title, category, and SKU are required.");
  if (!Number.isInteger(stock) || stock < 0 || !Number.isFinite(rating) || rating < 0 || rating > 5 || !Number.isInteger(reviews) || reviews < 0) throw new Error("Enter valid stock, rating (0–5), and review count values.");
  for (const [index, raw] of variants.entries()) {
    if (!raw || typeof raw !== "object" || !String(raw.externalId ?? raw.id ?? "").trim() || !String(raw.title ?? "").trim() || raw.price === "" || !Number.isFinite(Number(raw.price)) || Number(raw.price) < 0 || typeof raw.available !== "boolean") throw new Error(`Variant ${index + 1} needs an ID, title, valid price, and boolean availability.`);
    if (raw.compare != null && raw.compare !== "" && (!Number.isFinite(Number(raw.compare)) || Number(raw.compare) < 0)) throw new Error(`Variant ${index + 1} has an invalid compare-at price.`);
  }
  const cleanVariants = variants.map((raw: any) => ({ externalId: String(raw.externalId ?? raw.id), title: String(raw.title), option1: raw.option1 || null, option2: raw.option2 || null, price: Number(raw.price), compare: raw.compare === "" || raw.compare == null ? null : Number(raw.compare), available: Boolean(raw.available), image: raw.image || null }));
  return { externalId: form.externalId.trim(), handle: form.handle.trim().toLowerCase(), title: form.title.trim(), type: form.type.trim(), sku: form.sku.trim(), stock, rating, reviews, dims: form.dims.trim(), weight: form.weight.trim(), seat: form.seat.trim(), origin: form.origin.trim(), description: form.description.trim(), tags: form.tags.split(",").map(s => s.trim()).filter(Boolean), images: form.images.split(/\r?\n/).map(s => s.trim()).filter(Boolean), options, variants: cleanVariants };
}
export { formFromProduct, parseProductForm };
