import { Factory } from '../Factory';
import { Shape, ShapeConfig } from '../Shape';
import { _registerNode } from '../Global';

import { Util } from '../Util';
import { GetSet } from '../types';
import { getNumberOrArrayOfNumbersValidator } from '../Validators';
import * as PIXI from "pixi.js";
import { stages } from '../Stage';

const TEXTURE_LENGTH = 128;

export interface RectConfig extends ShapeConfig {
  cornerRadius?: number | number[];
}

const textureCache: Record<string, PIXI.Texture> = {};

/**
 * Rect constructor
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {Number} [config.cornerRadius]
 * @@shapeParams
 * @@nodeParams
 * @example
 * var rect = new Konva.Rect({
 *   width: 100,
 *   height: 50,
 *   fill: 'red',
 *   stroke: 'black',
 *   strokeWidth: 5
 * });
 */
export class Rect extends Shape<RectConfig> {
  _object: PIXI.NineSlicePlane

  constructor(config?: RectConfig) {
    super(config);

    const cornerRadius = Array.isArray(config?.cornerRadius) 
      ? config?.cornerRadius.length === 4 ? config?.cornerRadius : config?.cornerRadius[0]
      : Array.from({length: 4 }).fill(config?.cornerRadius ?? 0),
      width = config?.width ?? 0,
      height = config?.height ?? 0,
      strokeWidth = config?.strokeWidth ?? 0,
      stroke = (config?.stroke ?? "black") as string;

    let cornerRadiusList: number[] = [
        Math.min(cornerRadius[0] || 0, width / 2, height / 2),
        Math.min(cornerRadius[1] || 0, width / 2, height / 2),
        Math.min(cornerRadius[2] || 0, width / 2, height / 2),
        Math.min(cornerRadius[3] || 0, width / 2, height / 2)
    ];

    for (let corner of cornerRadiusList) { corner = (corner / Math.min(width, height)) * TEXTURE_LENGTH}

    let texture: PIXI.Texture;
    const textureKey = `${cornerRadiusList[0]}_${cornerRadiusList[1]}_${cornerRadiusList[2]}_${cornerRadiusList[3]}_${stroke}_${strokeWidth}`;
    if (textureCache[textureKey]) {
      texture = textureCache[textureKey];
    } else {
      const graphics: PIXI.Graphics = new PIXI.Graphics();
      graphics.beginPath();
      if (!cornerRadius) {
        graphics.rect(0, 0, TEXTURE_LENGTH, TEXTURE_LENGTH);
      } else {
        Util.drawRoundedRectPath(graphics, TEXTURE_LENGTH, TEXTURE_LENGTH, cornerRadiusList);
      }

      graphics
        .setStrokeStyle({
          width: strokeWidth, 
          color: stroke
        })
        .stroke()
        .fill(0xFFFFFF);
      texture = stages[0].application.renderer.generateTexture(graphics);
      textureCache[textureKey] = texture;
    }
    this._object = new PIXI.NineSlicePlane(
      texture, 
      Math.max(cornerRadiusList[0], cornerRadiusList[3]),
      Math.max(cornerRadiusList[1], cornerRadiusList[1]),
      Math.max(cornerRadiusList[1], cornerRadiusList[2]),
      Math.max(cornerRadiusList[2], cornerRadiusList[3]),
    );
    
    this.setAttrs(config);
  }
  
  cornerRadius: GetSet<number | number[], this>;
}

Rect.prototype.className = 'Rect';
_registerNode(Rect);

/**
 * get/set corner radius
 * @method
 * @name Konva.Rect#cornerRadius
 * @param {Number} cornerRadius
 * @returns {Number}
 * @example
 * // get corner radius
 * var cornerRadius = rect.cornerRadius();
 *
 * // set corner radius
 * rect.cornerRadius(10);
 *
 * // set different corner radius values
 * // top-left, top-right, bottom-right, bottom-left
 * rect.cornerRadius([0, 10, 20, 30]);
 */
Factory.addGetterSetter(
  Rect,
  'cornerRadius',
  0,
  getNumberOrArrayOfNumbersValidator(4),
);
