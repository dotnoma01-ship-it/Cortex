# Alibaba marble and decorative panel research

Research date: 2026-10-26

## Scope and publication decision

The supplied Alibaba wholesale collection page was reachable only as a shell page with no product listings. No individual Alibaba product links were included in the request. Search results exposed individual Alibaba product listings, two of which provided detailed listing content when opened. These are separate supplier listings and are not assumed to be the same product.

No products were appended to `frontend/src/data/products.json`. Supplier quotes are not Cortex retail prices, and the project has no established product-appropriate cost-plus rule. The storefront and backend require numeric retail prices; they also rely on inventory values for display and add-to-cart behavior. Cortex retail prices and Cortex inventory have not been confirmed. Publishing any candidate now would require guesses. The existing 99 catalogue products remain unchanged.

## Listing A — Shandong Baiyi New Material Technology Co., Ltd.

- Listing: [High Glossy PVC Panel UV Marble Sheet 3mm Flexible PVC Wall Panel Board](https://www.alibaba.com/product-detail/High-Glossy-Pvc-panel-UV-Marble_1600929774273.html)
- Supplier / manufacturer: Shandong Baiyi New Material Technology Co., Ltd.; Alibaba identifies it as a custom manufacturer.
- Product / model: PVC UV Marble Sheet; BY-U023.
- Material and finish: PVC resin; UV coating.
- Listing size: 1220 × 2440 mm.
- Thickness: 1.3–6 mm.
- Colours / patterns: marble, wood grain, solid colours and 3D colours; custom colours are offered. Specific selectable patterns are not fully enumerated on the page.
- Supplier pricing: USD $12 per piece for 50–99 pieces; USD $11 per piece at 100+ pieces. This is listing pricing and may require a current supplier quote.
- MOQ: 50 pieces.
- Use / installation: wall décor; the supplier description says easy to install but gives no installation method.
- Shipping: Qingdao port is listed as port of dispatch. Shipping price and destination delivery terms are not provided; confirm with supplier.
- Other listing details: warranty stated as more than 5 years; online technical support; sample price listed as $50/piece; lead time 15 days for 1–1,000 pieces, with larger quantities to be negotiated. Supplier description claims eco-friendly, fireproof, waterproof and anti-scratch; treat these as supplier claims pending substantiation.
- Images: The listing page contains a product image gallery and named images, but the retrieved page did not expose stable direct image URLs suitable for the storefront. Do not use until direct URLs or permitted project assets are verified.
- Cortex retail price: **Pending approval / costing.**
- Cortex inventory: **Unconfirmed; do not mark in stock.**

## Listing B — Haining Longtime Industry Co., Ltd.

- Listing: [Modern Home Decor Style Flexible PVC Plastic UV Marble Sheet / Artificial Marble Alternative Wall Panel & Board](https://www.alibaba.com/product-detail/Modern-Home-Decor-Style-Flexible-PVC_1601396428054.html)
- Supplier / manufacturer: Haining Longtime Industry Co., Ltd.; Alibaba identifies it as a custom manufacturer.
- Product / model: PVC / UV Marble Sheet; P-PMS-01.
- Material: listing attributes state 35% PVC, 60% calcium carbonate (CaCO3), and 5% additives. A later supplier description instead states 35% PVC, 62% CaCO3 and 3% additives; **composition conflicts and needs supplier confirmation**.
- Surface / finish: hot stamping, UV coating and PE protective film. Multiple surface finishes and treatments are described.
- Dimensions: 1220 mm wide, with lengths listed as 2440, 2800 and 2900 mm; the supplier description also offers 2800/2900 and custom sizes.
- Thickness: listing attributes give 2.5, 2.8 and 3.0 mm; the supplier description separately says 2–5 mm. **Confirm exact selectable thicknesses before creating variants.**
- Colours / patterns: marble grain, wood grain, solid colour and 3D designs; customized designs accepted. Specific colour/pattern values are not enumerated.
- Supplier pricing: USD $11.90 per piece for 50–499 pieces; USD $8.90 per piece for 500–1,499; USD $5.90 per piece at 1,500+. The listing does not state a distinct MOQ field; the first quoted tier begins at 50 pieces, so confirm MOQ directly.
- Use / installation: commercial and residential interior decoration; supplier lists aluminium frame or glue installation.
- Shipping: shipping fee and delivery date to be negotiated. A supplier description mentions 7–15 days for a 20 ft container; do not interpret this as a confirmed delivery quote or promise.
- Other listing details: 100 pieces per pallet; attributes list a five-year warranty and supplier claims of waterproof, fire-retardant, moisture-proof and wear-resistant performance. Confirm specifications/certifications for the intended market.
- Images: The listing page exposes a product image gallery, but no stable direct image URLs were verified from the retrieved page. Do not use until direct URLs or permitted project assets are verified.
- Cortex retail price: **Pending approval / costing.**
- Cortex inventory: **Unconfirmed; do not mark in stock.**

## Manual verification required

- [PVC Wall Panel 1220×2440×3mm Interior UV High Glossy PVC Marble Sheets](https://www.alibaba.com/product-detail/PVC-Wall-Panel-1220-2440-3mm_1601764166579.html): search results exposed a supplier name, price tiers and attributes, but the individual listing returned no readable detail page during this review. Verify current seller, price, currency/unit, MOQ, variants, images, shipping and specifications directly before use.
- [Wholesale PVC Marble Sheet Waterproof High Glossy ...](https://www.alibaba.com/product-detail/Wholesale-Uv-Board-Waterproof-Plastic-Sheet_1601563624711.html): search results exposed a listing with incomplete supplier and price details, but the individual listing returned no readable detail page. Requires manual verification.
- The supplied [Alibaba marble-sheet collection](https://www.alibaba.com/wholesale/marble-sheet.html) returned only navigation text, not inspectable product cards.

## Storefront findings relevant to any future addition

- The starting catalogue contains **99** product objects. A byte-for-byte backup is at `frontend/src/data/products.json.before-alibaba.bak`.
- `frontend/src/data/catalog.ts` imports and casts the JSON to the `Product` type. It expects numeric product and variant IDs, `handle`, `type`, `tags`, `images`, two-option variant values, numeric variant `price`, numeric `stock`, ratings/reviews and the other declared fields.
- Collections, filtering, search and product-detail data use the static catalogue as their initial/local source. Collection and search pages also fetch `/products?limit=100`; product details fetch `/products/:handle`.
- Backend `Product` records require a numeric variant retail `price`, numeric `stock`, SKU, handle, and at least one variant. Backend responses can replace the local product data in relevant pages. No backend changes or production API writes were made.
- A future verified product needs a Cortex-approved USD retail price and explicit Cortex inventory decision before it can be safely represented in the current public schema. Supplier prices, supplier MOQ and supplier availability belong in sourcing records, not in retail price or Cortex stock fields.

## Status

- Alibaba listings with substantive details opened and documented: **2**.
- Listings needing manual verification: **2**, plus the supplied collection page.
- New products safe to publish now: **0**.
- Cortex retail prices awaiting approval: both documented candidates.
- Product images with verified stable direct URLs: **0**.
- Backend changes necessary for this research-only result: **No**.
