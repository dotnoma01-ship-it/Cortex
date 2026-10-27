# Cortex backend local development

## Local development administrator

The local-only development administrator uses:

- Email: `admin@cortex.local`
- Password: `CortexAdmin@2026!`

These are development credentials only. **Never use them in production or point the provisioning command at production data.** The provisioning command is never run automatically during server startup.

Before provisioning, configure `backend/.env` to use all of the following:

- `NODE_ENV=development`
- `MONGODB_URI` pointing to a local MongoDB database named `cortex_dev` (host must be `localhost`, `127.0.0.1`, or `::1`; the command rejects Atlas and other remote hosts)
- `CORTEX_ALLOW_DEV_ADMIN_PROVISIONING=true` as an explicit one-time opt-in

Then run `npm run provision:dev-admin` from `backend/`. The command uses the existing `User` model and bcryptjs with 12 rounds. It creates the account only when the email is unused. It does not reset an existing admin password, and it refuses to change an existing non-admin account. It prints no password, token, or database connection string.

Sign in through the existing frontend at `/admin/login`; authentication uses the standard `/api/auth/login` endpoint and the same bearer token and admin-role checks as other accounts. Public registration continues to create customer accounts only.

## One-time administrator provisioning for the existing Render backend

The separate `npm run provision:render-admin-once` command is an explicit database write. It is not called by application startup, deployment hooks, or HTTP routes. Do not run it until the intended Render service and its configured database have been verified in the Render dashboard. Never use this procedure against an unintended or production database.

The command requires all of these confirmations in the authorized Render service shell:

- Render's built-in `RENDER=true` marker.
- `CORTEX_ADMIN_PROVISION_ONCE=CREATE_CORTEX_ADMIN_ONCE` as the one-time opt-in.
- `CORTEX_ADMIN_PROVISION_CONFIRM_EMAIL=admin@cortex.local`.
- `CORTEX_ADMIN_PROVISION_CONFIRM_RENDER_SERVICE_ID` equal to that shell's built-in `RENDER_SERVICE_ID`.
- `CORTEX_ADMIN_PROVISION_CONFIRM_DATABASE` equal to the database name in that service's existing `MONGODB_URI`.

The script verifies these values before connecting, uses that service's existing `MONGODB_URI`, and writes no URI or credentials to logs. It refuses an existing account with the target email without changing any fields. The existing local-only `provision:dev-admin` command remains loopback-only.

After this code is deployed to the intended backend service and the database name and Render service ID have been checked privately, run the following from its authorized Render shell, replacing only the two angle-bracket placeholders with values read in the dashboard (never paste either value into chat):

```sh
CORTEX_ADMIN_PROVISION_ONCE=CREATE_CORTEX_ADMIN_ONCE \
CORTEX_ADMIN_PROVISION_CONFIRM_EMAIL=admin@cortex.local \
CORTEX_ADMIN_PROVISION_CONFIRM_DATABASE='<EXACT_DATABASE_NAME>' \
CORTEX_ADMIN_PROVISION_CONFIRM_RENDER_SERVICE_ID='<EXACT_RENDER_SERVICE_ID>' \
npm run provision:render-admin-once
```

Run it once. If the email already exists, stop; this command deliberately does not reset its password or change its role. The normal `/auth/login` and admin authorization checks remain in force.
