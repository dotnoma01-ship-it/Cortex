require("dotenv").config({ path: require("node:path").resolve(__dirname, "../../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { DEVELOPMENT_ADMIN, PASSWORD_HASH_ROUNDS } = require("./devAdminCredentials");

const REQUIRED_OPT_IN = "CREATE_CORTEX_ADMIN_ONCE";
const REQUIRED_CONFIRMATION_EMAIL = DEVELOPMENT_ADMIN.email;

class ProvisioningRefusedError extends Error {}

function confirmRenderTarget(env) {
  if (env.RENDER !== "true") {
    throw new ProvisioningRefusedError("Refusing to provision: run this command from the authorized Render service shell.");
  }
  if (env.CORTEX_ADMIN_PROVISION_ONCE !== REQUIRED_OPT_IN) {
    throw new ProvisioningRefusedError("Refusing to provision: the one-time opt-in is missing or invalid.");
  }
  if (env.CORTEX_ADMIN_PROVISION_CONFIRM_EMAIL !== REQUIRED_CONFIRMATION_EMAIL) {
    throw new ProvisioningRefusedError("Refusing to provision: the confirmed administrator email does not match.");
  }
  if (!env.RENDER_SERVICE_ID || env.CORTEX_ADMIN_PROVISION_CONFIRM_RENDER_SERVICE_ID !== env.RENDER_SERVICE_ID) {
    throw new ProvisioningRefusedError("Refusing to provision: the confirmed Render service ID does not match this service.");
  }
  if (!env.MONGODB_URI) {
    throw new ProvisioningRefusedError("Refusing to provision: the backend database setting is missing.");
  }

  let uri;
  try {
    uri = new URL(env.MONGODB_URI);
  } catch {
    throw new ProvisioningRefusedError("Refusing to provision: the configured database target is invalid.");
  }
  if (!["mongodb:", "mongodb+srv:"].includes(uri.protocol) || !uri.hostname || ["localhost", "127.0.0.1", "[::1]"].includes(uri.hostname)) {
    throw new ProvisioningRefusedError("Refusing to provision: the configured database target is not a remote MongoDB target.");
  }

  let databaseName;
  try {
    databaseName = decodeURIComponent(uri.pathname.replace(/^\//, "").split("/")[0]);
  } catch {
    throw new ProvisioningRefusedError("Refusing to provision: the configured database name is invalid.");
  }
  if (!databaseName || env.CORTEX_ADMIN_PROVISION_CONFIRM_DATABASE !== databaseName) {
    throw new ProvisioningRefusedError("Refusing to provision: the confirmed database name does not match the configured target.");
  }

  return { databaseName };
}

async function provisionRenderAdmin({
  env = process.env,
  mongo = mongoose,
  userModel = User,
  passwordHash = (value, rounds) => bcrypt.hash(value, rounds),
} = {}) {
  const target = confirmRenderTarget(env);
  let connectionAttempted = false;
  try {
    connectionAttempted = true;
    await mongo.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

    const existing = await userModel.findOne({ email: DEVELOPMENT_ADMIN.email });
    if (existing) {
      throw new ProvisioningRefusedError("Administrator email already exists; no account fields were changed.");
    }

    const hashedPassword = await passwordHash(DEVELOPMENT_ADMIN.password, PASSWORD_HASH_ROUNDS);
    await userModel.create({
      name: DEVELOPMENT_ADMIN.name,
      email: DEVELOPMENT_ADMIN.email,
      password: hashedPassword,
      role: "admin",
    });
    return { status: "created", databaseName: target.databaseName };
  } finally {
    if (connectionAttempted) await mongo.disconnect();
  }
}

if (require.main === module) {
  provisionRenderAdmin()
    .then(() => console.log("Administrator provisioning completed."))
    .catch(async (error) => {
      if (mongoose.connection.readyState !== 0) await mongoose.disconnect().catch(() => undefined);
      if (error instanceof ProvisioningRefusedError) console.error(error.message);
      else console.error("Administrator provisioning failed. No sensitive details were logged.");
      process.exitCode = 1;
    });
}

module.exports = { ProvisioningRefusedError, confirmRenderTarget, provisionRenderAdmin };
