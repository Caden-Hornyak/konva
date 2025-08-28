// we need to import core of the Konva and then extend it with all additional objects

import { Konva as Core } from './_CoreInternals';

// shapes
import { Circle } from './shapes/Circle';
import { Image } from './shapes/Image';
import { Line } from './shapes/Line';
import { Path } from './shapes/Path';
import { Rect } from './shapes/Rect';
import { RegularPolygon } from './shapes/RegularPolygon';
import { Text } from './shapes/Text';

// filters
import { Blur } from './filters/Blur';
import { Brighten } from './filters/Brighten';
import { Contrast } from './filters/Contrast';
import { Emboss } from './filters/Emboss';
import { Enhance } from './filters/Enhance';
import { Grayscale } from './filters/Grayscale';
import { HSL } from './filters/HSL';
import { HSV } from './filters/HSV';
import { Invert } from './filters/Invert';
import { Mask } from './filters/Mask';
import { Noise } from './filters/Noise';
import { Pixelate } from './filters/Pixelate';
import { Posterize } from './filters/Posterize';
import { RGB } from './filters/RGB';
import { RGBA } from './filters/RGBA';
import { Sepia } from './filters/Sepia';
import { Solarize } from './filters/Solarize';
import { Threshold } from './filters/Threshold';

export const Konva = Core.Util._assign(Core, {
  Circle,
  Image,
  Line,
  Path,
  Rect,
  RegularPolygon,
  Text,
  
  /**
   * @namespace Filters
   * @memberof Konva
   */
  Filters: {
    Blur,
    Brighten,
    Contrast,
    Emboss,
    Enhance,
    Grayscale,
    HSL,
    HSV,
    Invert,
    Mask,
    Noise,
    Pixelate,
    Posterize,
    RGB,
    RGBA,
    Sepia,
    Solarize,
    Threshold,
  },
});
