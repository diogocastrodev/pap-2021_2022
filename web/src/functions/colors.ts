const hexToRgb = (hex: string) => {
  const rgb = hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => "#" + r + r + g + g + b + b
    )
    .substring(1)
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16));

  return rgb;
};

const lightHex = (hex: hex): hex => {
  const rgb = hexToRgb(hex);
  const lightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  return lightness > 125 ? "#000000" : "#ffffff";
};

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export { hexToRgb, rgbToHex, lightHex };
