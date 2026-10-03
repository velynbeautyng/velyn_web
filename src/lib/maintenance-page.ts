import { LOGO_ICON, LOGO_STACKED } from "@/components/brand/nuvene-logo-paths";
import { site } from "@/lib/site";

const { contact, social } = site;

const wa = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
  "Hello Nuvene, I'd like to place an order while the website is paused.",
)}`;

// URL-encoded rather than base64 so the page builds without Buffer in any runtime.
const favicon = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#E1DAC6"/><svg x="76" y="76" width="360" height="360" viewBox="${LOGO_ICON.viewBox}" style="--logo-mark:#4F6A54">${LOGO_ICON.body}</svg></svg>`,
)}`;

const styles = `
  :root {
    --ink: #000000;
    --ink-lift: #242424;
    --linen: #e1dac6;
    --linen-soft: #efeadd;
    --sage: #708e74;
    --sage-deep: #435e49;
    --stone: #5f5a50;
    --font-display: "Cinzel", "Times New Roman", serif;
    --font-sans: "Poppins", system-ui, -apple-system, "Segoe UI", sans-serif;
    color-scheme: light;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    min-height: 100dvh;
    display: grid;
    place-items: center;
    padding: 3rem 1.25rem;
    background: var(--linen-soft);
    background-image: radial-gradient(60rem 36rem at 50% -12%, rgba(112, 142, 116, 0.18), transparent 65%);
    color: var(--ink);
    font-family: var(--font-sans);
    font-weight: 300;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
  }
  main { width: 100%; max-width: 40rem; text-align: center; }
  .lockup { display: block; width: min(15rem, 66vw); margin: 0 auto 2.75rem; --logo-mark: var(--sage); --logo-word: var(--ink); }
  .lockup svg { display: block; width: 100%; height: auto; }
  h1 {
    font-family: var(--font-display);
    font-weight: 500;
    font-size: clamp(1.9rem, 6vw, 2.9rem);
    line-height: 1.15;
    letter-spacing: 0.02em;
  }
  .lede { margin: 1.25rem auto 0; max-width: 33rem; font-size: 1rem; color: var(--stone); }
  .rule { width: 4rem; height: 1px; margin: 2.5rem auto; background: var(--sage); }
  .actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 3rem;
    padding: 0 1.6rem;
    border-radius: 999px;
    border: 1px solid var(--ink);
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: none;
    white-space: nowrap;
    transition: background-color 0.2s ease, color 0.2s ease, transform 0.16s ease;
  }
  .btn-primary { background: var(--ink); color: var(--linen-soft); }
  .btn-primary:hover { background: var(--ink-lift); }
  .btn-ghost { background: transparent; color: var(--ink); }
  .btn-ghost:hover { background: var(--linen); }
  .btn:active { transform: scale(0.98); }
  .btn:focus-visible, a:focus-visible { outline: 2px solid var(--sage-deep); outline-offset: 3px; }
  .details { margin-top: 2.75rem; font-size: 0.9rem; color: var(--stone); }
  .details a { color: var(--ink); text-decoration-color: var(--sage); text-underline-offset: 4px; }
  .details p + p { margin-top: 0.4rem; }
  .social {
    margin-top: 2.25rem;
    display: flex;
    justify-content: center;
    gap: 1.75rem;
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .social a { color: var(--sage-deep); text-decoration: none; }
  .social a:hover { color: var(--ink); text-decoration: underline; text-underline-offset: 5px; }
  footer { margin-top: 3.5rem; font-size: 0.72rem; letter-spacing: 0.08em; color: var(--stone); }
  @media (max-width: 400px) { .btn { width: 100%; } }
  @media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
`;

const phones = contact.phones
  .map((p) => `${p.label} <a href="tel:${p.tel}">${p.display}</a>`)
  .join(" &middot; ");

/**
 * Standalone holding page served by the proxy while MAINTENANCE_MODE is on.
 * Self-contained on purpose: it never touches the storefront's layout, cart or
 * data layer, so it keeps working no matter what state the app is in.
 */
export const maintenancePage = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${site.name}, back shortly</title>
<meta name="description" content="${site.name} is briefly offline. Orders and enquiries continue on WhatsApp, phone and email.">
<link rel="icon" href="${favicon}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500&family=Poppins:wght@300;500&display=swap">
<style>${styles}</style>
</head>
<body>
<main>
  <span class="lockup"><svg viewBox="${LOGO_STACKED.viewBox}" role="img" aria-label="${site.name}">${LOGO_STACKED.body}</svg></span>
  <h1>We'll be back shortly</h1>
  <p class="lede">Our online shop is paused for a little while. You can still order from us on WhatsApp, by phone or by email, and deliveries carry on as normal.</p>
  <div class="rule"></div>
  <div class="actions">
    <a class="btn btn-primary" href="${wa}">Order on WhatsApp</a>
    <a class="btn btn-ghost" href="mailto:${contact.email}">Email us</a>
  </div>
  <div class="details">
    <p>${phones}</p>
    <p>${contact.hours}</p>
    <p>${contact.address.line1}, ${contact.address.line2}, ${contact.address.city}</p>
  </div>
  <nav class="social" aria-label="Social media">
    <a href="${social.instagram}" rel="noopener">Instagram</a>
    <a href="${social.tiktok}" rel="noopener">TikTok</a>
    <a href="${social.facebook}" rel="noopener">Facebook</a>
  </nav>
  <footer>&copy; ${new Date().getFullYear()} ${site.legalName}</footer>
</main>
</body>
</html>`;
