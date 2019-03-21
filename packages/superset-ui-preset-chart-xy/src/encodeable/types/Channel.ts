import { ValueDef } from 'vega-lite/build/src/fielddef';
import { XFieldDef, YFieldDef, MarkPropFieldDef, TextFieldDef } from './FieldDef';

// eslint-disable-next-line import/prefer-default-export
export interface ChannelOptions {
  namespace?: string;
  legend?: boolean;
}

export type ChannelType = 'X' | 'Y' | 'MarkProp' | 'Text';

export interface ChannelTypeToFieldDefMap {
  X: XFieldDef;
  Y: YFieldDef;
  MarkProp: MarkPropFieldDef | ValueDef;
  Text: TextFieldDef | ValueDef;
}
