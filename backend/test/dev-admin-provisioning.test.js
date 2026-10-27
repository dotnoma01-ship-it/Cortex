const test = require("node:test");
const assert = require("node:assert/strict");
const { isSafeDevelopmentDatabase } = require("../src/scripts/provisionDevAdmin");

test("development admin provisioning requires explicit local development safeguards", () => {
  const base = {
    nodeEnv: "development",
    allowProvisioning: "true",
    mongoUri: "mongodb://localhost:27017/cortex_dev",
  };

  assert.equal(isSafeDevelopmentDatabase(base), true);
  assert.equal(isSafeDevelopmentDatabase({ ...base, nodeEnv: "production" }), false);
  assert.equal(isSafeDevelopmentDatabase({ ...base, allowProvisioning: "false" }), false);
  assert.equal(isSafeDevelopmentDatabase({ ...base, mongoUri: "mongodb://localhost:27017/production" }), false);
  assert.equal(isSafeDevelopmentDatabase({ ...base, mongoUri: "mongodb+srv://example.invalid/cortex_dev" }), false);
  assert.equal(isSafeDevelopmentDatabase({ ...base, mongoUri: "mongodb://db.example.invalid/cortex_dev" }), false);
});
