import React from 'react';
import { ColorFormat } from '../../types';
import styles from './color-format-selector.module.css';

type ColorFormatOption = {
  value: ColorFormat;
  label: string;
};

export interface ColorFormatSelectorProps {
  formats: ColorFormatOption[];
  selectedFormat: string;
  onChange: (value: ColorFormat) => void;
}

export const ColorFormatSelector: React.FC<ColorFormatSelectorProps> = ({
  formats,
  onChange,
  selectedFormat,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: ColorFormat) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      <button onClick={toggleDropdown}>
        {selectedFormat ?? ''} {!isOpen ? '⬇' : '⬆'}
      </button>
      {isOpen && (
        <div className={styles.contextMenu}>
          <ul>
            {formats.map(({ value, label }, index) => (
              <li key={index} onClick={() => handleOptionClick(value)}>
                {label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
