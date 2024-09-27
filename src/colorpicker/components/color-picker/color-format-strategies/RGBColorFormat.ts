import { ColorFormatStrategy } from './index.ts';
import { colorLib } from '../../../lib';
import _ from 'lodash';
import { createGenericAlphaInput } from './createGenericAlphaInput.ts';
import { ChannelInput } from '../../channel-inputs/channel-inputs.tsx';

export class RGBColorFormat implements ColorFormatStrategy {
  colorFormat: ColorFormatStrategy['colorFormat'] = 'srgb';
  colorGamut: ColorFormatStrategy['colorGamut'] = 'srgb';

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
          value: Math.round(channel * 255),
          type: 'number',
          min: 0,
          max: 255,
          step: 1,
          label: ['R', 'G', 'B'][index],
          onChange: (valueString) => {
            const value = parseFloat(valueString);
            const newChannels = colorLib.getChannels(color);
            const safeValue = Number.isFinite(value)
              ? _.clamp(value, 0, 255)
              : 0;
            newChannels[index] = safeValue / 255;
            onChange(colorLib.createColor(this.colorFormat!, newChannels));
          },
        } as ChannelInput;
      })
      .concat(alphaInput);
  };
}
