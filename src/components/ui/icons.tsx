import type { SVGProps } from "react";
import {
  ArrowRightIcon,
  CaretDownIcon,
  CheckIcon,
  EnvelopeSimpleIcon,
  FacebookLogoIcon,
  GlobeHemisphereEastIcon,
  HandbagIcon,
  InstagramLogoIcon,
  LeafIcon,
  ListIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MinusIcon,
  PhoneIcon,
  PlusIcon,
  ShieldCheckIcon,
  StorefrontIcon,
  TiktokLogoIcon,
  TrashIcon,
  TruckIcon,
  UserIcon,
  WhatsappLogoIcon,
  XIcon,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";

type IconProps = Omit<SVGProps<SVGSVGElement>, "ref">;

// Call sites still pass the width/height/strokeWidth they used with the old
// hand-drawn set; map them onto Phosphor's size and weight.
function glyph(G: Icon) {
  function Glyph({ width, height, strokeWidth, ...rest }: IconProps) {
    const size = width ?? height ?? 20;
    const weight = Number(strokeWidth) >= 2.2 ? "bold" : "regular";
    return <G size={size} weight={weight} aria-hidden {...rest} />;
  }
  return Glyph;
}

export const IconMenu = glyph(ListIcon);
export const IconClose = glyph(XIcon);
export const IconBag = glyph(HandbagIcon);
export const IconSearch = glyph(MagnifyingGlassIcon);
export const IconArrowRight = glyph(ArrowRightIcon);
export const IconCheck = glyph(CheckIcon);
export const IconMail = glyph(EnvelopeSimpleIcon);
export const IconPhone = glyph(PhoneIcon);
export const IconPin = glyph(MapPinIcon);
export const IconChevronDown = glyph(CaretDownIcon);
export const IconPlus = glyph(PlusIcon);
export const IconMinus = glyph(MinusIcon);
export const IconTrash = glyph(TrashIcon);
export const IconShield = glyph(ShieldCheckIcon);
export const IconTruck = glyph(TruckIcon);
export const IconLeaf = glyph(LeafIcon);
export const IconInstagram = glyph(InstagramLogoIcon);
export const IconTiktok = glyph(TiktokLogoIcon);
export const IconFacebook = glyph(FacebookLogoIcon);
export const IconWhatsapp = glyph(WhatsappLogoIcon);
export const IconUser = glyph(UserIcon);
export const IconStorefront = glyph(StorefrontIcon);
export const IconGlobe = glyph(GlobeHemisphereEastIcon);
