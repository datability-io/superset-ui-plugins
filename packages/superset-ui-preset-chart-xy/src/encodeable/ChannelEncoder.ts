import { Value } from 'vega-lite/build/src/fielddef';
import { CategoricalColorScale } from '@superset-ui/color';
import { ScaleOrdinal } from 'd3-scale';
import {
  ChannelDef,
  isScaleFieldDef,
  isMarkPropFieldDef,
  isValueDef,
  isFieldDef,
} from './types/FieldDef';
import { PlainObject } from './types/Data';
import extractScale from './parsers/extractScale';
import extractGetter from './parsers/extractGetter';
import { extractFormatFromChannelDef } from './parsers/extractFormat';
import extractAxis, { isXYChannel } from './parsers/extractAxis';
import isEnabled from './utils/isEnabled';
import isDisabled from './utils/isDisabled';
import { ChannelOptions } from './types/Channel';
import identity from './utils/identity';
import AxisAgent from './AxisAgent';

export default class ChannelEncoder<Def extends ChannelDef<Output>, Output extends Value = Value> {
  readonly name: string;
  readonly definition: Def;
  readonly options: ChannelOptions;

  protected readonly getValue: (datum: PlainObject) => Value;
  readonly scale?: ScaleOrdinal<string, Output> | CategoricalColorScale | ((x: any) => Output);
  readonly encodeValue: (value: any) => Output;
  readonly formatValue: (value: any) => string;
  readonly axis?: AxisAgent<Def, Output>;

  constructor(name: string, definition: Def, options: ChannelOptions = {}) {
    this.name = name;
    this.definition = definition;
    this.options = options;

    this.getValue = extractGetter(definition);
    this.formatValue = extractFormatFromChannelDef(definition);

    const scale = extractScale<Output>(definition, options.namespace);
    this.scale = scale;
    if (typeof scale === 'undefined') {
      this.encodeValue = identity;
    } else if (scale instanceof CategoricalColorScale) {
      this.encodeValue = (value: any) => scale(`${value}`);
    } else {
      this.encodeValue = (value: any) => scale(value);
    }

    this.axis = extractAxis(this);
    this.format = this.format.bind(this);
  }

  get(datum: PlainObject, otherwise?: any) {
    const value = this.getValue(datum);

    return otherwise !== undefined && (value === null || value === undefined) ? otherwise : value;
  }

  encode(datum: PlainObject, otherwise?: Output) {
    const output = this.encodeValue(this.get(datum));

    return otherwise !== undefined && (output === null || output === undefined)
      ? otherwise
      : output;
  }

  format(datum: PlainObject): string {
    return this.formatValue(this.get(datum));
  }

  getTitle() {
    if (isFieldDef(this.definition)) {
      return this.definition.title || this.definition.field;
    }

    return undefined;
  }

  hasLegend() {
    if (isDisabled(this.options.legend)) {
      return false;
    }
    if (isXYChannel(this.name)) {
      return false;
    }
    if (isValueDef(this.definition)) {
      return false;
    }
    if (isMarkPropFieldDef(this.definition)) {
      return isEnabled(this.definition.legend);
    }

    return isScaleFieldDef(this.definition);
  }
}
