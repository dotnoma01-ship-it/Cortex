const assert = require("node:assert/strict");
const http = require("node:http");
const express = require("express");
const test = require("node:test");
const adminRoutes = require("../src/routes/admin");
const productRoutes = require("../src/routes/products");
const orderRoutes = require("../src/routes/orders");
const enquiryRoutes = require("../src/routes/enquiries");
const { admin } = require("../src/middleware/auth");

test("administrative API operations reject requests without a valid session", async (t) => {
  const app = express();
  app.use(express.json());
  app.use("/api/admin", adminRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/enquiries", enquiryRoutes);
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));

  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const checks = [
    ["GET", "/api/admin/dashboard"], ["GET", "/api/admin/categories"], ["GET", "/api/admin/customers"],
    ["GET", "/api/admin/inventory"], ["GET", "/api/admin/sourcing"], ["POST", "/api/products"],
    ["PATCH", "/api/products/not-a-database-id"], ["DELETE", "/api/products/not-a-database-id"],
    ["GET", "/api/orders"], ["PATCH", "/api/orders/not-a-database-id"], ["GET", "/api/enquiries"],
  ];

  for (const [method, path] of checks) {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      ...(method === "POST" || method === "PATCH" ? { body: "{}" } : {}),
    });
    assert.equal(response.status, 401, `${method} ${path} should require authentication`);
  }
});

test("admin role middleware rejects customer accounts and permits admin accounts", () => {
  const call = (role) => {
    let nextCalled = false;
    let responseStatus = 200;
    let responseBody;
    const req = { user: { role } };
    const res = { status(status) { responseStatus = status; return this; }, json(body) { responseBody = body; return this; } };
    admin(req, res, () => { nextCalled = true; });
    return { nextCalled, responseStatus, responseBody };
  };

  assert.deepEqual(call("customer"), {
    nextCalled: false,
    responseStatus: 403,
    responseBody: { success: false, message: "Administrator access is required" },
  });
  assert.equal(call("admin").nextCalled, true);
});
