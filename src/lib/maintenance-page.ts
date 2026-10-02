import { VELYN_LOCKUP_SVG } from "@/lib/maintenance-velyn-lockup";
import { site, whatsappLink } from "@/lib/site";

const wa = whatsappLink(
  "Hello Velyn, I'd like to place an order while the website is paused.",
);

const styles = `
  :root {
    --espresso: #2c1a0e;
    --espresso-deep: #1e1108;
    --gold: #bd9468;
    --gold-soft: #d7b791;
    --ivory: #f7f4ef;
    --font-serif: "EB Garamond", Garamond, "Times New Roman", serif;
    --font-sans: "Manrope", system-ui, -apple-system, "Segoe UI", sans-serif;
    color-scheme: dark;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    min-height: 100dvh;
    display: grid;
    place-items: center;
    padding: 3rem 1.25rem;
    background: var(--espresso-deep);
    background-image:
      radial-gradient(70rem 40rem at 50% -10%, rgba(189, 148, 104, 0.22), transparent 65%),
      linear-gradient(180deg, var(--espresso) 0%, var(--espresso-deep) 100%);
    color: var(--ivory);
    font-family: var(--font-sans);
    font-weight: 300;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  main { width: 100%; max-width: 40rem; text-align: center; }
  .lockup { display: block; width: min(17rem, 72vw); margin: 0 auto 3rem; }
  .lockup svg { display: block; width: 100%; height: auto; }
  .lockup svg text.cls-1, .lockup svg tspan { fill: var(--ivory); }
  .lockup svg path.cls-3 { fill: var(--ivory); }
  .lockup svg path.cls-4, .lockup svg .cls-4 { fill: var(--gold); }
  h1 {
    font-family: var(--font-serif);
    font-weight: 400;
    font-size: clamp(2.1rem, 6.5vw, 3.25rem);
    line-height: 1.12;
    letter-spacing: -0.01em;
  }
  .lede {
    margin: 1.25rem auto 0;
    max-width: 34rem;
    font-size: 1.02rem;
    color: rgba(247, 244, 239, 0.76);
  }
  .rule {
    width: 4rem;
    height: 1px;
    margin: 2.5rem auto;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 3rem;
    padding: 0 1.6rem;
    border-radius: 2px;
    border: 1px solid var(--gold);
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-decoration: none;
    white-space: nowrap;
    transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease;
  }
  .btn-primary { background: var(--gold); color: var(--espresso-deep); }
  .btn-primary:hover { background: var(--gold-soft); border-color: var(--gold-soft); }
  .btn-ghost { background: transparent; color: var(--gold-soft); }
  .btn-ghost:hover { background: rgba(189, 148, 104, 0.14); color: var(--ivory); }
  .btn:active { transform: translateY(1px); }
  .btn:focus-visible, a:focus-visible {
    outline: 2px solid var(--gold-soft);
    outline-offset: 3px;
  }
  .details {
    margin-top: 2.75rem;
    font-size: 0.9rem;
    color: rgba(247, 244, 239, 0.62);
  }
  .details a { color: rgba(247, 244, 239, 0.82); text-decoration-color: rgba(189, 148, 104, 0.6); text-underline-offset: 4px; }
  .details a:hover { color: var(--ivory); }
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
  .social a { color: var(--gold-soft); text-decoration: none; }
  .social a:hover { color: var(--ivory); text-decoration: underline; text-underline-offset: 5px; }
  footer {
    margin-top: 3.5rem;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    color: rgba(247, 244, 239, 0.38);
  }
  @media (max-width: 400px) {
    .btn { width: 100%; }
  }
`;

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
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500&family=Manrope:wght@300;500&display=swap">
<style>${styles}</style>
</head>
<body>
<main>
  <span class="lockup" role="img" aria-label="${site.name}">${VELYN_LOCKUP_SVG}</span>
  <h1>We are offline for a short while</h1>
  <p class="lede">Our online store is paused while we work on what comes next. The team is still here, and orders, wholesale enquiries and deliveries carry on as normal.</p>
  <div class="rule"></div>
  <div class="actions">
    <a class="btn btn-primary" href="${wa}">Order on WhatsApp</a>
    <a class="btn btn-ghost" href="mailto:${site.contact.email}">Email us</a>
  </div>
  <div class="details">
    <p><a href="tel:${site.contact.phoneMtn}">${site.contact.whatsappDisplay}</a> or <a href="tel:${site.contact.phoneAirtel}">+234 902 882 8977</a></p>
    <p>Mon to Fri, 9am to 5pm WAT</p>
    <p>${site.contact.address.line1}, ${site.contact.address.line2}, ${site.contact.address.city}</p>
  </div>
  <nav class="social" aria-label="Social media">
    <a href="${site.social.instagram}" rel="noopener">Instagram</a>
    <a href="${site.social.tiktok}" rel="noopener">TikTok</a>
    <a href="${site.social.facebook}" rel="noopener">Facebook</a>
  </nav>
  <footer>&copy; ${new Date().getFullYear()} ${site.legalName}</footer>
</main>
</body>
</html>`;
