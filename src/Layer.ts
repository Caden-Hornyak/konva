import { Util } from './Util';
import { Container, ContainerConfig } from './Container';
import { Node } from './Node';
import { Factory } from './Factory';
import { Stage } from './Stage';
import { getBooleanValidator } from './Validators';
import * as PIXI from "pixi.js";

import { GetSet, Vector2d } from './types';
import { Group } from './Group';
import { Shape, shapes } from './Shape';
import { _registerNode } from './Global';

export interface LayerConfig extends ContainerConfig {
  clearBeforeDraw?: boolean;
  hitGraphEnabled?: boolean;
  imageSmoothingEnabled?: boolean;
}

// constants
const HASH = '#',
  BEFORE_DRAW = 'beforeDraw',
  DRAW = 'draw',
  /*
   * 2 - 3 - 4
   * |       |
   * 1 - 0   5
   *         |
   * 8 - 7 - 6
   */
  INTERSECTION_OFFSETS = [
    { x: 0, y: 0 }, // 0
    { x: -1, y: -1 }, // 2
    { x: 1, y: -1 }, // 4
    { x: 1, y: 1 }, // 6
    { x: -1, y: 1 }, // 8
  ],
  INTERSECTION_OFFSETS_LEN = INTERSECTION_OFFSETS.length;

/**
 * Layer constructor.  Layers are tied to their own canvas element and are used
 * to contain groups or shapes.
 * @constructor
 * @memberof Konva
 * @augments Konva.Container
 * @param {Object} config
 * @param {Boolean} [config.clearBeforeDraw] set this property to false if you don't want
 * to clear the canvas before each layer draw.  The default value is true.
 * @@nodeParams
 * @@containerParams
 * @example
 * var layer = new Konva.Layer();
 * stage.add(layer);
 * // now you can add shapes, groups into the layer
 */

export class Layer extends Container<Group | Shape> {
  _object: PIXI.Container;
  _waitingForDraw = false;

  constructor(config?: LayerConfig) {
    super(config);
    this._object = new PIXI.Container({
    })
  }
  getLayer() {
    return this;
  }
  remove() {
    this._object.parent?.removeChild();
    return this
  }
  getStage() {
    return this.parent as Stage;
  }
  setSize({ width, height }) {
    this._object.setSize(width, height);
    return this;
  }
  _validateAdd(child) {
    const type = child.getType();
    if (type !== 'Group' && type !== 'Shape') {
      Util.throw('You may only add groups and shapes to a layer.');
    }
  }
  /**
   * get/set width of layer. getter return width of stage. setter doing nothing.
   * if you want change width use `stage.width(value);`
   * @name Konva.Layer#width
   * @method
   * @returns {Number}
   * @example
   * var width = layer.width();
   */
  getWidth() {
    if (this.parent) {
      return this.parent.width();
    }
  }
  setWidth() {
    Util.warn(
      'Can not change width of layer. Use "stage.width(value)" function instead.'
    );
  }
  /**
   * get/set height of layer.getter return height of stage. setter doing nothing.
   * if you want change height use `stage.height(value);`
   * @name Konva.Layer#height
   * @method
   * @returns {Number}
   * @example
   * var height = layer.height();
   */
  getHeight() {
    if (this.parent) {
      return this.parent.height();
    }
  }
  setHeight() {
    Util.warn(
      'Can not change height of layer. Use "stage.height(value)" function instead.'
    );
  }

  destroy(): this {
    this._object.destroy();
    return super.destroy();
  }

  hitGraphEnabled: GetSet<boolean, this>;

  clearBeforeDraw: GetSet<boolean, this>;
  imageSmoothingEnabled: GetSet<boolean, this>;
}

Layer.prototype.nodeType = 'Layer';
_registerNode(Layer);

/**
 * get/set imageSmoothingEnabled flag
 * For more info see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled
 * @name Konva.Layer#imageSmoothingEnabled
 * @method
 * @param {Boolean} imageSmoothingEnabled
 * @returns {Boolean}
 * @example
 * // get imageSmoothingEnabled flag
 * var imageSmoothingEnabled = layer.imageSmoothingEnabled();
 *
 * layer.imageSmoothingEnabled(false);
 *
 * layer.imageSmoothingEnabled(true);
 */
Factory.addGetterSetter(Layer, 'imageSmoothingEnabled', true);

/**
 * get/set clearBeforeDraw flag which determines if the layer is cleared or not
 *  before drawing
 * @name Konva.Layer#clearBeforeDraw
 * @method
 * @param {Boolean} clearBeforeDraw
 * @returns {Boolean}
 * @example
 * // get clearBeforeDraw flag
 * var clearBeforeDraw = layer.clearBeforeDraw();
 *
 * // disable clear before draw
 * layer.clearBeforeDraw(false);
 *
 * // enable clear before draw
 * layer.clearBeforeDraw(true);
 */
Factory.addGetterSetter(Layer, 'clearBeforeDraw', true);

Factory.addGetterSetter(Layer, 'hitGraphEnabled', true, getBooleanValidator());
/**
 * get/set hitGraphEnabled flag.  **DEPRECATED!** Use `layer.listening(false)` instead.
 *  Disabling the hit graph will greatly increase
 *  draw performance because the hit graph will not be redrawn each time the layer is
 *  drawn.  This, however, also disables mouse/touch event detection
 * @name Konva.Layer#hitGraphEnabled
 * @method
 * @param {Boolean} enabled
 * @returns {Boolean}
 * @example
 * // get hitGraphEnabled flag
 * var hitGraphEnabled = layer.hitGraphEnabled();
 *
 * // disable hit graph
 * layer.hitGraphEnabled(false);
 *
 * // enable hit graph
 * layer.hitGraphEnabled(true);
 */
