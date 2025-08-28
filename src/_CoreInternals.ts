// what is core parts of Konva?
import { Konva as Global } from './Global';

import { Util, Transform } from './Util';
import { Node } from './Node';
import { Container } from './Container';

import { Stage, stages } from './Stage';

import { Layer } from './Layer';
import { FastLayer } from './FastLayer';

import { Group } from './Group';

import { Shape, shapes } from './Shape';

import { Animation } from './Animation';
import { Tween, Easings } from './Tween';

export const Konva = Util._assign(Global, {
  Util,
  Transform,
  Node,
  Container,
  Stage,
  stages,
  Layer,
  FastLayer,
  Group,
  Shape,
  shapes,
  Animation,
  Tween,
  Easings,
});

export default Konva;
