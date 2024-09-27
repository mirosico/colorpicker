import { ColorFormatStrategy } from './index.ts';
import { colorLib } from '../../../lib';
import { createAlphaInput } from './createAlphaInput.ts';
import { ChannelInput } from '../../channel-inputs/channel-inputs.tsx';

export class LABColorFormat implements ColorFormatStrategy {
  colorFormat: ColorFormatStrategy['colorFormat'] = 'lab';
  colorGamut: ColorFormatStrategy['colorGamut'] = 'p3';

  getInputs = (color: string, onChange: (color: string) => void) => {
    const alphaInput = createAlphaInput(color, onChange, this.colorFormat!);
    return colorLib
      .getChannels(color)
      .map((channel, index) => {
        const channelMinMax = colorLib.getChannelsMinMax(color)?.[index];
        const [min, max] = channelMinMax ?? [];
        return {
          value: channel,
          type: 'number',
          min,
          max,
          step: 1,
          label: ['l', 'a', 'b'][index],
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
