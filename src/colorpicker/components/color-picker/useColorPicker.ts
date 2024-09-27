import React from 'react';
import { colorLib } from '../../lib';
import {
  getColorFromHsv,
  getAlphaGradient,
  getColorFormatWithFallback,
  getGamaGradient,
  getMostSaturatedColorForGivenHue,
  getColorWithFallback,
  getHsvFromColor,
  isHueMeaningful,
} from './utils.ts';
import type {
  ColorFormatSelectorProps,
  ColorPickerPlaneProps,
  HueSliderProps,
  AlphaSliderProps,
  ChannelInputsProps,
  ColorPreviewProps,
} from '../';
import {
  definedColorFormats,
  getColorFormatStrategy,
} from './color-format-strategies/';

const getFormatSelectorOptions = (color: string, colorFormat: string) =>
  definedColorFormats
    .filter((format) => format !== colorFormat)
    .map((format) => ({
      value: format,
      label: colorLib.toFormat(color, format),
    }));

type UseColorPicker = (
  value: string,
  onChange: (value: string) => void,
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
  onChange,
  resolvedValue
) => {
  const color = getColorWithFallback(value, resolvedValue);
  const strategy = getColorFormatStrategy(color);
  const {
    colorFormat: strategyDefinedColorFormat,
    colorGamut,
    getInputs,
  } = strategy;
  const [hsv, setHSV] = React.useState(getHsvFromColor(color, colorGamut, 0));

  const colorFormat =
    strategyDefinedColorFormat ?? getColorFormatWithFallback(color);

  React.useEffect(() => {
    const newHsv = getHsvFromColor(color, colorGamut);
    if (isHueMeaningful(newHsv.h)) {
      setHSV(newHsv);
    }
  }, [color, colorGamut, colorFormat]);

  return {
    colorPlaneProps: {
      backgroundColor: getMostSaturatedColorForGivenHue(hsv.h, colorGamut),
      value: {
        saturation: hsv.s,
        brightness: hsv.v,
      },
      onChange: ({ saturation: newSaturation, brightness: newBrightness }) => {
        const newColor = getColorFromHsv(
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
        const newColor = getColorFromHsv(
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
      formats: getFormatSelectorOptions(color, colorFormat),
      onChange: (colorFormat) =>
        onChange(colorLib.toFormat(color, colorFormat)),
    },
    colorPreviewProps: {
      color,
    },
  };
};
