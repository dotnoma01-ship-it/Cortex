# Marble enquiry catalogue: internal pricing and verification

Prepared 2026-10-30. Internal sourcing data only; do not copy supplier costs into customer-facing product fields. Nine enquiry-only products are now appended to the existing Cortex JSON catalogue. Their storefront price is rendered as “Enquire for Price”; the schema’s numeric price is set to zero, variant availability is false, stock is zero, and the cart rejects these handles. No supplier cost, MOQ, or freight amount is used as Cortex retail price or stock.

## Products

| Store handle | Supplier research record | Supplier listing tiers / MOQ | Product evidence |
|---|---|---|---|
| `titan-pvc-uv-marble-wall-panel` | Guangzhou Titan Commercial Co., Ltd.; [Alibaba listing 1600549156411](https://www.alibaba.com/product-detail/High-Gloss-Plastic-Sheets-Panel-De_1600549156411.html) | USD 9.80 (200–999), $9.20 (1,000–4,999), $8.70 (5,000–9,999), $7.50 (10,000+), per piece. Distinct MOQ not confirmed; the first displayed tier starts at 200. | PVC + UV coating listed; 1220 × 2440 mm; thickness 2–5 mm. Composition listed as 30% PVC, 67% CaCO3 and 3% additive. Exact selectable variants/current quote require confirmation. |
| `baiyi-pvc-uv-marble-panel` | Shandong Baiyi New Material Technology Co., Ltd.; [Alibaba listing 1600929774273](https://www.alibaba.com/product-detail/High-Glossy-Pvc-panel-UV-Marble_1600929774273.html), from the existing draft | USD 12 (50–99), $11 (100+), per piece. Listing MOQ 50 pieces. Reconfirm current quote and selected configuration. | PVC resin, UV coating, 1220 × 2440 mm, listed thickness range 1.3–6 mm. Exact selectable thickness/pattern not confirmed. |
| `longtime-flexible-pvc-uv-marble-sheet` | Haining Longtime Industry Co., Ltd.; [Alibaba listing 1601396428054](https://www.alibaba.com/product-detail/Modern-Home-Decor-Style-Flexible-PVC_1601396428054.html), from the existing draft | USD 11.90 (50–499), $8.90 (500–1,499), $5.90 (1,500+), per piece. MOQ not confirmed; first price tier starts at 50. Reconfirm current quote. | Listing describes a flexible PVC UV marble effect sheet, 1220 mm width, lengths listed as 2440/2800/2900 mm. Thickness (2–5 mm vs 2.5/2.8/3.0 mm) and composition (35/60/5 vs 35/62/3) conflict between listing sections; do not publish as settled specs. |
| `shuanglin-white-black-marble-pvc-panel` | Shouguang Shuanglin Wood Co., Ltd.; [Alibaba listing 1601018884936](https://www.alibaba.com/product-detail/Waterproof-white-and-black-marble-color_1601018884936.html) | Alibaba catalog result: USD 5.50–6.50; price unit/tier mapping must be confirmed. MOQ 100 pieces. | Listing title identifies white/black marble-color PVC wall panel. Dimensions, thickness, variants and current seller quote remain unconfirmed. |
| `haining-uv-false-marble-pvc-wall-panel` | Haining UV Decoration Material Co., Ltd.; [Alibaba listing 1600812396812](https://www.alibaba.com/product-detail/High-glossy-false-marble-stone-panel_1600812396812.html) | Alibaba catalog results: USD 9.00–9.80 each; MOQ 10 pieces. Quote validity and tiers need confirmation. | Matching title identifies PVC marble UV wall sheet; selected dimensions/thickness/pattern not visible in accessible detail page. |
| `sunny-green-marble-sintered-stone-slab` | SUNNY CERAMICS; [Alibaba listing 11000003040441](https://www.alibaba.com/product-detail/Sintered-Stone-Sheet-1200x1800mm-Floor-Slabs_11000003040441.html) | Alibaba catalog results: USD 8.90–11.50; MOQ 100 square meters. Price unit/tier mapping and quote validity need confirmation. | Listing title identifies a 1200 × 1800 mm green marble-look sintered stone/porcelain slab; details page exposed no readable specs. Thickness/options need supplier confirmation. |
| `vanstar-12mm-marble-pattern-acrylic-solid-surface` | Shenzhen Vanstar Stone Decor Co., Ltd.; [Alibaba listing 1601541209986](https://www.alibaba.com/product-detail/New-Color-12mm-Big-Slab-Artificial_1601541209986.html) | Current price tiers were not visible in retrieved listing/catalog results; supplier catalog showed MOQ 30 pieces. Request current quote. | Title and catalog result identify a 12 mm marble-pattern modified acrylic solid-surface slab. Dimensions and selectable options need confirmation. |

| `cotrustone-polished-pink-marble-slab` | Xiamen Cotrustone Imp. & Exp. Co., Ltd.; [Alibaba listing 1601028566027](https://www.alibaba.com/product-detail/Cotrustone-Polished-Pink-Marble-Slab-Indoor_1601028566027.html) | No price/MOQ confirmed for this exact listing. Related supplier catalog listings are not treated as this SKU quote. | Supplied title identifies polished pink marble slab. Exact stone type, dimensions, options and listing identity require supplier confirmation. |
| `decor-stones-monsoon-black-flexible-marble-veneer` | DECOR STONES; [Alibaba listing 10000050934991](https://www.alibaba.com/product-detail/Monsoon-Black-Flexible-Marble-Veneer-Sheets_10000050934991.html) | Alibaba supplier catalog result: USD 14–18; MOQ 250 square meters. Confirm current exact listing, price unit/tiers and quote. | Catalog result identifies Monsoon Black flexible marble stone veneer. Dimensions, construction, options, stock and freight require confirmation. |

## Retail price and checkout readiness

No Cortex retail price is confirmed for any of these seven products. Supplier price is not retail price. Freight to destination, insurance, duties/taxes, customs clearance/handling, local delivery, packaging, payment processing and an approved margin policy are missing. No conversion is calculated because no pricing currency/rate policy was provided; catalog quotes shown are in USD. Stock is not verified. No retail scenario or gross margin is supportable until current configuration-specific quotes, destination landed costs, Cortex price approval and actual saleable inventory are established. All seven remain enquiry-only.

## Costs and retail scenarios

All source tiers are shown in USD; no currency conversion is required. The existing two drafts and the readable Alibaba page do not establish current quote validity or exact chosen configurations. International freight, insurance, export/origin charges, import duty and taxes, customs brokerage/clearance, destination port/handling, local delivery, oversize charges, packaging/pallet costs, breakage allowance, inspection, payment-processing costs, customer delivery subsidy, returns/warranty allowance, and any installation/accessory costs are unknown. Destination and tariff classification are not confirmed.

No retail scenarios, gross profit, or gross margin are calculated: landed/variable costs and Cortex’s approved margin policy are missing. Request itemized quotes for the exact size/thickness/pattern, order quantity, destination and delivery terms; then apply an approved Cortex pricing rule. Supplier MOQ is not Cortex inventory.

## Image status

None of the seven products has a verified stable direct gallery image with confirmed variant match and permission for Cortex storefront reuse. The catalogue points to `/images/marble-product-placeholder.svg`, which is visibly labeled as a placeholder. No Alibaba CDN or unrelated supplier image is presented to shoppers. See the [internal image audit](</C:/Users/USER/Downloads/replicate-hyper-shopify-theme/alibaba-marble-image-audit.md>).

## Outstanding supplier checks

- Reconfirm seller and live listing status, product configuration, price validity and MOQ for each supplier.
- Confirm exact selectable sizes, thicknesses, colours/patterns and material composition, especially the conflicting Longtime values.
- Obtain destination freight and import/clearance estimates, permitted stable product images, and image-use authorization.
- Approve Cortex retail pricing and actual stock before changing any enquiry-only product to purchasable.

The other 40 distinct URLs from the earlier 47-listing manifest remain unresolved or excluded, as recorded in [the bulk audit](</C:/Users/USER/Downloads/replicate-hyper-shopify-theme/alibaba-marble-bulk-audit-2026-10-30.md>). They were not converted into catalogue products from URL slugs.
