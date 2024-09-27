import { ColorFormat } from '../../types';
import { colorLib } from '../../lib';
import {
  colorFromHsv,
  getAlphaGradient,
  getGamaGradient,
  getMostSaturatedColorForGivenHue,
  getValidatedColor,
  hsvFromColor,
} from './utils.ts';
import { ColorFormatStrategy, Strategies } from './color-format-strategies/';
import { ColorFormatSelectorProps } from '../color-format-selector/color-format-selector.tsx';
import { ColorPickerPlaneProps } from '../color-picker-plane/color-picker-plane.tsx';
import { HueSliderProps } from '../hue-slider/hue-slider.tsx';
import { AlphaSliderProps } from '../alpha-slider/alpha-slider.tsx';
import { ChannelInputsProps } from '../channel-inputs/channel-inputs.tsx';
import { ColorPreviewProps } from '../color-preview/color-preview.tsx';
import React from 'react';

const definedColorFormats: ColorFormat[] = Object.keys(Strategies).filter(
  (key) => key !== 'default'
) as ColorFormat[];

const isDefinedColorFormat = (
  colorFormat: string | null
): colorFormat is ColorFormat => {
  return (
    !!colorFormat && definedColorFormats.includes(colorFormat as ColorFormat)
  );
};

const getColorFormatWithFallback = (
    color: string,
): ColorFormat => {
    const colorFormat = colorLib.tryGetColorFormat(color);
    return (colorFormat || 'srgb') as ColorFormat;
}

const getColorStrategy = (color: string): ColorFormatStrategy => {
  const colorFormat = colorLib.tryGetColorFormat(color);
  return isDefinedColorFormat(colorFormat)
    ? Strategies[colorFormat]
    : Strategies.default;
};

type UseColorPicker = (
  value: string,
  externalOnChange: (value: string) => void,
  resolvedValue?: string
) => {
  colorPlaneProps: ColorPickerPlaneProps;
  hueSliderProps: HueSliderProps;
  alphaSliderProps: AlphaSliderProps;
  inputsProps: ChannelInputsProps;
  colorFormatSelectorProps: ColorFormatSelectorProps;
  colorPreviewProps: ColorPreviewProps;
};

export const useColorPicker: UseColorPicker = (
  value,
  externalOnChange,
  resolvedValue
) => {
  const color = getValidatedColor(value, resolvedValue);
  const strategy = getColorStrategy(color);
  const { colorFormat: strategyDefinedColorFormat, colorGamut, getInputs } = strategy;
  const [hsv, setHSV] = React.useState(hsvFromColor(color, colorGamut));

  const colorFormat = strategyDefinedColorFormat ?? getColorFormatWithFallback(color);

  const onChange = (newColor: string) => {
    externalOnChange(newColor);
    const newHsv = hsvFromColor(newColor, colorGamut);
    if (!Number.isNaN(newHsv.h.valueOf())) {
      setHSV(newHsv);
    }
  };

  return {
    colorPlaneProps: {
      backgroundColor: getMostSaturatedColorForGivenHue(hsv.h, colorGamut),
      value: {
        saturation: hsv.s,
        brightness: hsv.v,
      },
      onChange: ({ saturation: newSaturation, brightness: newBrightness }) => {
        const newColor = colorFromHsv(
          hsv.h,
          newSaturation,
          newBrightness,
          colorFormat,
          colorGamut
        );
        onChange(newColor);
      },
    },
    hueSliderProps: {
      background: getGamaGradient(colorGamut),
      hue: hsv.h,
      onChange: (newHue) => {
        const newColor = colorFromHsv(
          newHue,
          hsv.s,
          hsv.v,
          colorFormat,
          colorGamut
        );
        onChange(newColor);
      },
    },
    alphaSliderProps: {
      background: getAlphaGradient(color, colorFormat),
      alpha: colorLib.getAlpha(color),
      onChange: (value: number) => {
        const channels = colorLib.getChannels(color);
        onChange(colorLib.createColor(colorFormat, channels, value));
      },
    },
    inputsProps: {
      inputs: getInputs(color, onChange),
    },
    colorFormatSelectorProps: {
      selectedFormat: colorFormat,
      formats: definedColorFormats
        .filter((format) => format !== colorFormat)
        .map((format) => ({
          value: format,
          label: colorLib.toFormat(color, format),
        })),
      onChange: (colorFormat) =>
        onChange(colorLib.toFormat(color, colorFormat)),
    },
    colorPreviewProps: {
      color,
    },
  };
};
