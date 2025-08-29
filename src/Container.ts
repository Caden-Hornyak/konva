import { Factory } from './Factory';
import { Node, NodeConfig } from './Node';
import { Shape } from './Shape';
import { GetSet, IRect } from './types';
import { getNumberValidator } from './Validators';
import * as PIXI from "pixi.js";

export type ClipFuncOutput =
  | void
  | [Path2D | CanvasFillRule]
  | [Path2D, CanvasFillRule];
export interface ContainerConfig extends NodeConfig {
  clearBeforeDraw?: boolean;
  clipX?: number;
  clipY?: number;
  clipWidth?: number;
  clipHeight?: number;
}

/**
 * Container constructor.&nbsp; Containers are used to contain nodes or other containers
 * @constructor
 * @memberof Konva
 * @augments Konva.Node
 * @abstract
 * @param {Object} config
 * @@nodeParams
 * @@containerParams
 */
export abstract class Container<
  ChildType extends Node = Node
> extends Node<ContainerConfig> {
  children: Record<string, ChildType[]> = {};
  _object: PIXI.Container;

  
  constructor(config?: ContainerConfig) {
    super(config);
    this._object = new PIXI.Container({})
  }
  /**
   * returns an array of direct descendant nodes
   * @method
   * @name Konva.Container#getChildren
   * @param {Function} [filterFunc] filter function
   * @returns {Array}
   * @example
   * // get all children
   * var children = layer.getChildren();
   *
   * // get only circles
   * var circles = layer.getChildren(function(node){
   *    return node.getClassName() === 'Circle';
   * });
   */
  getChildren(filterFunc?: (item: Node) => boolean) {
    const children = this.children || {};
    return children
  }
  /**
   * determine if node has children
   * @method
   * @name Konva.Container#hasChildren
   * @returns {Boolean}
   */
  hasChildren() {
    let hasChildren = false;
    for (let key in this.children) {
        hasChildren = true;
        break;
    }
    return hasChildren;
  }
  /**
   * remove all children. Children will be still in memory.
   * If you want to completely destroy all children please use "destroyChildren" method instead
   * @method
   * @name Konva.Container#removeChildren
   */
  removeChildren() {
    for (let key in this.children) {
        for (let child of this.children[key]) {
            child.parent = null;
            child.index = 0;
            child.remove();
        }
    }
    this.children = {};
    return this;
  }
  /**
   * destroy all children nodes.
   * @method
   * @name Konva.Container#destroyChildren
   */
  destroyChildren() {
    for (let key in this.children) {
        for (let child of this.children[key]) {
            child.parent = null;
            child.index = 0;
            child.destroy();
        }
    }
    this.children = {};
    return this;
  }
  abstract _validateAdd(node: Node): void;
  /**
   * add a child and children into container
   * @name Konva.Container#add
   * @method
   * @param {...Konva.Node} children
   * @returns {Container}
   * @example
   * layer.add(rect);
   * layer.add(shape1, shape2, shape3);
   * // empty arrays are accepted, though each individual child must be defined
   * layer.add(...shapes);
   */
  add(...children: ChildType[]) {
    if (children.length === 0) {
      return this;
    }
    if (children.length > 1) {
      for (let i = 0; i < children.length; i++) {
        this.add(children[i]);
      }
      return this;
    }
    const child = children[0];
    const childName = child.name();
    if (child && child.parent) {
      child.remove();
    }

    this._object.addChild(child._object);
    child.parent = this; 
    this.children[childName] = this.children[childName] ?? [];
    this.children[childName].push(child)
    // chainable
    return this;
  }
  destroy() {
    if (this.hasChildren()) {
      this.destroyChildren();
    }
    super.destroy();
    return this;
  }
  /**
   * return an array of nodes that match the selector.
   * You can provide a string with '#' for id selections and '.' for name selections.
   * Or a function that will return true/false when a node is passed through.  See example below.
   * With strings you can also select by type or class name. Pass multiple selectors
   * separated by a comma.
   * @method
   * @name Konva.Container#find
   * @param {String | Function} selector
   * @returns {Array}
   * @example
   *
   * Passing a string as a selector
   * // select node with id foo
   * var node = stage.find('#foo');
   *
   * // select nodes with name bar inside layer
   * var nodes = layer.find('.bar');
   *
   * // select all groups inside layer
   * var nodes = layer.find('Group');
   *
   * // select all rectangles inside layer
   * var nodes = layer.find('Rect');
   *
   * // select node with an id of foo or a name of bar inside layer
   * var nodes = layer.find('#foo, .bar');
   *
   * Passing a function as a selector
   *
   * // get all groups with a function
   * var groups = stage.find(node => {
   *  return node.getType() === 'Group';
   * });
   *
   * // get only Nodes with partial opacity
   * var alphaNodes = layer.find(node => {
   *  return node.getType() === 'Node' && node.getAbsoluteOpacity() < 1;
   * });
   */
  find<ChildNode extends Node>(selector): Array<ChildNode> {
    // protecting _generalFind to prevent user from accidentally adding
    // second argument and getting unexpected `findOne` result
    const cleanSelector = selector[0] === "#" || selector[0] === "." ? selector.slice(1) : selector;
    return (this.children[cleanSelector] ?? []) as unknown as ChildNode[];
  }
  /**
   * return a first node from `find` method
   * @method
   * @name Konva.Container#findOne
   * @param {String | Function} selector
   * @returns {Konva.Node | Undefined}
   * @example
   * // select node with id foo
   * var node = stage.findOne('#foo');
   *
   * // select node with name bar inside layer
   * var nodes = layer.findOne('.bar');
   *
   * // select the first node to return true in a function
   * var node = stage.findOne(node => {
   *  return node.getType() === 'Shape'
   * })
   */
  findOne<ChildNode extends Node = Node>(
    selector: string
  ): ChildNode | undefined {
    const cleanSelector = selector[0] === "#" || selector[0] === "." ? selector.slice(1) : selector;
    return ((this.children[cleanSelector] ? this.children[cleanSelector][0] : undefined) ?? []) as unknown as ChildNode;
  }

  // extenders
  toObject() {
    const obj = Node.prototype.toObject.call(this);

    obj.children = [];

    for (let key in this.children) {
      for (let child of this.children[key]) {
        obj.children!.push(child.toObject());
      }
    }
    return obj;
  }
  /**
   * determine if node is an ancestor
   * of descendant
   * @method
   * @name Konva.Container#isAncestorOf
   * @param {Konva.Node} node
   */
  isAncestorOf(node: Node) {
    let parent = node.getParent();
    while (parent) {
      if (parent._id === this._id) {
        return true;
      }
      parent = parent.getParent();
    }

    return false;
  }

  getClientRect(
    config: {
      skipTransform?: boolean;
      skipShadow?: boolean;
      skipStroke?: boolean;
      relativeTo?: Container<Node>;
    } = {}
  ): IRect {
    const skipTransform = config.skipTransform;
    const relativeTo = config.relativeTo;

    let minX, minY, maxX, maxY;
    let selfRect = {
      x: Infinity,
      y: Infinity,
      width: 0,
      height: 0,
    };
    const that = this;
    for (let key in this.children) {
      for (let child of this.children[key]) {
        // skip invisible children
        if (!child.visible()) {
          continue;
        }

        const rect = child.getClientRect({
          relativeTo: that,
          skipShadow: config.skipShadow,
          skipStroke: config.skipStroke,
        });

        // skip invisible children (like empty groups)
        if (rect.width === 0 && rect.height === 0) {
          continue;
        }

        if (minX === undefined) {
          // initial value for first child
          minX = rect.x;
          minY = rect.y;
          maxX = rect.x + rect.width;
          maxY = rect.y + rect.height;
        } else {
          minX = Math.min(minX, rect.x);
          minY = Math.min(minY, rect.y);
          maxX = Math.max(maxX, rect.x + rect.width);
          maxY = Math.max(maxY, rect.y + rect.height);
        }

    
      }
    }
      // if child is group we need to make sure it has visible shapes inside
    const shapes = this.find('Shape');
    let hasVisible = false;
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      if (shape._isVisible(this)) {
        hasVisible = true;
        break;
      }
    }
    if (hasVisible && minX !== undefined) {
      selfRect = {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    } else {
      selfRect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    }

    if (!skipTransform) {
      return this._transformedRect(selfRect, relativeTo);
    }
    return selfRect;
  }

  clip: GetSet<IRect, this>;
  clipX: GetSet<number, this>;
  clipY: GetSet<number, this>;
  clipWidth: GetSet<number, this>;
  clipHeight: GetSet<number, this>;
  // there was "this" instead of "Container<ChildType>",
  // but it breaks react-konva types: https://github.com/konvajs/react-konva/issues/390
  clipFunc: GetSet<
    (ctx: CanvasRenderingContext2D, shape: Container) => ClipFuncOutput,
    this
  >;
}

