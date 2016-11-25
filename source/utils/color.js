/**
 * Credit to Michael Jackson
 * @see https://gist.github.com/mjackson/5311256
 */

// ——————————————————————————————————————————————————
// Color
// ——————————————————————————————————————————————————

// ——————————————————————————————————————————————————
// Helpers
// ——————————————————————————————————————————————————

const RGBComponent = (p, q, t) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export const RGBtoDEC = (r, g, b) => (r << 16) + (g << 8) + b;

export const RGBtoHEX = (r, g, b) => '#' + RGBtoDEC(r, g, b).toString(16);

export const RGBtoHSL = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [ h, s, l ];
};

export const HSLtoRGB = (h, s, l) => {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = RGBComponent(p, q, h + 1 / 3);
    g = RGBComponent(p, q, h);
    b = RGBComponent(p, q, h - 1 / 3);
  }
  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  ];
};

export const HSLtoDEC = (h, s, l) => RGBtoDEC(...HSLtoRGB(h, s, l));

export const HSLtoHEX = (h, s, l) => RGBtoHEX(...HSLtoRGB(h, s, l));
