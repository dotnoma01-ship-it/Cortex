const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");
const { DEVELOPMENT_ADMIN, PASSWORD_HASH_ROUNDS } = require("../src/scripts/devAdminCredentials");
const { confirmRenderTarget, provisionRenderAdmin } = require("../src/scripts/provisionRenderAdminOnce");

function validEnv(overrides = {}) {
  return {
    RENDER: "true",
    RENDER_SERVICE_ID: "srv-cortex-backend-test",
    MONGODB_URI: "mongodb+srv://db.example.invalid/cortex_live?retryWrites=true",
    CORTEX_ADMIN_PROVISION_ONCE: "CREATE_CORTEX_ADMIN_ONCE",
    CORTEX_ADMIN_PROVISION_CONFIRM_EMAIL: "admin@cortex.local",
    CORTEX_ADMIN_PROVISION_CONFIRM_RENDER_SERVICE_ID: "srv-cortex-backend-test",
    CORTEX_ADMIN_PROVISION_CONFIRM_DATABASE: "cortex_live",
    ...overrides,
  };
}

function fakeMongo() {
  return {
    connected: false,
    disconnected: false,
    uri: null,
    async connect(uri) { this.connected = true; this.uri = uri; },
    async disconnect() { this.disconnected = true; },
  };
}

test("Render provisioning requires explicit one-time opt-in and target confirmations before connecting", async () => {
  const mongo = fakeMongo();
  await assert.rejects(provisionRenderAdmin({ env: validEnv({ CORTEX_ADMIN_PROVISION_ONCE: "" }), mongo }), /one-time opt-in/);
  await assert.rejects(provisionRenderAdmin({ env: validEnv({ RENDER: "false" }), mongo }), /Render service shell/);
  await assert.rejects(provisionRenderAdmin({ env: validEnv({ CORTEX_ADMIN_PROVISION_CONFIRM_DATABASE: "other_db" }), mongo }), /database name/);
  await assert.rejects(provisionRenderAdmin({ env: validEnv({ CORTEX_ADMIN_PROVISION_CONFIRM_RENDER_SERVICE_ID: "other-service" }), mongo }), /service ID/);
  assert.equal(mongo.connected, false);
});

test("an existing email stops without hashing, creating, or changing any account fields", async () => {
  for (const role of ["customer", "admin"]) {
    const mongo = fakeMongo();
    const existing = { email: DEVELOPMENT_ADMIN.email, role, password: "unchanged", name: "Existing account" };
    let createCalls = 0;
    let hashCalls = 0;
    const model = {
      async findOne() { return existing; },
      async create() { createCalls += 1; },
    };
    await assert.rejects(provisionRenderAdmin({
      env: validEnv(), mongo, userModel: model,
      passwordHash: async () => { hashCalls += 1; return "unused"; },
    }), /already exists/);
    assert.deepEqual(existing, { email: DEVELOPMENT_ADMIN.email, role, password: "unchanged", name: "Existing account" });
    assert.equal(hashCalls, 0);
    assert.equal(createCalls, 0);
    assert.equal(mongo.disconnected, true);
  }
});

test("an unused email creates only the hashed admin User record and closes the connection", async () => {
  const mongo = fakeMongo();
  let createdDocument;
  const model = {
    async findOne() { return null; },
    async create(document) { createdDocument = document; },
  };
  const result = await provisionRenderAdmin({ env: validEnv(), mongo, userModel: model });

  assert.equal(result.status, "created");
  assert.equal(createdDocument.name, DEVELOPMENT_ADMIN.name);
  assert.equal(createdDocument.email, DEVELOPMENT_ADMIN.email);
  assert.equal(createdDocument.role, "admin");
  assert.deepEqual(Object.keys(createdDocument).sort(), ["email", "name", "password", "role"]);
  assert.equal(await bcrypt.compare(DEVELOPMENT_ADMIN.password, createdDocument.password), true);
  assert.equal(PASSWORD_HASH_ROUNDS, 12);
  assert.equal(mongo.uri, validEnv().MONGODB_URI);
  assert.equal(mongo.disconnected, true);
});

test("invalid confirmation and local database targets never connect", () => {
  assert.throws(() => confirmRenderTarget(validEnv({ CORTEX_ADMIN_PROVISION_CONFIRM_EMAIL: "other@example.test" })), /email/);
  assert.throws(() => confirmRenderTarget(validEnv({ MONGODB_URI: "mongodb://localhost:27017/cortex_live" })), /remote MongoDB/);
});