// add getters setters
Factory.addComponentsGetterSetter(Container, 'clip', [
  'x',
  'y',
  'width',
  'height',
]);
/**
 * get/set clip
 * @method
 * @name Konva.Container#clip
 * @param {Object} clip
 * @param {Number} clip.x
 * @param {Number} clip.y
 * @param {Number} clip.width
 * @param {Number} clip.height
 * @returns {Object}
 * @example
 * // get clip
 * var clip = container.clip();
 *
 * // set clip
 * container.clip({
 *   x: 20,
 *   y: 20,
 *   width: 20,
 *   height: 20
 * });
 */

Factory.addGetterSetter(Container, 'clipX', undefined, getNumberValidator());
/**
 * get/set clip x
 * @name Konva.Container#clipX
 * @method
 * @param {Number} x
 * @returns {Number}
 * @example
 * // get clip x
 * var clipX = container.clipX();
 *
 * // set clip x
 * container.clipX(10);
 */

Factory.addGetterSetter(Container, 'clipY', undefined, getNumberValidator());
/**
 * get/set clip y
 * @name Konva.Container#clipY
 * @method
 * @param {Number} y
 * @returns {Number}
 * @example
 * // get clip y
 * var clipY = container.clipY();
 *
 * // set clip y
 * container.clipY(10);
 */

