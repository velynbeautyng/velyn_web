import { ImageResponse } from "next/og";
import { LOGO_STACKED } from "@/components/brand/nuvene-logo-paths";

export const alt = "Nuvene Beauty, skincare matched to your concern";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori does not resolve CSS variables inside an SVG data URI, so the
// logo colours are written in literally.
const logoSvg = LOGO_STACKED.body
  .replaceAll("var(--logo-mark,currentColor)", "#E1DAC6")
  .replaceAll("var(--logo-word,currentColor)", "#FFFFFF");
const logo = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_STACKED.viewBox}">${logoSvg}</svg>`,
)}`;

const corners = [
  { top: 48, left: 48, borderTop: "3px solid #E1DAC6", borderLeft: "3px solid #E1DAC6" },
  { top: 48, right: 48, borderTop: "3px solid #E1DAC6", borderRight: "3px solid #E1DAC6" },
  { bottom: 48, left: 48, borderBottom: "3px solid #E1DAC6", borderLeft: "3px solid #E1DAC6" },
  { bottom: 48, right: 48, borderBottom: "3px solid #E1DAC6", borderRight: "3px solid #E1DAC6" },
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#5E7C63",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {corners.map((s, i) => (
          <div key={i} style={{ position: "absolute", width: 40, height: 40, ...s }} />
        ))}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={470} height={200} alt="" />
        <div style={{ marginTop: 44, fontSize: 30, color: "#FFFFFF" }}>
          Concern matched. Transparently sourced.
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 18,
            letterSpacing: 4,
            color: "#E1DAC6",
            textTransform: "uppercase",
          }}
        >
          Beauty you can trust
        </div>
      </div>
    ),
    { ...size },
  );
}
