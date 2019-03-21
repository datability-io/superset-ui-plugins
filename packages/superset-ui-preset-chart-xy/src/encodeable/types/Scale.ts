import { ScaleType } from 'vega-lite/build/src/scale';
import { Value } from 'vega-lite/build/src/fielddef';
import { DateTime } from 'vega-lite/build/src/datetime';

export interface Scale<Output extends Value = Value> {
  type?: ScaleType;
  domain?: number[] | string[] | boolean[] | DateTime[];
  range?: Output[];
  scheme?: string;
}

export interface WithScale<Output extends Value = Value> {
  scale?: Scale<Output>;
}