Factory.addGetterSetter(
  Container,
  'clipWidth',
  undefined,
  getNumberValidator()
);
/**
 * get/set clip width
 * @name Konva.Container#clipWidth
 * @method
 * @param {Number} width
 * @returns {Number}
 * @example
 * // get clip width
 * var clipWidth = container.clipWidth();
 *
 * // set clip width
 * container.clipWidth(100);
 */

Factory.addGetterSetter(
  Container,
  'clipHeight',
  undefined,
  getNumberValidator()
);
/**
 * get/set clip height
 * @name Konva.Container#clipHeight
 * @method
 * @param {Number} height
 * @returns {Number}
 * @example
 * // get clip height
 * var clipHeight = container.clipHeight();
 *
 * // set clip height
 * container.clipHeight(100);
 */

Factory.addGetterSetter(Container, 'clipFunc');
/**
 * get/set clip function
 * @name Konva.Container#clipFunc
 * @method
 * @param {Function} function
 * @returns {Function}
 * @example
 * // get clip function
 * var clipFunction = container.clipFunc();
 *
 * // set clip function
 * container.clipFunc(function(ctx) {
 *   ctx.rect(0, 0, 100, 100);
 * });
 *
 * container.clipFunc(function(ctx) {
 *   // optionally return a clip Path2D and clip-rule or just the clip-rule
 *   return [new Path2D('M0 0v50h50Z'), 'evenodd']
 * });
 */
