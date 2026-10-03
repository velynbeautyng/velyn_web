import Link from "next/link";
import { footerNav, site } from "@/lib/site";
import { NuveneLockup } from "@/components/brand/nuvene-logo";
import { IconFacebook, IconInstagram, IconTiktok } from "@/components/ui/icons";

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
    <footer className="bg-ink-surface text-linen">
      <div className="section py-14">
        <div className="grid gap-10 border-b border-gold/15 pb-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <NuveneLockup tone="linen" className="h-11 w-auto" />
            <p className="mt-5 text-sm leading-relaxed text-linen/75">
              Helping women and men feel confident, radiant and cared for every
              day. Original skincare, honestly sourced, delivered with care.
            </p>
            <div className="mt-5 flex gap-2.5">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center border border-gold/25 text-gold transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                >
                  <Icon width={16} height={16} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-linen/75 transition-colors hover:text-white"
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
          <p className="text-xs text-linen/65">
            © {new Date().getFullYear()} {site.legalName}. All rights reserved. Abuja, Nigeria.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="text-xs text-linen/65 hover:text-white">
              Privacy policy
            </Link>
            <Link href="/terms" className="text-xs text-linen/65 hover:text-white">
              Terms of use
            </Link>
            <Link href="/authenticity" className="text-xs text-linen/65 hover:text-white">
              Sourcing promise
            </Link>
          </div>
        </div>

        <p className="mt-6 border-t border-gold/15 pt-6 text-center text-xs text-linen/65">
          Built with{" "}
          <span role="img" aria-label="love">
            ❤️
          </span>{" "}
          by{" "}
          <a
            href="https://www.phoenixitng.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gold transition-colors hover:text-white"
          >
            PhoenixITNg
          </a>
        </p>
      </div>
    </footer>
  );
}
