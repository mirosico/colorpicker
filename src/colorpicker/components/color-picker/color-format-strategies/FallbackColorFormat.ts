import { ColorFormatStrategy } from './index.ts';
import { ChannelInput } from '../../channel-inputs/channel-inputs.tsx';

export class FallbackColorFormat implements ColorFormatStrategy {
  colorFormat: ColorFormatStrategy['colorFormat'] = undefined;
  colorGamut: ColorFormatStrategy['colorGamut'] = 'srgb';

  getInputs = (color: string, onChange: (color: string) => void) => {
    return [
      {
        value: color,
        type: 'text',
        label: 'Color',
        onBlur: onChange,
      } as ChannelInput,
    ];
  };
}
