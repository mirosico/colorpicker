import * as React from 'react';

import styles from './color-picker.module.css';
import { useColorPicker } from './useColorPicker.ts';
import {
  AlphaSlider,
  ChannelInputs,
  ColorPickerPlane,
  ColorPreview,
  HueSlider,
  ColorFormatSelector,
} from '../';

interface ColorPickerProps {
  value: string;
  resolvedValue?: string;
  onChange: (value: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  resolvedValue,
  onChange,
}) => {
  const {
    colorPlaneProps,
    hueSliderProps,
    alphaSliderProps,
    inputsProps,
    colorFormatSelectorProps,
    colorPreviewProps,
  } = useColorPicker(value, onChange, resolvedValue);

  return (
    <div className={styles.colorPicker}>
      <ColorPickerPlane {...colorPlaneProps} />
      <div className={styles.slidersPreviewContainer}>
        <div>
          <ColorPreview {...colorPreviewProps} />
        </div>
        <div className={styles.slidersContainer}>
          <HueSlider {...hueSliderProps} />
          <AlphaSlider {...alphaSliderProps} />
        </div>
      </div>
      <div className={styles.inputsWithSelectors}>
        <ChannelInputs {...inputsProps} />
        <ColorFormatSelector {...colorFormatSelectorProps} />
      </div>
    </div>
  );
};
