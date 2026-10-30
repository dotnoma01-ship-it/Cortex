const test = require("node:test");
const assert = require("node:assert/strict");
const Product = require("../src/models/Product");

test("product model rejects negative stock and accepts catalog-shaped variants", () => {
  const product = new Product({
    externalId: "catalog-1", handle: "catalog-piece", title: "Catalog Piece", type: "Chairs", sku: "TEST-1", stock: -1,
    variants: [{ externalId: "variant-1", title: "Oak", price: 100, available: true }],
  });
  const error = product.validateSync();
  assert.ok(error?.errors.stock);

  product.stock = 2;
  assert.equal(product.validateSync(), undefined);
});

test("estimated preorder products accept zero counted stock and purchasable variants", () => {
  const product = new Product({
    externalId: "marble-preorder-1",
    handle: "marble-preorder-piece",
    title: "Marble Pre-order Piece",
    type: "Marble Products",
    sku: "MARBLE-PREORDER-1",
    stock: 0,
    inventoryPolicy: "preorder",
    priceStatus: "estimated",
    saleUnit: "piece",
    variants: [{ externalId: "marble-variant-1", title: "Standard", price: 28, available: true }],
  });

  assert.equal(product.validateSync(), undefined);
  assert.equal(product.stock, 0);
  assert.equal(product.inventoryPolicy, "preorder");
});
