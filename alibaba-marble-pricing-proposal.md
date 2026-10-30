# Cortex marble panel retail pricing scenarios

Prepared: 2026-10-26

## Decision status

These calculations are planning scenarios only. They are not approved Cortex retail prices and must not be copied into the customer-facing catalogue. The supplier quotes are listing prices and should be reconfirmed before purchase. Freight, import, domestic fulfillment, and other costs are not quoted, so no landed cost or final retail price can currently be established.

## Calculation status

No retail price is calculated here. The earlier 60% gross-margin example was illustrative only; it is not an approved Cortex policy and is removed from the calculations below. After all costs and the pricing policy are confirmed, a calculation may use:

`scenario retail = (supplier unit price + allocated freight/import/handling + other variable per-unit costs) / (1 - approved gross margin)`

No gross margin, markup, currency conversion, freight estimate, import estimate, or retail price is assumed.

## Product 1 — Shandong Baiyi New Material Technology Co., Ltd.

Source listing: [High Glossy PVC Panel UV Marble Sheet 3mm Flexible PVC Wall Panel Board](https://www.alibaba.com/product-detail/High-Glossy-Pvc-panel-UV-Marble_1600929774273.html)

| Order quantity | Supplier listing cost (USD/piece) | Cortex retail calculation |
|---|---:|---|
| 50–99 | $12.00 | Not calculated: landed/variable costs and approved policy unknown |
| 100+ | $11.00 | Not calculated: landed/variable costs and approved policy unknown |

MOQ is listed as 50 pieces. The listing states the price tiers above; request a current written quote and confirm whether the quote applies to the exact thickness/pattern selected.

## Product 2 — Haining Longtime Industry Co., Ltd.

Source listing: [Modern Home Decor Style Flexible PVC Plastic UV Marble Sheet / Artificial Marble Alternative Wall Panel & Board](https://www.alibaba.com/product-detail/Modern-Home-Decor-Style-Flexible-PVC_1601396428054.html)

| Order quantity | Supplier listing cost (USD/piece) | Cortex retail calculation |
|---|---:|---|
| 50–499 | $11.90 | Not calculated: landed/variable costs and approved policy unknown |
| 500–1,499 | $8.90 | Not calculated: landed/variable costs and approved policy unknown |
| 1,500+ | $5.90 | Not calculated: landed/variable costs and approved policy unknown |

The listing does not confirm MOQ. The first price tier begins at 50 pieces; this is not confirmation that 50 is the MOQ. Request written confirmation of MOQ and current pricing for the selected size, thickness, and finish.

## Costs still needed for landed-cost and final retail calculations

Unknown until quoted or decided:

- International freight for the intended order size, including freight mode and destination.
- Cargo insurance, export handling, port/terminal charges, and origin charges.
- Import duty, tariff classification, customs clearance/brokerage, destination port charges, and applicable taxes. Confirm with a qualified import broker for Cortex's destination and accounting treatment.
- Domestic delivery from port/warehouse to Cortex, storage, handling, and any oversize delivery surcharge.
- Packaging, pallet, sample, inspection/testing, breakage, damage, and expected waste costs.
- Any cutting, finishing, installation accessories, or labor Cortex intends to include.
- Payment processing fees, customer delivery subsidy, returns, warranty/support allowance, and other per-order variable costs.
- Approved Cortex gross margin or markup policy, and whether prices vary by size/pattern or quantity.
- Current supplier quote validity and exact product configuration for each tier.

Supplier MOQ is a purchasing constraint. It is not Cortex inventory. Do not copy it into catalogue stock.

## Alibaba image references checked

The supplier pages contain image galleries. The gallery links exposed the following Alibaba CDN references, but attempts to open them returned a cache-miss error and did not provide image content. Their successful load, suitability for Cortex's selected variant, and permission for storefront use are therefore **not verified**. These URLs are recorded for follow-up only and must not be added to product image arrays yet.

Product 1 references from its Alibaba listing:

- `https://sc04.alicdn.com/kf/H119cd8f22cac420ab0dd6f4218d54d74t/220923231/H119cd8f22cac420ab0dd6f4218d54d74t.jpg`
- `https://sc04.alicdn.com/kf/H9b7dc21b6bb74d448b1b801724bd2a97D/220923231/H9b7dc21b6bb74d448b1b801724bd2a97D.jpg`

Product 2 references from its Alibaba listing:

- `https://sc04.alicdn.com/kf/H81c9770345c4488fb43cba5512ea5022L/231465787/H81c9770345c4488fb43cba5512ea5022L.jpg`
- `https://sc04.alicdn.com/kf/H7d19b4e4e3bc4284b20e0efdebe87567Y/231465787/H7d19b4e4e3bc4284b20e0efdebe87567Y.jpg`

## Catalogue readiness

Neither product is safe to add to `frontend/src/data/products.json` yet:

- The catalogue's `Variant.price` and product `stock` are required numeric customer-facing fields. There is no safe placeholder for an unapproved retail price or unconfirmed Cortex inventory.
- Product records require at least one variant, but exact selectable panel options are not confirmed. Product 2 also has conflicting thickness and material composition.
- Product image arrays are consumed directly by catalogue cards and product pages. There are no verified, permitted, load-tested image assets to use.
- Do not use supplier prices as Cortex retail prices or supplier MOQ as Cortex stock.

The safe preparation state is to keep both records in `frontend/src/data/marble-panel-drafts.json` and keep the published catalogue unchanged until supplier configurations, product images, retail pricing, and Cortex availability are approved.
