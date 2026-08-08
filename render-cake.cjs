const { Resvg } = require("@resvg/resvg-js");
const fs = require("fs");

const cx=180, rxT=118, ryT=40, cyTop=158;

const candleRings = [
  { depth: 0.2,  columns: [-0.66, -0.32, 0, 0.32, 0.66], scale: 0.88 },
  { depth: 0.5,  columns: [-0.84, -0.42, 0, 0.42, 0.84], scale: 0.98 },
  { depth: 0.82, columns: [-0.66, -0.32, 0, 0.32, 0.66], scale: 1.06 },
];
const berrySpecs = [
  { fx: -0.5,  depth: 0.3,  r: -7, scale: 0.85 },
  { fx:  0.5,  depth: 0.3,  r:  7, scale: 0.85 },
  { fx: -0.74, depth: 0.55, r: -8, scale: 0.9  },
  { fx:  0.74, depth: 0.55, r:  8, scale: 0.9  },
  { fx: -0.45, depth: 0.78, r: -5, scale: 0.95 },
  { fx:  0.45, depth: 0.78, r:  5, scale: 0.95 },
];

const items = [];
let ci = 0;
candleRings.forEach((ring) => ring.columns.forEach((fx) => {
  const ds = ring.depth * 2 - 1;
  const x = cx + rxT * fx;
  const halfH = ryT * Math.sqrt(1 - fx * fx);
  const y = cyTop + ds * halfH;
  items.push({ kind: "candle", x, y, scale: ring.scale, color: ["rose","cream","gold"][ci % 3], depth: ring.depth, ci });
  ci++;
}));
berrySpecs.forEach((s, i) => {
  const ds = s.depth * 2 - 1;
  const x = cx + rxT * s.fx;
  const halfH = ryT * Math.sqrt(1 - s.fx * s.fx);
  const y = cyTop + ds * halfH;
  items.push({ kind: "berry", x, y, scale: s.scale, r: s.r, depth: s.depth, bi: i });
});
items.sort((a, b) => a.depth - b.depth);

function candleSVG(item) {
  const fill = item.color === "rose" ? "url(#rose-candle)" : item.color === "cream" ? "url(#cream-candle)" : "url(#gold-candle)";
  return `<g transform="translate(${item.x} ${item.y}) scale(${item.scale})">
    <ellipse cx="1" cy="4" rx="9" ry="3.2" fill="#76564c" opacity=".2" transform="rotate(8)" />
    <rect x="-5" y="-40" width="10" height="44" rx="3" fill="${fill}" stroke="#6b4f47" stroke-opacity=".18" />
    <path d="M-4-30 4-24M-4-18 4-12" stroke="#fff" stroke-opacity=".34" stroke-width="2" stroke-linecap="round" />
    <ellipse cx="0" cy="-38" rx="5.2" ry="2.1" fill="none" stroke="#ead0c1" stroke-width="2.4" opacity=".9" />
    <path d="M0-40L0-47" stroke="#51443e" stroke-width="1.8" stroke-linecap="round" />
    <g transform="translate(0 -47)">
      <path class="cake-flame" d="M0 0C-7-7-4-17 0-23C4-17 7-7 0 0Z" fill="url(#flame-fill)" />
    </g>
  </g>`;
}
function berrySVG(item) {
  return `<g transform="translate(${item.x} ${item.y}) rotate(${item.r}) scale(${item.scale})">
    <ellipse cx="0" cy="3" rx="14" ry="4.5" fill="#825e53" opacity=".22" />
    <path d="M0 4C-12-7-13-22 0-29 13-22 12-7 0 4Z" fill="#b9575d" stroke="#8f4149" stroke-width="1" />
    <path d="M-8-24 0-34 8-24M-10-26 0-22 10-26" fill="#7d9273" stroke="#657a60" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="-4" cy="-14" r="1" fill="#f1c49c" /><circle cx="4" cy="-8" r="1" fill="#f1c49c" /><circle cx="2" cy="-20" r="1" fill="#f1c49c" />
  </g>`;
}

