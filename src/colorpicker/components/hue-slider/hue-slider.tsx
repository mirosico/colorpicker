import React from 'react';
import { SliderWithBackground } from '../slider-with-background/slider-with-background.tsx';

export interface HueSliderProps {
  background: string;
  hue: number;
  onChange: (hue: number) => void;
}

export const HueSlider: React.FC<HueSliderProps> = ({
  hue,
  background,
  onChange,
}) => {
  return (
    <SliderWithBackground
      min={1}
      max={359}
      background={background}
      value={hue}
      onChange={onChange}
    />
  );
};
