import { colorLib } from '../../../lib';
import { ChannelInput } from '../../channel-inputs/channel-inputs.tsx';
import { ColorFormat } from '../../../types';

export const createAlphaInput = (
  color: string,
  onChange: (color: string) => void,
  colorFormat: ColorFormat
): ChannelInput => {
  return {
    value: colorLib.getAlpha(color),
    type: 'number',
    min: 0,
    max: 1,
    step: 0.01,
    label: 'A',
    onChange: (value) => {
      const channels = colorLib.getChannels(color);
      onChange(colorLib.createColor(colorFormat, channels, parseFloat(value)));
    },
  };
};
