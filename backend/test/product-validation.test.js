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
