import React from 'react';
import styles from './channel-inputs.module.css';

export interface ChannelInput {
  value: number | string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  label: string;
  type: 'number' | 'text';
  step?: number;
  min?: number;
  max?: number;
}

export interface ChannelInputsProps {
  inputs: ChannelInput[];
}

const Input: React.FC<ChannelInput> = (input) => {
  const [value, setValue] = React.useState(input.value);

  React.useEffect(() => {
    setValue(input.value);
  }, [input.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
    input.onChange?.(value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    input.onBlur?.(value);
  };
  return (
    <div className={styles.inputWithLabel} key={input.label}>
      <input
        {...input}
        value={value}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      <label>{input.label}</label>
    </div>
  );
};

export const ChannelInputs: React.FC<ChannelInputsProps> = ({ inputs }) => {
  return (
    <div className={styles.inputsContainer}>
      {inputs.map((input) => (
        <Input key={input.label} {...input} />
      ))}
    </div>
  );
};
