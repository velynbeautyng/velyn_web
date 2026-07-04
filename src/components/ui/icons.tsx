import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconMenu = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const IconClose = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconBag = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 8h12l-1 12H7L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const IconSearch = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

export const IconArrowRight = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconCheck = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 12.5 9 17.5 20 6.5" />
  </svg>
);

export const IconMail = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const IconPhone = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 3h3l1.5 5-2 1.5a11 11 0 0 0 5 5L19 17l-1.5 4a2 2 0 0 1-2 1A16 16 0 0 1 2 5a2 2 0 0 1 1-2Z" />
  </svg>
);

export const IconPin = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 21s7-6.5 7-11a7 7 0 0 0-14 0c0 4.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const IconChevronDown = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const IconPlus = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
);

export const IconTrash = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13" />
  </svg>
);

export const IconShield = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const IconTruck = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </svg>
);

export const IconLeaf = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 20c0-8 6-14 16-14 0 10-6 16-16 14Z" />
    <path d="M9 15c2-3 5-5 8-6" />
  </svg>
);

export const IconInstagram = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.5" />
    <circle cx="17" cy="7" r="0.6" fill="currentColor" />
  </svg>
);

export const IconTiktok = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M14 4v9.5a3.5 3.5 0 1 1-3-3.46" />
    <path d="M14 4c.4 2.4 2 4 4.5 4.2" />
  </svg>
);

export const IconFacebook = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2l1-3h-3V8.5A.5.5 0 0 1 14.5 8Z" />
  </svg>
);

export const IconWhatsapp = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 20l1.4-4A8 8 0 1 1 9 19.5L4 20Z" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.7 0 1.2-.6 1.2-.6l-1.4-1-1.3.7c-1-.5-2-1.4-2.4-2.5l.7-1.2-1-1.4s-.6.5-.6 1.2Z" />
  </svg>
);
