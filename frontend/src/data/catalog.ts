import raw from "./products.json";

export type Variant = {
  id: number;
  title: string;
  option1: string | null;
  option2: string | null;
  price: number;
  compare: number | null;
  available: boolean;
  image: string | null;
};

export type Product = {
  id: number;
  handle: string;
  title: string;
  type: string;
  tags: string[];
  images: string[];
  options: { name: string; values: string[] }[];
  variants: Variant[];
  desc: string;
  stock: number;
  rating: number;
  reviews: number;
  dims: string;
  weight: string;
  seat: string;
  origin: string;
  sku: string;
  inventoryPolicy?: "stock" | "preorder";
  priceStatus?: "approved" | "estimated";
  saleUnit?: "piece" | "slab" | "m²";
};

export const products = raw as Product[];
export const byHandle = Object.fromEntries(products.map((p) => [p.handle, p]));

export function getProduct(handle?: string) {
  return handle ? byHandle[handle] : undefined;
}

export function img(src?: string | null, w = 900) {
  if (!src) return "";
  return `${src.split("?")[0]}?width=${w}`;
}

export const FILE = "https://hyper-theme-demo.myshopify.com/cdn/shop/files";
export function file(name: string, w = 14000) {
  return `${FILE}/${name}?width=${w}`;
}

export const LOGO = "/images/image copy.png";

export const COLORS: Record<string, string> = {
  "Light Beige": "#E6D5C1",
  Yellow: "#E2B23C",
  Black: "#1A1A1A",
  Brown: "#8B5A3C",
  Chocolate: "#5C3317",
  Grey: "#B5B5B5",
  Gray: "#B5B5B5",
  "Soft Green": "#B7C7A6",
  Red: "#C44536",
  Charcoal: "#3C3C3C",
  Blue: "#4E6E96",
  Orange: "#E07A3D",
  "Navy Blue": "#1D349A",
  Olive: "#6B7043",
  Pine: "#3D5C46",
  Oak: "#C4A574",
  Wool: "#D8D2CA",
  Textile: "#E7DFD4",
};

export const CURRENCIES = [
  { code: "USD", label: "United States", symbol: "$", rate: 1 },
  { code: "AUD", label: "Australia", symbol: "A$", rate: 1.52 },
  { code: "EUR", label: "Eurozone", symbol: "â‚¬", rate: 0.92 },
  { code: "GBP", label: "United Kingdom", symbol: "Â£", rate: 0.78 },
  { code: "CAD", label: "Canada", symbol: "C$", rate: 1.36 },
  { code: "JPY", label: "Japan", symbol: "Â¥", rate: 151 },
  { code: "SGD", label: "Singapore", symbol: "S$", rate: 1.34 },
  { code: "AED", label: "United Arab Emirates", symbol: "AED ", rate: 3.67 },
  { code: "CHF", label: "Switzerland", symbol: "CHF ", rate: 0.88 },
  { code: "KRW", label: "South Korea", symbol: "â‚©", rate: 1380 },
];

