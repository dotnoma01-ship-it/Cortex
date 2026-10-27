const DEVELOPMENT_ADMIN = Object.freeze({
  name: "Cortex Development Admin",
  email: "admin@cortex.local",
  password: "CortexAdmin@2026!",
});

const PASSWORD_HASH_ROUNDS = 12;

module.exports = { DEVELOPMENT_ADMIN, PASSWORD_HASH_ROUNDS };
