import { ColorFormatStrategy } from './index.ts';
import { colorLib } from '../../../lib';
import { createGenericAlphaInput } from './createGenericAlphaInput.ts';
import { ChannelInput } from '../../channel-inputs/channel-inputs.tsx';

export class P3ColorFormat implements ColorFormatStrategy {
  colorFormat: ColorFormatStrategy['colorFormat'] = 'p3';
  colorGamut: ColorFormatStrategy['colorGamut'] = 'p3';

  getInputs = (color: string, onChange: (color: string) => void) => {
    const alphaInput = createGenericAlphaInput(
      color,
      onChange,
      this.colorFormat!
    );
    return colorLib
      .getChannels(color)
      .map((channel, index) => {
        return {
          value: channel,
          type: 'number',
          min: -1,
          max: 1,
          step: 0.01,
          label: ['R', 'G', 'B'][index],
          onChange: (value) => {
            const newChannels = colorLib.getChannels(color);
            newChannels[index] = parseFloat(value);
            onChange(colorLib.createColor(this.colorFormat!, newChannels));
          },
        } as ChannelInput;
      })
      .concat(alphaInput);
  };
}
