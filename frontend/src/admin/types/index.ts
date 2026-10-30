export type PageInfo = { page: number; limit: number; total: number; pages: number };
export type AdminProduct = {
  _id: string; id: string | number; externalId: string; handle: string; title: string; type: string;
  tags: string[]; images: string[]; options: { name: string; values: string[] }[];
  variants: { externalId: string; id?: string | number; title: string; option1: string | null; option2: string | null; price: number; compare: number | null; available: boolean; image: string | null }[];
  description: string; desc?: string; stock: number; rating: number; reviews: number; dims: string; weight: string; seat: string; origin: string; sku: string; updatedAt: string;
};
export type AdminCategory = { name: string; productCount: number };
export type AdminStats = { products: number; lowStock: number; customers: number; enquiries: number; orders: number; pendingPayments: number; revenueByCurrency: { _id: string; revenue: number; paidOrders: number }[] };
export type SourcingData = { dataset: Record<string, unknown>; researchReport: string; supplierTemplates: string };
export type NoticeState = { kind: "success" | "error" | "info"; text: string } | null;
export type AdminSection = "overview" | "products" | "categories" | "orders" | "customers" | "inventory" | "sourcing" | "settings";
export type ProductForm = { externalId: string; handle: string; title: string; type: string; sku: string; stock: string; rating: string; reviews: string; dims: string; weight: string; seat: string; origin: string; description: string; tags: string; images: string; options: string; variants: string };
export type AdminOrder = { _id: string; orderNumber: string; createdAt: string; orderStatus: string; paymentStatus: string; total: number; currency: string; user?: { name?: string; email?: string }; shippingAddress?: { firstName?: string; lastName?: string; email?: string }; items: { title?: string; quantity: number }[] };
export type AdminCustomer = { _id: string; name: string; email: string; role: string; createdAt: string };
export const pageSize = 20;
export const adminNav = [
  ["Overview", "overview", "▦"], ["Products", "products", "▤"], ["Categories", "categories", "◫"],
  ["Orders", "orders", "▣"], ["Customers", "customers", "♙"], ["Inventory", "inventory", "◷"],
  ["Alibaba sourcing", "sourcing", "◇"], ["Settings", "settings", "⚙"],
] as const satisfies readonly (readonly [string, AdminSection, string])[];
export const sectionTitles: Record<AdminSection, string> = {
  overview: "Overview", products: "Products", categories: "Categories", orders: "Orders",
  customers: "Customers", inventory: "Inventory", sourcing: "Alibaba sourcing", settings: "Settings & account",
};