const toppings = items.map(item => item.kind === "candle" ? candleSVG(item) : berrySVG(item)).join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" width="720" height="720">
  <defs>
    <linearGradient id="plate-top" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fffaf2" /><stop offset=".5" stop-color="#ecdfce" /><stop offset="1" stop-color="#cdb79f" /></linearGradient>
    <linearGradient id="plate-side" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#dcc9b2" /><stop offset="1" stop-color="#a98c74" /></linearGradient>
    <linearGradient id="cake-side" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#b98471" /><stop offset=".18" stop-color="#efd0bb" /><stop offset=".5" stop-color="#f8e2ce" /><stop offset=".82" stop-color="#ddb49e" /><stop offset="1" stop-color="#aa7567" /></linearGradient>
    <radialGradient id="frosting-top" cx="38%" cy="24%" r="78%"><stop stop-color="#fffdf7" /><stop offset=".56" stop-color="#f6e0d3" /><stop offset="1" stop-color="#cfa18f" /></radialGradient>
    <linearGradient id="cream-band" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff5e8" /><stop offset=".58" stop-color="#efd2c2" /><stop offset="1" stop-color="#d99ca1" /></linearGradient>
    <linearGradient id="rose-candle" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#ba6e78" /><stop offset=".45" stop-color="#e7aeb2" /><stop offset=".72" stop-color="#f1c9c5" /><stop offset="1" stop-color="#a95e69" /></linearGradient>
    <linearGradient id="cream-candle" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#c7ac73" /><stop offset=".5" stop-color="#fff0c7" /><stop offset="1" stop-color="#b99558" /></linearGradient>
    <linearGradient id="gold-candle" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#a77f45" /><stop offset=".5" stop-color="#e9cb8c" /><stop offset="1" stop-color="#97703c" /></linearGradient>
    <radialGradient id="flame-fill" cx="50%" cy="72%" r="70%"><stop stop-color="#fffce3" /><stop offset=".33" stop-color="#f4ce72" /><stop offset=".76" stop-color="#cf7f50" /><stop offset="1" stop-color="#cf7f50" stop-opacity="0" /></radialGradient>
    <filter id="cake-shadow-filter" x="-30%" y="-30%" width="160%" height="180%"><feGaussianBlur stdDeviation="7" /></filter>
    <filter id="soft-depth" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#5d4137" flood-opacity=".2" /></filter>
    <clipPath id="cake-body-clip"><path d="M62 158L62 270A118 40 0 0 0 298 270L298 158A118 40 0 0 1 62 158Z" /></clipPath>
  </defs>
  <rect width="360" height="360" fill="#fdf6ee" />
  <ellipse cx="180" cy="332" rx="150" ry="15" fill="#5d4b42" opacity=".17" filter="url(#cake-shadow-filter)" />
  <path d="M20 284A164 44 0 0 0 340 284L340 298A164 44 0 0 1 20 298Z" fill="url(#plate-side)" />
  <ellipse cx="180" cy="284" rx="164" ry="44" fill="url(#plate-top)" stroke="#c2ab93" stroke-width="1.2" />
  <g filter="url(#soft-depth)">
    <path d="M62 158L62 270A118 40 0 0 0 298 270L298 158A118 40 0 0 1 62 158Z" fill="url(#cake-side)" />
  </g>
  <g clip-path="url(#cake-body-clip)">
    <path d="M82 158V286" stroke="#fff" stroke-opacity=".16" stroke-width="16" />
  </g>
  <ellipse cx="180" cy="158" rx="118" ry="40" fill="url(#frosting-top)" stroke="#c99a88" stroke-width="1.4" />
  <g clip-path="url(#cake-body-clip)">
    <path d="M62 158A118 40 0 0 1 298 158L298 206C276 224 256 206 236 220C214 234 196 212 176 224C156 234 138 212 118 222C100 232 80 214 62 206Z" fill="url(#cream-band)" />
  </g>
  <path d="M62 158A118 40 0 0 1 298 158" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4" stroke-linecap="round" />
  ${toppings}
</svg>`;

fs.writeFileSync("cake-preview.svg", svg);
const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 720 } });
const pngData = resvg.render();
fs.writeFileSync("cake-preview.png", pngData.asPng());
console.log("Wrote cake-preview.svg and cake-preview.png (" + (pngData.asPng().length / 1024).toFixed(1) + " KB)");