export function formatMoney(amount: number, code = "USD") {
  const c = CURRENCIES.find((x) => x.code === code) ?? CURRENCIES[0];
  const v = amount * c.rate;
  if (c.code === "JPY" || c.code === "KRW") {
    return `${c.symbol}${Math.round(v).toLocaleString()}`;
  }
  return `${c.symbol}${v.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function priceRange(p: Product) {
  const prices = p.variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const compare =
    p.variants.find((v) => v.compare && v.compare > v.price)?.compare ?? null;
  return { min, max, compare, from: min !== max };
}

export function isSale(p: Product) {
  return p.variants.some((v) => v.compare && v.compare > v.price);
}

export function discountPct(price: number, compare?: number | null) {
  if (!compare || compare <= price) return 0;
  return Math.round((1 - price / compare) * 100);
}

export function priceUnitLabel(p: Product) {
  return p.saleUnit && p.saleUnit !== "piece" ? ` / ${p.saleUnit}` : " each";
}

export type Badge = { label: string; bg: string };

export function badges(p: Product): Badge[] {
  const out: Badge[] = [];
  if (p.inventoryPolicy === "preorder") out.push({ label: "Pre-order", bg: "#1d349a" });
  else if (p.tags.includes("Coming Soon")) out.push({ label: "Coming Soon", bg: "#7A34D6" });
  else if (p.stock === 0) out.push({ label: "Sold Out", bg: "#ADADAD" });
  else if (isSale(p)) out.push({ label: "Sale", bg: "#C4301C" });
  if (p.priceStatus === "estimated") out.push({ label: "Estimated price", bg: "#555" });
  if (p.tags.includes("New")) out.push({ label: "New", bg: "#0d8756" });
  if (p.stock > 0 && p.stock <= 3) out.push({ label: "Selling Fast", bg: "#1d349a" });
  else if (p.tags.includes("Best Choice!")) out.push({ label: "Best Choice!", bg: "#1d349a" });
  return out.slice(0, 2);
}

export function colorOption(p: Product) {
  return p.options.find((o) => /color|colour/i.test(o.name));
}

export function materialOption(p: Product) {
  return p.options.find((o) => /material|denomination/i.test(o.name) || o.name !== colorOption(p)?.name);
}

export function findVariant(p: Product, o1?: string | null, o2?: string | null) {
  if (o1 && o2) {
    return p.variants.find((v) => v.option1 === o1 && v.option2 === o2) ?? p.variants[0];
  }
  if (o1) return p.variants.find((v) => v.option1 === o1) ?? p.variants[0];
  if (o2) return p.variants.find((v) => v.option2 === o2 || v.option1 === o2) ?? p.variants[0];
  return p.variants[0];
}

export function pickVariant(p: Product, selected: Record<string, string>) {
  return (
    p.variants.find((v) =>
      p.options.every((opt, idx) => {
        const want = selected[opt.name];
        if (!want) return true;
        const got = idx === 0 ? v.option1 : v.option2;
        return got === want;
      }),
    ) ?? p.variants[0]
  );
}

export function related(p: Product, n = 4) {
  return products.filter((x) => x.handle !== p.handle && x.type === p.type).slice(0, n);
}

export type Collection = {
  handle: string;
  title: string;
  image: string;
  blurb: string;
  match: (p: Product) => boolean;
};

const hasType = (...types: string[]) => (p: Product) => types.includes(p.type);
const titleHas = (re: RegExp) => (p: Product) => re.test(p.title);
const decorTypes = ["Accessories", "Candles", "Vases", "Pillows", "Towels", "Planters", "Bowls", "Rugs", "Ottomans"];

export const collections: Collection[] = [
  {
    handle: "marble-products",
    title: "Marble Products",
    image: "collection-slider-10.jpg",
    blurb: "Marble effect panels and surfaces. Ask us for current price and availability.",
    match: (p) => p.type === "Marble Products",
  },
  {
    handle: "all",
    title: "All Products",
    image: "collection-slider-6.jpg",
    blurb: "The full Cortex collection â€” furniture, lighting, and objects for considered rooms.",
    match: () => true,
  },
  {
    handle: "sale-items",
    title: "Sale Items",
    image: "collection-sales.webp",
    blurb: "Studio pieces currently marked down. Same materials, a sharper number.",
    match: isSale,
  },
  {
    handle: "tables",
    title: "Press Tables",
    image: "collection-slider-1.jpg",
    blurb: "Dining, coffee, and side tables with a precise edge and a quiet stance.",
    match: hasType("Tables"),
  },
  {
    handle: "lighting",
    title: "Lighting",
    image: "collection-slider-2.jpg",
    blurb: "Lamps shaped like objects. Warm light for reading, dining, and late rooms.",
    match: hasType("Lamps"),
  },
  {
    handle: "sofas",
    title: "Spoke Sofa",
    image: "collection-slider-3.jpg",
    blurb: "Low lines, deep seats, upholstery that keeps its shape.",
    match: hasType("Sofas", "Sofa"),
  },
  {
    handle: "storage",
    title: "Storage",
    image: "collection-slider-4.jpg",
    blurb: "Shelves, racks, and sideboards that read as architecture.",
    match: (p) =>
      ["Rack Wall", "Floating Wall"].includes(p.type) || /shelf|sideboard|storage|rack/i.test(p.title),
  },
  {
    handle: "turn-chairs",
    title: "Turn Chairs",
    image: "collection-slider-5.jpg",
    blurb: "A swivel seat with a calm profile â€” for desks, dining, and the in-between.",
    match: titleHas(/turn/i),
  },
  {
    handle: "chairs",
    title: "Chairs",
    image: "collection-slider-6.jpg",
    blurb: "Dining, lounge, and work chairs from the Cortex seating library.",
    match: hasType("Chairs", "Armchairs"),
  },
  {
    handle: "curve",
    title: "Curve Coat",
    image: "collection-slider-7.jpg",
    blurb: "Arc silhouettes â€” chairs, racks, and shelves drawn from a single curve.",
    match: titleHas(/arc|coat/i),
  },
  {
    handle: "bend-chairs",
    title: "Bend Chairs",
    image: "collection-slider-8.jpg",
    blurb: "Seats with a bent line and a soft landing.",
    match: (p) => hasType("Chairs", "Armchairs")(p) && /lounge|club|cozy|plush|velvet/i.test(p.title),
  },
  {
    handle: "accessories",
    title: "Accessories",
    image: "collection-slider-10.jpg",
    blurb: "Objects with a large presence. Made to be used, not only displayed.",
    match: (p) => decorTypes.includes(p.type),
  },
  {
    handle: "dining-tables",
    title: "Tables",
    image: "collection-slider-16.jpg",
    blurb: "Tables for gathering, working, and setting things down with intention.",
    match: hasType("Tables", "Desks"),
  },
  {
    handle: "bar-chairs",
    title: "Bar Chairs",
    image: "collection-slider-9.jpg",
    blurb: "Counter and bar seating with the same finish standard as the rest of the house.",
    match: hasType("Bar Stools"),
  },
  {
    handle: "bow-chairs",
    title: "Bow Chairs",
    image: "collection-slider-5.jpg",
    blurb: "The Bow and Cross seating family â€” understated frames, honest prices.",
    match: (p) => /cross|bow|bar chair|line chair/i.test(p.title) || (hasType("Chairs")(p) && p.variants[0].price < 400),
  },
  {
    handle: "desks",
    title: "Desks",
    image: "collection-slider-1.jpg",
    blurb: "Work surfaces with the discipline of the collection.",
    match: hasType("Desks"),
  },
  {
    handle: "new",
    title: "New Arrivals",
    image: "collection-tabs-banner-1-v2.jpg",
    blurb: "Traditional divides between personal and professional space, redrawn.",
    match: (p) => p.tags.includes("New"),
  },
  {
    handle: "hot",
    title: "Hot Items",
    image: "collection-slider-6.jpg",
    blurb: "The pieces the studio keeps recommending.",
    match: (p) => p.tags.includes("Best Choice!") || p.stock <= 4,
  },
  {
    handle: "soft-stools",
    title: "Soft Stools",
    image: "collection-slider-9.jpg",
    blurb: "Upholstered stools and low seats for kitchens and landings.",
    match: (p) => hasType("Bar Stools", "Ottomans")(p) || /stool|ottoman|bench/i.test(p.title),
  },
  {
    handle: "design",
    title: "Design",
    image: "collection-slider-3.jpg",
    blurb: "Signature forms from the current season.",
    match: (p) => /arc|loop|spoke|grid|cross/i.test(p.title),
  },
  {
    handle: "living-room",
    title: "Living Room",
    image: "collection-tab-1-v2.jpg",
    blurb: "Sofas, lounge chairs, tables, and the objects that finish a room.",
    match: (p) =>
      ["Sofas", "Sofa", "Chairs", "Armchairs", "Ottomans", "Tables", "Rugs", "Lamps", "Pillows"].includes(p.type),
  },
  {
    handle: "dining-kitchen",
    title: "Dining & Kitchen",
    image: "slideshow-3_a5017f29-7d75-4e6a-9052-3a6b84946846.jpg",
    blurb: "Highlighting the unique touches that set every piece apart.",
    match: (p) => ["Tables", "Chairs", "Bar Stools", "Bowls", "Towels", "Vases"].includes(p.type),
  },
  {
    handle: "bed-room",
    title: "Bed Room",
    image: "collection-tab-2-v2.jpg",
    blurb: "Lighting, textiles, and quiet storage for the end of the day.",
    match: (p) => ["Pillows", "Lamps", "Rugs", "Candles", "Ottomans"].includes(p.type),
  },
  {
    handle: "work-room",
    title: "Work Room",
    image: "collection-tab-3-v2.jpg",
    blurb: "Desks, task chairs, and shelves for a room that has to concentrate.",
    match: (p) => ["Desks", "Chairs"].includes(p.type) || /desk|task|work|shelf/i.test(p.title),
  },
  {
    handle: "outdoor",
    title: "Outdoor",
    image: "collection-slider-2.jpg",
    blurb: "Planters, lighting, and pieces that can live closer to the weather.",
    match: (p) => ["Planters"].includes(p.type) || /outdoor|planter/i.test(p.title + p.type),
  },
  {
    handle: "rugs",
    title: "Rugs",
    image: "collection-slider-10.jpg",
    blurb: "Woven fields that anchor a room without raising their voice.",
    match: hasType("Rugs"),
  },
  {
    handle: "candles",
    title: "Candles",
    image: "collection-slider-10.jpg",
    blurb: "Slow burns for evenings rather than occasions.",
    match: hasType("Candles"),
  },
  {
    handle: "sofas-seating",
    title: "Seating",
    image: "collection-slider-6.jpg",
    blurb: "Every seat in the collection, from counter stools to sofas.",
    match: (p) => ["Chairs", "Armchairs", "Bar Stools", "Sofas", "Sofa", "Ottomans"].includes(p.type),
  },
];

export function getCollection(handle?: string) {
  return collections.find((c) => c.handle === handle);
}

export function collectionProducts(handle?: string) {
  const c = getCollection(handle);
  if (!c) return [];
  return products.filter(c.match);
}

export type NavLink = { label: string; to: string };
export type NavColumn = { title: string; links: NavLink[] };

export const categoryColumns: NavColumn[] = [
  {
    title: "Furniture",
    links: [
      { label: "Sofas", to: "/collections/sofas" },
      { label: "Tables & Desks", to: "/collections/dining-tables" },
      { label: "Chair & Stools", to: "/collections/chairs" },
      { label: "Shelves", to: "/collections/storage" },
      { label: "Shop All", to: "/collections/all" },
    ],
  },
  {
    title: "Table & Desks",
    links: [
      { label: "Dining Tables", to: "/collections/tables" },
      { label: "Coffee Table", to: "/collections/tables" },
      { label: "Side Tables", to: "/collections/tables" },
      { label: "Work Desk", to: "/collections/desks" },
      { label: "Table Lamps", to: "/collections/lighting" },
      { label: "Shop All", to: "/collections/dining-tables" },
    ],
  },
  {
    title: "Chair & Stools",
    links: [
      { label: "Dining Chairs", to: "/collections/chairs" },
      { label: "Bar Stools", to: "/collections/bar-chairs" },
      { label: "Office Chairs", to: "/collections/work-room" },
      { label: "Arm Chairs", to: "/collections/bend-chairs" },
      { label: "Shop All", to: "/collections/sofas-seating" },
    ],
  },
  {
    title: "Home & Decor",
    links: [
      { label: "Rugs", to: "/collections/rugs" },
      { label: "Candles", to: "/collections/candles" },
      { label: "Wall Decors", to: "/collections/storage" },
      { label: "Mirrors", to: "/collections/accessories" },
      { label: "Ottomans", to: "/collections/soft-stools" },
      { label: "Floor Lamps", to: "/collections/lighting" },
      { label: "Pillows", to: "/collections/accessories" },
      { label: "Shop All", to: "/collections/accessories" },
    ],
  },
];

export const rooms: { label: string; to: string; links: NavLink[] }[] = [
  {
    label: "Living Room",
    to: "/collections/living-room",
    links: [
      { label: "Tables & Desks", to: "/collections/tables" },
      { label: "Sofas", to: "/collections/sofas" },
      { label: "Chairs & Stools", to: "/collections/chairs" },
      { label: "Storages & Cabinets", to: "/collections/storage" },
      { label: "Bow Chairs", to: "/collections/bow-chairs" },
      { label: "Cross Bar Chairs", to: "/collections/bow-chairs" },
      { label: "Single Coffee Tables", to: "/collections/tables" },
      { label: "Soft Bench", to: "/collections/soft-stools" },
    ],
  },
  {
    label: "Dining & Kitchen",
    to: "/collections/dining-kitchen",
    links: [
      { label: "Dining Tables", to: "/collections/tables" },
      { label: "Dining Chairs", to: "/collections/chairs" },
      { label: "Bar Stools", to: "/collections/bar-chairs" },
      { label: "Storages", to: "/collections/storage" },
      { label: "Table Linens", to: "/collections/accessories" },
      { label: "Dinnerware Sets", to: "/collections/accessories" },
      { label: "Lighting", to: "/collections/lighting" },
      { label: "Accessories", to: "/collections/accessories" },
    ],
  },
  {
    label: "Bed Room",
    to: "/collections/bed-room",
    links: [
      { label: "Lighting", to: "/collections/lighting" },
      { label: "Accessories", to: "/collections/accessories" },
      { label: "Sofas", to: "/collections/sofas" },
      { label: "Storages", to: "/collections/storage" },
      { label: "Ottomans", to: "/collections/soft-stools" },
    ],
  },
  {
    label: "Work Room",
    to: "/collections/work-room",
    links: [
      { label: "Desks", to: "/collections/desks" },
      { label: "Office Chairs", to: "/collections/chairs" },
      { label: "Bookshelves", to: "/collections/storage" },
      { label: "Cabinets", to: "/collections/storage" },
      { label: "Task Lamps", to: "/collections/lighting" },
      { label: "Accessories", to: "/collections/accessories" },
    ],
  },
  {
    label: "Outdoor",
    to: "/collections/outdoor",
    links: [
      { label: "Lighting", to: "/collections/lighting" },
      { label: "Planters", to: "/collections/outdoor" },
      { label: "Home & Decor", to: "/collections/accessories" },
      { label: "Ottomans", to: "/collections/soft-stools" },
    ],
  },
];

export const pageLinks: NavColumn[] = [
  {
    title: "About",
    links: [
      { label: "About us", to: "/pages/about" },
      { label: "Contact", to: "/pages/contact" },
      { label: "FAQs", to: "/pages/faqs" },
      { label: "Find a Store", to: "/pages/find-a-store" },
      { label: "Blog", to: "/pages/blog" },
    ],
  },
  {
    title: "Collections",
    links: [
      { label: "Collections List", to: "/pages/collections" },
      { label: "Left Banner", to: "/collections/chairs?layout=left" },
      { label: "Right Banner", to: "/collections/tables?layout=right" },
      { label: "With Background", to: "/collections/sofas?layout=bg" },
      { label: "With Image Cards", to: "/collections/lighting?layout=cards" },
      { label: "Without Banner", to: "/collections/accessories?layout=none" },
    ],
  },
  {
    title: "Product Gallery",
    links: [
      { label: "Vertical Thumbnails", to: "/products/arc-chair?gallery=vertical" },
      { label: "Horizontal Thumbnails", to: "/products/arc-chair?gallery=horizontal" },
      { label: "Grid 2 Columns", to: "/products/loop-sofa-armrest?gallery=grid" },
      { label: "Grid Mix", to: "/products/swivel-table?gallery=mix" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Gift Card", to: "/products/hyper-gift-card" },
      { label: "Product Compare", to: "/pages/compare" },
      { label: "Wishlist", to: "/pages/wishlist" },
      { label: "Theme Features", to: "/pages/theme-features" },
    ],
  },
];

export const featureLinks: NavLink[] = [
  { label: "Product Color Swatch", to: "/products/arc-chair?swatch=color" },
  { label: "Product Image Swatch", to: "/products/arc-chair?swatch=image" },
  { label: "Product Flash Sale", to: "/products/arc-chair" },
  { label: "Product Coming Soon", to: "/products/rio-ottoman" },
  { label: "Product Out Of Stock", to: "/products/victoria-ottoman" },
  { label: "On Sale", to: "/collections/sale-items" },
  { label: "Quick Order List", to: "/pages/quick-order" },
  { label: "Volume Pricing", to: "/products/dining-table-haven" },
];

export const circleCats = [
  { title: "Sale Items", image: "collection-sales.webp", to: "/collections/sale-items" },
  { title: "Press Tables", image: "collection-slider-1.jpg", to: "/collections/tables" },
  { title: "Lighting", image: "collection-slider-2.jpg", to: "/collections/lighting" },
  { title: "Spoke Sofa", image: "collection-slider-3.jpg", to: "/collections/sofas" },
  { title: "Storage", image: "collection-slider-4.jpg", to: "/collections/storage" },
  { title: "Turn Chairs", image: "collection-slider-5.jpg", to: "/collections/turn-chairs" },
  { title: "Chairs", image: "collection-slider-6.jpg", to: "/collections/chairs" },
  { title: "Curve Coat", image: "collection-slider-7.jpg", to: "/collections/curve" },
  { title: "Bend Chairs", image: "collection-slider-8.jpg", to: "/collections/bend-chairs" },
  { title: "Accessories", image: "collection-slider-10.jpg", to: "/collections/accessories" },
  { title: "Tables", image: "collection-slider-16.jpg", to: "/collections/dining-tables" },
  { title: "Bar Chairs", image: "collection-slider-9.jpg", to: "/collections/bar-chairs" },
];

export const searchTypes = [
  "All Categories",
  "Marble Products",
  "Accessories",
  "Armchairs",
  "Bar Stools",
  "Bowls",
  "Candles",
  "Chairs",
  "Desks",
  "Lamps",
  "Ottomans",
  "Pillows",
  "Planters",
  "Rugs",
  "Sofas",
  "Tables",
  "Towels",
  "Vases",
];

export const stores = [
  {
    city: "New York",
    name: "Cortex Studio",
    address: "128 Wooster Street, SoHo, New York, NY 10012",
    hours: "Monâ€“Sat 10â€“7, Sun 11â€“6",
    phone: "+1 212-555-0148",
  },
  {
    city: "Miami",
    name: "Cortex Miami",
    address: "382 NE 191st St #87394, Miami, FL 33179",
    hours: "Monâ€“Sat 9â€“6",
    phone: "+1 888-234-1234",
  },
  {
    city: "Los Angeles",
    name: "Cortex West",
    address: "8475 Melrose Place, West Hollywood, CA 90069",
    hours: "Tueâ€“Sat 11â€“7, Sun 12â€“5",
    phone: "+1 323-555-0190",
  },
  {
    city: "London",
    name: "Cortex Marylebone",
    address: "14 Chiltern Street, London W1U 7PJ",
    hours: "Monâ€“Sat 10â€“6",
    phone: "+44 20 7946 0321",
  },
  {
    city: "Copenhagen",
    name: "Cortex Atelier",
    address: "StudiestrÃ¦de 21, 1455 KÃ¸benhavn",
    hours: "Tueâ€“Fri 11â€“6, Sat 11â€“4",
    phone: "+45 33 12 44 90",
  },
];

export const posts = [
  {
    slug: "where-design-meets-function",
    title: "Where design meets function",
    date: "March 12, 2026",
    excerpt: "How the studio thinks about rooms that have to work on a Tuesday and still feel like a photograph on Sunday.",
    image: "home-iwt_1-v2.jpg",
    body: "We start with the way a person actually sits, reaches, and sets a cup down. The photograph comes later. Cortex pieces are drawn in New York and resolved with makers who still care about the underside of a table â€” the part nobody posts, and everybody lives with. This season we leaned into a lower line, a quieter oak, and upholstery that can take a decade of real evenings.",
  },
  {
    slug: "a-room-in-three-pieces",
    title: "A room in three pieces",
    date: "February 2, 2026",
    excerpt: "The sofa, the lamp, the table. A short argument for buying fewer things and placing them better.",
    image: "lookbook-slider-1-v2.jpg",
    body: "Most rooms do not need a collection. They need a seat you trust, a surface at the right height, and a light that does not shout. The Loop Sofa, the Swivel Table, and the Flip Lamp were designed to share a room without matching. Put them together and the space does the rest.",
  },
  {
    slug: "materials-we-keep",
    title: "Materials we keep",
    date: "January 18, 2026",
    excerpt: "Oak, wool, steel, glaze. A note on why the palette stays small.",
    image: "multicolumn-3-v2.jpg",
    body: "A small material library is a discipline. Oak that can be refinished. Wool that breathes. Steel that is meant to be seen. Glaze that is allowed to vary. We certify what we can, publish what a piece costs to make, and design for a longer lifetime rather than a louder launch.",
  },
];

export const faqs = [
  {
    q: "Do you ship internationally?",
    a: "Yes. Express shipping is free on orders over $500. Smaller orders ship at a flat rate calculated at checkout. Most pieces leave the studio within 3â€“5 business days.",
  },
  {
    q: "What is your return policy?",
    a: "Unused items can be returned within 30 days. Furniture must be in original condition. We collect large pieces from most metro areas â€” contact the studio and we will arrange it.",
  },
  {
    q: "Can I order for a project or a trade account?",
    a: "Yes. Cortex works with designers and small wholesale accounts. Use the quick order list or write to touch@Cortexstore.com with your resale certificate and we will set volume pricing.",
  },
  {
    q: "Do you offer fabric and finish samples?",
    a: "The Textura Set is a paid sample kit that is credited back on your next furniture order. Individual swatches can also be requested from any product page.",
  },
  {
    q: "How do volume prices work?",
    a: "On eligible furniture, 5 or more of the same piece save 5%, and 10 or more save 10%. The discount appears in the cart once the quantity rule is met.",
  },
  {
    q: "Where can I see pieces in person?",
    a: "Studios are open in New York, Miami, Los Angeles, London, and Copenhagen. Visit Find a Store for hours, or book a private appointment from the contact page.",
  },
];

export const testimonials = [
  {
    quote: "All products are authentic and imported from the country of origin.",
    name: "Jenny Wilson",
    place: "New Mexico",
  },
  {
    quote: "Each piece is authentic and carefully sourced from its place of origin.",
    name: "Julie Mathers",
    place: "Australia",
  },
  {
    quote: "Crafted with care using local materials, each piece reflects the character of its origin.",
    name: "John Doe",
    place: "New York",
  },
  {
    quote: "The products are artful, fun, have a story just as unique as the designers who made it.",
    name: "Jenny Wilson",
    place: "New Mexico",
  },
  {
    quote: "The best coat I have found. Great colors and materials for life style.",
    name: "Samantha Taylor",
    place: "Portland, Oregon",
  },
  {
    quote: "Every item feels like a masterpiece, blending creativity and authenticity beautifully.",
    name: "David Martinez",
    place: "Austin, Texas",
  },
];

