import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "WingAI — AI-drivet dejtingoperativsystem";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FAF6F0",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Top: logo + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Wing mark */}
          <div
            style={{
              width: 64,
              height: 64,
              background: "#C4532A",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
              <path
                d="M10 36 C10 24, 20 10, 34 9 C24 15, 17 24, 22 33 C26 22, 34 14, 46 10 C38 20, 32 30, 37 42 C30 38, 20 40, 10 36Z"
                fill="white"
                opacity="0.95"
              />
            </svg>
          </div>
          <span style={{ fontSize: 36, fontWeight: 600, color: "#1C1916", letterSpacing: -1 }}>
            Wing<em style={{ color: "#C4532A", fontStyle: "italic" }}>AI</em>
          </span>
        </div>

        {/* Center: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 12,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#8C7B6B",
            }}
          >
            🇸🇪 Byggt för svenska dejters
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              color: "#1C1916",
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 820,
            }}
          >
            Din AI-dejtingcoach.{" "}
            <em style={{ color: "#C4532A", fontStyle: "italic" }}>På riktigt.</em>
          </div>
        </div>

        {/* Bottom: feature pills */}
        <div style={{ display: "flex", gap: 12 }}>
          {["ProfileX-Ray", "ConvoOS", "DateFlow"].map((f) => (
            <div
              key={f}
              style={{
                background: "white",
                border: "1.5px solid #D9CEBC",
                borderRadius: 8,
                padding: "10px 20px",
                fontSize: 15,
                fontFamily: "system-ui, sans-serif",
                fontWeight: 600,
                color: "#1C1916",
                letterSpacing: 0.3,
              }}
            >
              {f}
            </div>
          ))}
          <div
            style={{
              background: "#1C1916",
              borderRadius: 8,
              padding: "10px 20px",
              fontSize: 15,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 600,
              color: "#FAF6F0",
              letterSpacing: 0.3,
            }}
          >
            wingai-umber.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
