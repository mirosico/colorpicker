import { ColorFormatStrategy } from './index.ts';
import { ChannelInput } from '../../channel-inputs/channel-inputs.tsx';

export class FallbackColorFormat implements ColorFormatStrategy {
  colorFormat: ColorFormatStrategy['colorFormat'] = undefined;
  colorGamut: ColorFormatStrategy['colorGamut'] = 'srgb';

  localColor: string = '';

  getInputs = (color: string, onChange: (color: string) => void) => {
    return [
      {
        value: this.localColor || color,
        type: 'text',
        label: 'Color',
        onBlur: onChange,
      } as ChannelInput,
    ];
  };
}
