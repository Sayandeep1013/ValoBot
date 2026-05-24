"use client";

// Clean Valorant-style angular step lines.
// Inspired by Riot's official art — horizontal → angled step → horizontal.
// Minimal: 4 step lines, small square joints, and a subtle dot grid.
// No rotating rings, no orbiting dots, no reticles — just clean HUD geometry.

export default function GeometricBg() {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 3,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Dot matrix — one dot every 52px, very faint */}
        <pattern id="dots" x="0" y="0" width="52" height="52" patternUnits="userSpaceOnUse">
          <circle cx="26" cy="26" r="0.9" fill="rgba(255,255,255,0.09)" />
        </pattern>

        {/* Line glow — larger spread so lines are clearly visible */}
        <filter id="line-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Dot matrix background ────────────────────────────────────── */}
      <rect width="1440" height="900" fill="url(#dots)" />

      {/* ══════════════════════════════════════════════════════════════
          STEP LINES — the Valorant HUD signature
          Shape: long horizontal → short 45° diagonal → long horizontal
          All at 0.22–0.28 opacity so they read clearly on black
      ══════════════════════════════════════════════════════════════ */}

      <g filter="url(#line-glow)">

        {/* ── Line 1 — large, upper area (behind headline) ─────────── */}
        <polyline
          points="55,295  380,295  480,385  840,385"
          stroke="rgba(255,255,255,0.48)"
          strokeWidth="1.4"
        />
        <rect x="371" y="287" width="16" height="16" fill="rgba(255,255,255,0.52)" />
        <rect x="471" y="377" width="16" height="16" fill="rgba(255,255,255,0.52)" />

        {/* ── Line 2 — mid area ────────────────────────────────────── */}
        <polyline
          points="430,480  650,480  730,550  1040,550"
          stroke="rgba(255,255,255,0.38)"
          strokeWidth="1.2"
        />
        <rect x="643" y="473" width="14" height="14" fill="rgba(255,255,255,0.42)" />
        <rect x="723" y="543" width="14" height="14" fill="rgba(255,255,255,0.42)" />

        {/* ── Line 3 — lower right ─────────────────────────────────── */}
        <polyline
          points="760,635  980,635  1040,690  1280,690"
          stroke="rgba(255,255,255,0.30)"
          strokeWidth="1.1"
        />
        <rect x="974" y="629" width="12" height="12" fill="rgba(255,255,255,0.34)" />
        <rect x="1034" y="683" width="12" height="12" fill="rgba(255,255,255,0.34)" />

        {/* ── Line 4 — top right accent ────────────────────────────── */}
        <polyline
          points="940,155  1160,155  1220,210"
          stroke="rgba(255,255,255,0.34)"
          strokeWidth="1.1"
        />
        <rect x="1153" y="148" width="13" height="13" fill="rgba(255,255,255,0.38)" />

        {/* ── Left edge accent ─────────────────────────────────────── */}
        <polyline
          points="55,155  220,155  265,200"
          stroke="rgba(255,255,255,0.36)"
          strokeWidth="1.1"
        />

        {/* ── Bottom-right horizontal ──────────────────────────────── */}
        <line x1="860" y1="780" x2="1180" y2="780" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
        <rect x="854" y="774" width="12" height="12" fill="rgba(255,255,255,0.32)" />

      </g>

      {/* ── Small scattered single squares (Valorant poster style) ─── */}
      {/* These are the tiny filled squares scattered in Riot's key art */}
      <rect x="141" y="217" width="8"  height="8"  fill="rgba(255,255,255,0.35)" />
      <rect x="919" y="107" width="8"  height="8"  fill="rgba(255,255,255,0.30)" />
      <rect x="1099" y="429" width="7" height="7"  fill="rgba(255,255,255,0.28)" />
      <rect x="339" y="709" width="7"  height="7"  fill="rgba(255,255,255,0.25)" />
      <rect x="1349" y="619" width="6" height="6"  fill="rgba(255,255,255,0.24)" />
      <rect x="679" y="819" width="6"  height="6"  fill="rgba(255,255,255,0.22)" />
      <rect x="57"  y="579" width="6"  height="6"  fill="rgba(255,255,255,0.26)" />
      <rect x="1379" y="299" width="6" height="6"  fill="rgba(255,255,255,0.22)" />

    </svg>
  );
}
