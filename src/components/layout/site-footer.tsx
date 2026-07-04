import Link from "next/link";
import { footerNav, site } from "@/lib/site";
import { VelynMark } from "@/components/brand/velyn-mark";
import {
  IconFacebook,
  IconInstagram,
  IconTiktok,
} from "@/components/ui/icons";

const socials = [
  { label: "Instagram", href: site.social.instagram, Icon: IconInstagram },
  { label: "TikTok", href: site.social.tiktok, Icon: IconTiktok },
  { label: "Facebook", href: site.social.facebook, Icon: IconFacebook },
];

const columns = [
  { title: "Explore", links: footerNav.explore },
  { title: "Business", links: footerNav.business },
  { title: "Support", links: footerNav.support },
];

export function SiteFooter() {
  return (
    <footer className="bg-espresso-surface text-ivory">
      <div className="section py-14">
        <div className="grid gap-10 border-b border-gold/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <VelynMark className="h-9 w-auto" tone="gold" />
              <div className="leading-none">
                <div className="font-serif text-xl tracking-[0.14em] text-ivory">
                  VELYN
                </div>
                <div className="mt-1 text-[0.5rem] uppercase tracking-[0.22em] text-gold">
                  Beauty &amp; Essentials
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ivory/40">
              Helping women &amp; men feel confident, radiant &amp; cared for
              every day. Authentic skincare, sourced with integrity, delivered
              with care.
            </p>
            <div className="mt-5 flex gap-2.5">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center border border-gold/15 bg-gold/[0.04] text-gold transition-colors hover:border-gold/40 hover:bg-gold/10"
                >
                  <Icon width={16} height={16} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-gold">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ivory/40 transition-colors hover:text-ivory"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-3 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-ivory/20">
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
            Abuja, Nigeria.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-xs text-ivory/20 hover:text-ivory/50">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-ivory/20 hover:text-ivory/50">
              Terms of Use
            </Link>
            <Link
              href="/authenticity"
              className="text-xs text-ivory/20 hover:text-ivory/50"
            >
              Authenticity Guarantee
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
