import React from 'react';
import styles from './color-preview.module.css';

export interface ColorPreviewProps {
  color: string;
}

export const ColorPreview: React.FC<ColorPreviewProps> = ({ color }) => {
  return (
    <div style={{ backgroundColor: color }} className={styles.colorPreview} />
  );
};
