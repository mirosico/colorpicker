import React from 'react';
import _ from 'lodash';
import styles from './color-picker-plane.module.css';

export interface ColorPickerPlaneProps {
  backgroundColor: string;
  value: {
    saturation: number;
    brightness: number;
  };
  onChange: (value: { saturation: number; brightness: number }) => void;
}

const getSaturationAndBrightness = (x: number, y: number, rect: DOMRect) => {
  return {
    saturation: _.clamp((x / rect.width) * 100, 0, 100),
    brightness: _.clamp(100 - (y / rect.height) * 100, 0, 100),
  };
};

export const ColorPickerPlane: React.FC<ColorPickerPlaneProps> = ({
  value,
  backgroundColor,
  onChange,
}) => {
  const planeRef = React.useRef<HTMLDivElement>(null);
  const pointerRef = React.useRef<HTMLDivElement>(null);
  const pointerClicked = React.useRef<boolean>(false);

  const [pointerSize, setPointerSize] = React.useState({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    if (!pointerRef.current) {
      return;
    }
    setPointerSize(pointerRef.current.getBoundingClientRect());
  }, []);

  const { saturation, brightness } = value;

  const handleChange = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!planeRef.current) {
      throw new Error('Plane ref is not defined');
    }
    const rect = planeRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const saturationAndBrightness = getSaturationAndBrightness(x, y, rect);
    if (!saturationAndBrightness) {
      return;
    }
    onChange(saturationAndBrightness);
  };

  const handlePointerMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!pointerClicked.current) {
      return;
    }
    handleChange(event);
  };

  return (
    <div
      className={styles.colorPickerPlane}
      style={{
        background: backgroundColor,
      }}
      ref={planeRef}
      onMouseLeave={() => (pointerClicked.current = false)}
      onClick={handleChange}
      onMouseMove={handlePointerMove}
    >
      <div className={styles.whiteGradient}>
        <div className={styles.blackGradient}></div>
        <div
          ref={pointerRef}
          className={styles.pointer}
          style={{
            left: `calc(${saturation}% - ${pointerSize.width / 2}px)`,
            top: `calc(${100 - brightness}% - ${pointerSize.height / 2}px)`,
          }}
          onMouseDown={() => (pointerClicked.current = true)}
          onMouseUp={() => (pointerClicked.current = false)}
        />
      </div>
    </div>
  );
};
