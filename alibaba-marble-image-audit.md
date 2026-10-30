# Marble catalogue image audit

Research date: 2026-10-30; storefront image verification and follow-up retrieval attempts: 2026-10-30. The client authorized Alibaba supplier-image reuse in the project instructions. Six exact product listings now have verified images: three use their verified direct listing images, and Cotrustone, Monsoon, and Vanstar each have six images downloaded locally from their exact listing pages. Three other listings remain unresolved after repeated direct-page and Alibaba search attempts. Supplier-specific license terms were not independently reviewed.

## Counts

- Supplier images collected locally: 18 (six each from Cotrustone, Monsoon, and Vanstar listing galleries)
- Distinct exact-listing images verified in the storefront: 21
- Products with verified listing images: 6 of 9
- Supplier-specific license terms independently verified: 0
- Rejected: 0
- Products with multiple verified gallery images: 3 (six each for Cotrustone, Monsoon, and Vanstar)
- Products using the local placeholder: 3
- Products with no verified listing image: 3

## Product-level record

The placeholder `/images/marble-product-placeholder.svg` is a Cortex-generated graphic, not a supplier photograph. It remains on the six products with no verified listing image and is explicitly labeled as unavailable. Supplier listing links are recorded in `alibaba-marble-enquiry-catalogue-pricing.md` and `alibaba-marble-bulk-audit-2026-10-30.md`.

| Product | Supplier | Local image | Source listing | Image quality / association | Reuse status | Approval evidence / outstanding |
|---|---|---|---|---|---|---|
| High Gloss PVC UV Marble Wall Panel | Guangzhou Titan Commercial Co., Ltd. | `https://s.alicdn.com/@sc04/kf/H7cd77ad85dc241aa80ea231408e90f9c2.jpg_720x720q50.jpg` | Alibaba 1600549156411 | Matching white marble-effect panel image; loaded at 720px in product card, category strip, and detail page | CLIENT AUTHORIZED; VERIFIED | One image available in supplied gallery material; supplier-specific license terms not independently checked |
| High Glossy PVC UV Marble Panel | Shandong Baiyi New Material Technology Co., Ltd. | `https://s.alicdn.com/@sc04/kf/H9d6179312bbe4a5e87d2125782b172eeW.jpg_960x960q80.jpg` | Alibaba 1600929774273 | Matching stack of UV marble panels; loaded at 800px in product card, category strip, and detail page | CLIENT AUTHORIZED; VERIFIED | One image available in supplied gallery material; supplier-specific license terms not independently checked |
| Flexible PVC UV Marble Effect Wall Panel | Haining Longtime Industry Co., Ltd. | `https://s.alicdn.com/@sc01/kf/He0b134b013da4190865cf5442bf26bddZ.jpg_720x720q50.jpg` | Alibaba 1601396428054 | Flexible decorative sheet samples; loaded at 720px in product card, category strip, and detail page | CLIENT AUTHORIZED; VERIFIED | One image available in supplied gallery material; supplier-specific license terms not independently checked |
| White and Black Marble Color PVC Wall Panel | Shouguang Shuanglin Wood Co., Ltd. | `marble-product-placeholder.svg` | Alibaba 1601018884936 | Direct listing still CAPTCHA-blocked; title/supplier search returned other listing IDs and no exact Shuanglin gallery match | CLIENT AUTHORIZED; IMAGE UNRESOLVED | Keep placeholder; search thumbnails rejected because exact listing association was absent |
| High Glossy False Marble Stone Panel UV Sheet | Haining UV Decoration Material Co., Ltd. | `marble-product-placeholder.svg` | Alibaba 1600812396812 | Direct listing still CAPTCHA-blocked; title/supplier search returned other listing IDs and no exact Haining gallery match | CLIENT AUTHORIZED; IMAGE UNRESOLVED | Keep placeholder; similar PVC/UV images belong to different listing IDs |
| Green Marble Sintered Stone Slab | SUNNY CERAMICS | `marble-product-placeholder.svg` | Alibaba 11000003040441 | Direct listing and exact-ID query remain inaccessible; title search returned other slab listing IDs and no exact SUNNY listing match | CLIENT AUTHORIZED; IMAGE UNRESOLVED | Keep placeholder; similar green slab images were not tied to this listing |
| 12mm Marble Pattern Modified Acrylic Solid Surface Slab | Shenzhen Vanstar Stone Decor Co., Ltd. | `/images/marble/vanstar-acrylic-solid-surface-01.jpg` through `-06.jpg` | Alibaba 1601541209986 | Six images extracted from the exact listing gallery; white/gray veined slabs visually match the title; all local JPEGs load in desktop and mobile product galleries | CLIENT AUTHORIZED; VERIFIED | Six matching image assets stored locally; thumbnail selection verified |
| Cotrustone Polished Pink Marble Slab | Xiamen Cotrustone Imp. & Exp. Co., Ltd. | `/images/marble/cotrustone-polished-pink-01.jpg` through `-06.jpg` | Alibaba 1601028566027 | Six exact gallery images verified on listing page; lead image matches polished pink marble slab; all downloaded JPEGs load in desktop and mobile product galleries | CLIENT AUTHORIZED; VERIFIED | Six matching image assets stored locally; thumbnail selection verified |
| Monsoon Black Flexible Marble Stone Veneer | DECOR STONES | `/images/marble/monsoon-black-veneer-01.jpg` through `-06.jpg` | Alibaba 10000050934991 | Six exact gallery images verified on listing page; lead image matches dark flexible stone veneer; all downloaded JPEGs load in desktop and mobile product galleries | CLIENT AUTHORIZED; VERIFIED | Six matching image assets stored locally; thumbnail selection verified |

The three existing remote image URLs above are from their respective matching Alibaba galleries and remain unchanged. The Cotrustone, Monsoon, and Vanstar image sets were captured directly from the image elements in their exact listing pages, visually checked against each listing, and stored as local JPEGs. All 18 local images load on their matching desktop and mobile detail pages, and thumbnail selection updates the main image. The three remaining exact listings are unresolved: Shuanglin White and Black PVC Panel (1601018884936), Haining False Marble UV Sheet (1600812396812), and SUNNY Green Sintered Stone Slab (11000003040441). Their direct pages are CAPTCHA-blocked; Alibaba exact-ID/title searches returned other product IDs, so those images were not reassigned. Client authorization was provided, but supplier-specific license terms remain outside this audit.
