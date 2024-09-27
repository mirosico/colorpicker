import { ColorGamut, ColorFormat } from '../../../types';
import { RGBColorFormat } from './RGBColorFormat.ts';
import { HSLColorFormat } from './HSLColorFormat.ts';
import { LCHColorFormat } from './LCHColorFormat.ts';
import { LABColorFormat } from './LABColorFormat.ts';
import { P3ColorFormat } from './P3ColorFormat.ts';
import { FallbackColorFormat } from './FallbackColorFormat.ts';
import { ChannelInput } from '../../index.ts';
import { colorLib } from '../../../lib';

export interface ColorFormatStrategy {
  colorFormat: ColorFormat | undefined;
  colorGamut: ColorGamut;
  getInputs: (
    color: string,
    onChange: (color: string) => void
  ) => ChannelInput[];
}

const Strategies: Record<ColorFormat, ColorFormatStrategy> = {
  srgb: new RGBColorFormat(),
  hsl: new HSLColorFormat(),
  lab: new LABColorFormat(),
  lch: new LCHColorFormat(),
  p3: new P3ColorFormat(),
};

const fallbackColorFormatStrategy = new FallbackColorFormat();

export const definedColorFormats: ColorFormat[] = Object.keys(
  Strategies
) as ColorFormat[];

const isDefinedColorFormat = (
  colorFormat: string | null
): colorFormat is ColorFormat => {
  return (
    !!colorFormat && definedColorFormats.includes(colorFormat as ColorFormat)
  );
};

export const getColorFormatStrategy = (color: string): ColorFormatStrategy => {
  const colorFormat = colorLib.tryGetColorFormat(color);
  return isDefinedColorFormat(colorFormat)
    ? Strategies[colorFormat]
    : fallbackColorFormatStrategy;
};
