import Color from 'colorjs.io';
import { ColorChannels } from '../types';

const createColor = (
  format: string,
  channels: ColorChannels,
  alpha?: number
): string => {
  return new Color(format, channels, alpha).toString();
};

const getColorFormat = (color: string) => {
  return new Color(color).spaceId;
};

const tryGetColorFormat = (color: string) => {
  try {
    return getColorFormat(color);
  } catch {
    return null;
  }
};

const isValidColor = (color: string) => {
  return tryGetColorFormat(color) !== null;
};

const toFormat = (color: string, format: string) => {
  return new Color(color).to(format).toString();
};

const toGamut = (color: string) => {
  return new Color(color).toGamut().toString();
};

const getChannels = (color: string) => {
  const colorObj = new Color(color);
  return colorObj.coords;
};

const getChannelsMinMax = (color: string) => {
  const space = new Color(color).space;
  return Object.values(space.coords).map((coord) => {
    return coord.range ?? coord.refRange;
  });
};

const getAlpha = (color: string) => {
  const colorObj = new Color(color);
  return colorObj.alpha;
};

export const colorLib = {
  createColor,
  tryGetColorFormat,
  toFormat,
  toGamut,
  getChannels,
  getAlpha,
  getChannelsMinMax,
  isValidColor,
};
