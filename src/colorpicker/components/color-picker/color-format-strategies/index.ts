import {ColorGamut, ColorFormat} from '../../../types';
import {RGBColorFormat} from './RGBColorFormat.ts';
import {HSLColorFormat} from './HSLColorFormat.ts';
import {LCHColorFormat} from './LCHColorFormat.ts';
import {LABColorFormat} from './LABColorFormat.ts';
import {P3ColorFormat} from './P3ColorFormat.ts';
import {FallbackColorFormat} from './FallbackColorFormat.ts';
import {ChannelInput} from '../../index.ts';

export interface ColorFormatStrategy {
    colorFormat: ColorFormat | undefined;
    colorGamut: ColorGamut;
    getInputs: (
        color: string,
        onChange: (color: string) => void
    ) => ChannelInput[];
}

export const Strategies: Record<ColorFormat | 'default', ColorFormatStrategy> =
    {
        srgb: new RGBColorFormat(),
        hsl: new HSLColorFormat(),
        lab: new LABColorFormat(),
        lch: new LCHColorFormat(),
        p3: new P3ColorFormat(),
        default: new FallbackColorFormat(),
    };
