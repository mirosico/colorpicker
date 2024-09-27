import React from 'react';
import { SliderWithBackground } from '../';
import { OPACITY_IMAGE } from '../../../assets/opacityImage.ts';

export interface AlphaSliderProps {
  background: string;
  alpha: number;
  onChange: (alpha: number) => void;
}

export const AlphaSlider: React.FC<AlphaSliderProps> = ({
  background,
  alpha,
  onChange,
}) => {
  return (
    <div
      style={{
        background: `url(${OPACITY_IMAGE}) left center`,
      }}
    >
      <SliderWithBackground
        background={background}
        min={0}
        max={1}
        value={alpha}
        onChange={(newAlpha) => {
          onChange(newAlpha);
        }}
      />
    </div>
  );
};
