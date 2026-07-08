import { ImageResponse } from "next/og";

export const alt = "Velyn Beauty & Essentials, Authentic skincare, sourced directly";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#2C1A0E",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* gold glow */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -180,
            width: 560,
            height: 560,
            borderRadius: 560,
            background: "radial-gradient(circle, rgba(189,148,104,0.4), transparent 70%)",
          }}
        />
        {/* corner ticks */}
        <div style={{ position: "absolute", top: 48, left: 48, width: 40, height: 40, borderTop: "3px solid #BD9468", borderLeft: "3px solid #BD9468" }} />
        <div style={{ position: "absolute", top: 48, right: 48, width: 40, height: 40, borderTop: "3px solid #BD9468", borderRight: "3px solid #BD9468" }} />
        <div style={{ position: "absolute", bottom: 48, left: 48, width: 40, height: 40, borderBottom: "3px solid #BD9468", borderLeft: "3px solid #BD9468" }} />
        <div style={{ position: "absolute", bottom: 48, right: 48, width: 40, height: 40, borderBottom: "3px solid #BD9468", borderRight: "3px solid #BD9468" }} />

        <svg width="110" height="88" viewBox="0 0 302.62 242.88" fill="#BD9468">
          <path d="M162.12,90.11c29,9.83,11.41,55.69-17,45.87-.66-.14-1.39-.7-.65-1.31,15.31-8.5,24.15-27.39,16.3-43.91-.25-.89.69-.94,1.31-.65Z" />
          <path d="M289.36,0H177A13.25,13.25,0,0,0,164,15.5a118.54,118.54,0,0,0,4.48,17.27c4.16,14.45,6.38,14,13.56,34.17,7,19.79,10.54,29.92,9.4,41.8-.89,22.37-14.6,39.55-36.93,42.13-.5,0-1,0-1.58,0s-1.08,0-1.57,0c-22.37-2.58-36.08-19.75-37-42.13-1.11-11.88,2.39-22,9.44-41.8,7.17-20.16,9.36-19.72,13.56-34.17a119.74,119.74,0,0,0,4.47-17.27A13.25,13.25,0,0,0,128.78,0H13.25A13.24,13.24,0,0,0,1.79,19.85l128.78,223h41.48l128.77-223A13.23,13.23,0,0,0,289.36,0Z" />
        </svg>

        <div
          style={{
            marginTop: 28,
            fontSize: 76,
            letterSpacing: 14,
            color: "#F7F4EF",
            fontWeight: 700,
          }}
        >
          VELYN
        </div>
        <div style={{ marginTop: 6, fontSize: 20, letterSpacing: 10, color: "#BD9468", textTransform: "uppercase" }}>
          Beauty &amp; Essentials
        </div>
        <div style={{ marginTop: 40, fontSize: 30, color: "rgba(247,244,239,0.72)" }}>
          Authentic skincare, sourced directly.
        </div>
        <div style={{ marginTop: 10, fontSize: 18, letterSpacing: 4, color: "rgba(189,148,104,0.75)", textTransform: "uppercase" }}>
          Beauty you can trust
        </div>
      </div>
    ),
    { ...size },
  );
}
