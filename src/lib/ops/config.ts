/**
 * Configuration for the UltimatePOS (ops.velynbeauty.com) Connector API.
 * All secrets come from environment variables — never hard-coded.
 *
 * Required for live data (set in .env.local / Vercel project env):
 *   OPS_API_URL            e.g. https://ops.velynbeauty.com
 *   OPS_CLIENT_ID          Passport OAuth client id
 *   OPS_CLIENT_SECRET      Passport OAuth client secret
 *   OPS_USERNAME           API user (username or email)
 *   OPS_PASSWORD           API user password
 *   OPS_LOCATION_ID        (optional) business location to read stock from
 *
 * When these are absent the storefront falls back to a clearly-labelled demo
 * catalogue so the site remains fully browsable while the catalogue is being
 * imported. Toggle with OPS_DEMO_FALLBACK ("off" to force live-only).
 */

export const opsConfig = {
  baseUrl: (process.env.OPS_API_URL || "https://ops.velynbeauty.com").replace(
    /\/$/,
    "",
  ),
  clientId: process.env.OPS_CLIENT_ID || "",
  clientSecret: process.env.OPS_CLIENT_SECRET || "",
  username: process.env.OPS_USERNAME || "",
  password: process.env.OPS_PASSWORD || "",
  locationId: process.env.OPS_LOCATION_ID || "",
  /** Connector route prefix. Standard UltimatePOS is "connector/api". */
  apiPrefix: (process.env.OPS_API_PREFIX || "connector/api").replace(
    /^\/|\/$/g,
    "",
  ),
  /** Seconds to cache product data via Next's fetch revalidation. */
  revalidate: Number(process.env.OPS_REVALIDATE ?? 300),
};

/** True when all credentials needed to call the live API are present. */
export function isOpsConfigured(): boolean {
  return Boolean(
    opsConfig.clientId &&
      opsConfig.clientSecret &&
      opsConfig.username &&
      opsConfig.password,
  );
}

/** Whether to serve the demo catalogue as a fallback. Defaults on. */
export function isDemoFallbackEnabled(): boolean {
  return process.env.OPS_DEMO_FALLBACK !== "off";
}
