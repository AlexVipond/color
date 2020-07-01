/* eslint-disable import/no-cycle */
import {
  HEX_RE,
  HEX_RE_S,
} from './constants';
import {
  defined,
  extractFnCommaGroups,
  extractFnWhitespaceGroups,
  extractGroups,
  hexToOctet,
  round,
} from './utils';
import sRGBColor from './srgb/srgb.class';
import XYZColor from './xyz/xyz.class';
import LabColor from './lab/lab.class';
import { namedColors, parseNamed } from './named';

function color(descriptor) {
  if (typeof descriptor === 'object') {
    if (defined(descriptor.red, descriptor.green, descriptor.blue)) {
      return sRGBColor.rgb(descriptor);
    }

    if (defined(descriptor.hue, descriptor.saturation, descriptor.lightness)) {
      return sRGBColor.hsl(descriptor);
    }

    if (defined(descriptor.hue, descriptor.whiteness, descriptor.blackness)) {
      return sRGBColor.hwb(descriptor);
    }

    if (defined(descriptor.x, descriptor.y, descriptor.z)) {
      return new XYZColor(descriptor);
    }

    if (defined(descriptor.lightness, descriptor.a, descriptor.b)) {
      return LabColor.lab(descriptor);
    }

    if (defined(descriptor.lightness, descriptor.chroma, descriptor.hue)) {
      return LabColor.lch(descriptor);
    }
  }

  if (typeof descriptor === 'string') {
    descriptor = descriptor.trim().toLowerCase();
    if (namedColors.has(descriptor)) {
      const [red, green, blue, hue, saturation, lightness, alpha] = parseNamed(descriptor);
      return new sRGBColor({
        red,
        green,
        blue,
        hue,
        saturation,
        lightness,
        alpha,
      });
    }

    if (descriptor.startsWith('#')) {
      const re = descriptor.length > 5 ? HEX_RE : HEX_RE_S;
      const rgba = extractGroups(re, descriptor).map(hexToOctet);
      rgba[3] = round(rgba[3] / 255, 7);
      return sRGBColor.rgbArray(rgba);
    }

    if (descriptor.startsWith('rgb')) {
      return sRGBColor.rgbArray(descriptor.includes(',') ? extractFnCommaGroups('rgb', descriptor) : extractFnWhitespaceGroups('rgb', descriptor));
    }

    if (descriptor.startsWith('hsl')) {
      return sRGBColor.hslArray(descriptor.includes(',') ? extractFnCommaGroups('hsl', descriptor) : extractFnWhitespaceGroups('hsl', descriptor));
    }

    if (descriptor.startsWith('hwb')) {
      return sRGBColor.hwbArray(extractFnWhitespaceGroups('hwb', descriptor));
    }

    if (descriptor.startsWith('lab')) {
      return LabColor.labArray(extractFnWhitespaceGroups('lab', descriptor));
    }

    if (descriptor.startsWith('lch')) {
      return LabColor.lchArray(extractFnWhitespaceGroups('lch', descriptor));
    }
  }

  return undefined;
}

export {
  color,
  LabColor,
  sRGBColor,
  XYZColor,
};

export { default as gray } from './gray';
export { default as contrast } from './contrast';
export { mix, mixLab } from './mix';
