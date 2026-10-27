require("dotenv").config({ path: require("node:path").resolve(__dirname, "../../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { DEVELOPMENT_ADMIN, PASSWORD_HASH_ROUNDS } = require("./devAdminCredentials");

function isSafeDevelopmentDatabase({ nodeEnv, allowProvisioning, mongoUri }) {
  if (nodeEnv !== "development" || allowProvisioning !== "true" || !mongoUri) return false;

  try {
    const target = new URL(mongoUri);
    const localHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);
    const databaseName = decodeURIComponent(target.pathname.replace(/^\//, "").split("/")[0]);
    return target.protocol === "mongodb:" && localHosts.has(target.hostname) && databaseName === "cortex_dev";
  } catch {
    return false;
  }
}

async function provision() {
  if (!isSafeDevelopmentDatabase({
    nodeEnv: process.env.NODE_ENV,
    allowProvisioning: process.env.CORTEX_ALLOW_DEV_ADMIN_PROVISIONING,
    mongoUri: process.env.MONGODB_URI,
  })) {
    throw new Error("Refusing to provision: configure an isolated local cortex_dev database, NODE_ENV=development, and CORTEX_ALLOW_DEV_ADMIN_PROVISIONING=true.");
  }

  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  try {
    const existing = await User.findOne({ email: DEVELOPMENT_ADMIN.email });
    if (existing) {
      if (existing.role !== "admin") {
        throw new Error("Provisioning conflict: this email already belongs to a non-admin account. No account was changed.");
      }
      console.log("Development administrator already exists; no account or password was changed.");
      return;
    }

    const passwordHash = await bcrypt.hash(DEVELOPMENT_ADMIN.password, PASSWORD_HASH_ROUNDS);
    await User.create({
      name: DEVELOPMENT_ADMIN.name,
      email: DEVELOPMENT_ADMIN.email,
      password: passwordHash,
      role: "admin",
    });
    console.log("Development administrator created in the isolated local database.");
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  provision().catch(async (error) => {
    // Never print connection settings, credentials, or database driver details.
    console.error(error.message.startsWith("Provisioning conflict:") || error.message.startsWith("Refusing to provision:")
      ? error.message
      : "Development administrator provisioning failed. Check the isolated local database and backend configuration.");
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect().catch(() => undefined);
    process.exitCode = 1;
  });
}

module.exports = { DEVELOPMENT_ADMIN, isSafeDevelopmentDatabase, provision };
