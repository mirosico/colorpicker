import styles from './slider-with-background.module.css';
import React from 'react';
import _ from 'lodash';

interface SliderWithBackgroundProps {
  background: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const getPointerPosition = (
  value: number,
  min: number,
  max: number,
  sliderWidth: number,
  pointerWidth: number
) => {
  const rangeAbs = Math.abs(min) + Math.abs(max);
  const valueAbs = Math.abs(value);
  const ratio = _.clamp(valueAbs / rangeAbs, 0, 1);
  return sliderWidth * ratio - pointerWidth / 2;
};

export const SliderWithBackground: React.FC<SliderWithBackgroundProps> = ({
  background,
  min,
  max,
  value,
  onChange,
}) => {
  const pointerMouseDown = React.useRef(false);
  const pointerRef = React.useRef<HTMLDivElement>(null);
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const [pointerPosition, setPointerPosition] = React.useState(0);

  React.useEffect(() => {
    if (!sliderRef.current || !pointerRef.current) {
      return;
    }
    const sliderWidth = sliderRef.current.getBoundingClientRect().width;
    const pointerWidth = pointerRef.current.getBoundingClientRect().width;
    setPointerPosition(
      getPointerPosition(value, min, max, sliderWidth, pointerWidth)
    );
  }, [value, min, max]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!pointerMouseDown.current) {
      return;
    }
    handleChange(e);
  };

  const handleChange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const slider = sliderRef.current;
    if (!slider) {
      throw new Error('Slider ref is not defined');
    }
    const sliderRect = slider.getBoundingClientRect();
    const offsetX = e.clientX - sliderRect.left;
    const ratio = _.clamp(offsetX / sliderRect.width, 0, 1);
    const newValue = min + (max - min) * ratio;
    onChange(newValue);
  };

  return (
    <div
      ref={sliderRef}
      className={styles.container}
      style={{
        background,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => (pointerMouseDown.current = false)}
      onClick={handleChange}
    >
      <div
        onMouseUp={() => (pointerMouseDown.current = false)}
        onMouseDown={() => (pointerMouseDown.current = true)}
        ref={pointerRef}
        className={styles.pointer}
        style={{
          left: `${pointerPosition}px`,
        }}
      />
    </div>
  );
};
