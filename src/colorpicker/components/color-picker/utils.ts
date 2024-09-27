import { colorLib } from '../../lib';
import { ColorChannels, ColorFormat, ColorGamut } from '../../types';

const getGamaGradient = (gamut: ColorGamut): string => {
  const stops: Array<ColorChannels> = [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
    [0, 0, 1],
    [1, 0, 1],
    [1, 0, 0],
  ];
  const colors = stops.map((stop) => colorLib.createColor(gamut, stop));
  return `linear-gradient(in srgb to right, ${colors.join(',')})`;
};

const getAlphaGradient = (color: string, colorFormat: ColorFormat): string => {
  const aplha0 = colorLib.createColor(
    colorFormat,
    colorLib.getChannels(color),
    0
  );
  const aplha1 = colorLib.createColor(
    colorFormat,
    colorLib.getChannels(color),
    1
  );
  return `linear-gradient(to right, ${aplha0}, ${aplha1})`;
};

const getHsvFromColor = (
  color: string,
  gamut: ColorGamut,
  hueFallback?: number
) => {
  let colorInRgbSafe = color;
  if (gamut === 'p3') {
    const p3 = colorLib.toGamut(colorLib.toFormat(color, gamut));
    const p3Channels = colorLib.getChannels(p3);
    colorInRgbSafe = colorLib.createColor('srgb', p3Channels);
  }
  const hsv = colorLib.toFormat(colorInRgbSafe, 'hsv');
  const hsvChannels = colorLib.getChannels(hsv);
  if (hueFallback !== undefined && !isHueMeaningful(hsvChannels[0])) {
    return { h: hueFallback, s: hsvChannels[1], v: hsvChannels[2] };
  }
  return { h: hsvChannels[0], s: hsvChannels[1], v: hsvChannels[2] };
};

const getColorFromHsv = (
  h: number,
  s: number,
  v: number,
  colorFormat: ColorFormat,
  gamut: ColorGamut
): string => {
  const hue = isHueMeaningful(h) ? h : 0;
  const hsvColor = colorLib.createColor('hsv', [hue, s, v]);
  let color = colorLib.toFormat(hsvColor, 'srgb');
  if (gamut === 'p3') {
    const rgbChannels = colorLib.getChannels(color);
    color = colorLib.createColor(gamut, rgbChannels);
  }
  return colorLib.toFormat(color, colorFormat);
};

const getMostSaturatedColorForGivenHue = (
  hue: number,
  gamut: ColorGamut
): string => {
  const color = colorLib.toFormat(
    colorLib.createColor('hsv', [hue, 100, 100]),
    'srgb'
  );
  if (gamut === 'srgb') return color;
  const rgbChannels = colorLib.getChannels(color);
  return colorLib.createColor('p3', rgbChannels);
};

const getColorWithFallback = (
  value: string,
  resolvedValue: string | undefined,
  fallback = 'rgba(255, 0, 0, 1)'
): string => {
  if (colorLib.isValidColor(value)) {
    return value;
  }
  if (resolvedValue && colorLib.isValidColor(resolvedValue)) {
    return resolvedValue;
  }
  // in case of both value and resolvedValue are invalid
  return fallback;
};

const getColorFormatWithFallback = (
  color: string,
  fallback: ColorFormat = 'srgb'
): ColorFormat => {
  const colorFormat = colorLib.tryGetColorFormat(color);
  return (colorFormat || fallback) as ColorFormat;
};

const isHueMeaningful = (hue: number) => !Number.isNaN(hue.valueOf());

export {
  getHsvFromColor,
  getColorFromHsv,
  getMostSaturatedColorForGivenHue,
  getGamaGradient,
  getAlphaGradient,
  getColorWithFallback,
  getColorFormatWithFallback,
  isHueMeaningful,
};
