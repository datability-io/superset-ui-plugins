import { Axis } from 'vega-lite/build/src/axis';
import { Value } from 'vega-lite/build/src/fielddef';
import { ChannelDef, isPositionFieldDef } from '../types/FieldDef';
import AxisAgent from '../AxisAgent';
import ChannelEncoder from '../ChannelEncoder';
import isEnabled from '../utils/isEnabled';

export function isXYChannel(channelName: string) {
  return channelName === 'x' || channelName === 'y';
}

function isAxisEnabled(axis: any): axis is Axis {
  return isEnabled(axis);
}

export default function extractAxis<Def extends ChannelDef<Output>, Output extends Value = Value>(
  channel: ChannelEncoder<Def, Output>,
) {
  if (
    isXYChannel(channel.name) &&
    isPositionFieldDef(channel.definition) &&
    isAxisEnabled(channel.definition.axis)
  ) {
    return new AxisAgent(channel, channel.definition);
  }

  return undefined;
}
