import { Factory } from '../Factory';
import { Shape, ShapeConfig } from '../Shape';
import { _registerNode } from '../Global';

import { Util } from '../Util';
import { GetSet } from '../types';
import { getNumberOrArrayOfNumbersValidator } from '../Validators';
import * as PIXI from "pixi.js";
import { stages } from '../Stage';

const TEXTURE_WIDTH = 64,
      TEXTURE_HEIGHT = 64;

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

    const graphics: PIXI.Graphics = new PIXI.Graphics();
    const cornerRadius = this.cornerRadius(),
      width = this.width(),
      height = this.height(),
      x = this.x(),
      y = this.y();

    graphics.beginPath();

    let cornerRadiusList: number[] = [0, 0, 0, 0];
    
    if (!cornerRadius) {
      graphics
      .rect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT)
      .fill(0xFFFFFF)
      .setStrokeStyle({
          width: this.strokeWidth() ?? 0, 
          color: this.stroke() ?? 0x000000
      });
    } else {
      cornerRadiusList = Util.drawRoundedRectPath(graphics, TEXTURE_WIDTH, TEXTURE_HEIGHT, cornerRadius);
      graphics.fill(0xFFFFFF)
    }

    let texture: PIXI.Texture;
    const textureKey = `${cornerRadiusList[0]}_${cornerRadiusList[1]}_${cornerRadiusList[2]}_${cornerRadiusList[3]}`;
    if (textureCache[textureKey]) {
      texture = textureCache[textureKey];
    } else {
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
    this._object.tint = this.fill() ?? 0xFF0000;
    this._object.width = width;
    this._object.height = height
    this._object.x = x;
    this._object.y = y;
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
