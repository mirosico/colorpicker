import React from 'react';
import { SliderWithBackground } from '../';

export interface AlphaSliderProps {
  background: string;
  alpha: number;
  onChange: (alpha: number) => void;
}

const opacityImage =
  'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHAD97gk2YcNYBhmIQBgWSAP52AwoAQwJvQRg1gACckQoC2gQgAIF8IscwEtKYAAAAASUVORK5CYII=") left center';

export const AlphaSlider: React.FC<AlphaSliderProps> = ({
  background,
  alpha,
  onChange,
}) => {
  return (
    <div
      style={{
        background: opacityImage,
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
