import * as PIXI from 'pixi.js';

/*
 * Konva JavaScript Framework v@@version
 * http://konvajs.org/
 * Licensed under the MIT
 * Date: @@date
 *
 * Original work Copyright (C) 2011 - 2013 by Eric Rowell (KineticJS)
 * Modified work Copyright (C) 2014 - present by Anton Lavrenov (Konva)
 *
 * @license
 */
const PI_OVER_180 = Math.PI / 180;
/**
 * @namespace Konva
 */
function detectBrowser() {
    return (typeof window !== 'undefined' &&
        // browser case
        ({}.toString.call(window) === '[object Window]' ||
            // electron case
            {}.toString.call(window) === '[object global]'));
}
const glob = typeof global !== 'undefined'
    ? global
    : typeof window !== 'undefined'
        ? window
        : typeof WorkerGlobalScope !== 'undefined'
            ? self
            : {};
const Konva$2 = {
    _global: glob,
    version: '@@version',
    isBrowser: detectBrowser(),
    isUnminified: /param/.test(function (param) { }.toString()),
    dblClickWindow: 400,
    getAngle(angle) {
        return Konva$2.angleDeg ? angle * PI_OVER_180 : angle;
    },
    enableTrace: false,
    pointerEventsEnabled: true,
    /**
     * Should Konva automatically update canvas on any changes. Default is true.
     * @property autoDrawEnabled
     * @default true
     * @name autoDrawEnabled
     * @memberof Konva
     * @example
     * Konva.autoDrawEnabled = true;
     */
    autoDrawEnabled: true,
    /**
     * Should we enable hit detection while dragging? For performance reasons, by default it is false.
     * But on some rare cases you want to see hit graph and check intersections. Just set it to true.
     * @property hitOnDragEnabled
     * @default false
     * @name hitOnDragEnabled
     * @memberof Konva
     * @example
     * Konva.hitOnDragEnabled = true;
     */
    hitOnDragEnabled: false,
    /**
     * Should we capture touch events and bind them to the touchstart target? That is how it works on DOM elements.
     * The case: we touchstart on div1, then touchmove out of that element into another element div2.
     * DOM will continue trigger touchmove events on div1 (not div2). Because events are "captured" into initial target.
     * By default Konva do not do that and will trigger touchmove on another element, while pointer is moving.
     * @property capturePointerEventsEnabled
     * @default false
     * @name capturePointerEventsEnabled
     * @memberof Konva
     * @example
     * Konva.capturePointerEventsEnabled = true;
     */
    capturePointerEventsEnabled: false,
    _mouseListenClick: false,
    _touchListenClick: false,
    _pointerListenClick: false,
    _mouseInDblClickWindow: false,
    _touchInDblClickWindow: false,
    _pointerInDblClickWindow: false,
    _mouseDblClickPointerId: null,
    _touchDblClickPointerId: null,
    _pointerDblClickPointerId: null,
    _fixTextRendering: false,
    /**
     * Global pixel ratio configuration. KonvaJS automatically detect pixel ratio of current device.
     * But you may override such property, if you want to use your value. Set this value before any components initializations.
     * @property pixelRatio
     * @default undefined
     * @name pixelRatio
     * @memberof Konva
     * @example
     * // before any Konva code:
     * Konva.pixelRatio = 1;
     */
    pixelRatio: (typeof window !== 'undefined' && window.devicePixelRatio) || 1,
    /**
     * Drag distance property. If you start to drag a node you may want to wait until pointer is moved to some distance from start point,
     * only then start dragging. Default is 3px.
     * @property dragDistance
     * @default 0
     * @memberof Konva
     * @example
     * Konva.dragDistance = 10;
     */
    dragDistance: 3,
    /**
     * Use degree values for angle properties. You may set this property to false if you want to use radian values.
     * @property angleDeg
     * @default true
     * @memberof Konva
     * @example
     * node.rotation(45); // 45 degrees
     * Konva.angleDeg = false;
     * node.rotation(Math.PI / 2); // PI/2 radian
     */
    angleDeg: true,
    /**
     * Show different warnings about errors or wrong API usage
     * @property showWarnings
     * @default true
     * @memberof Konva
     * @example
     * Konva.showWarnings = false;
     */
    showWarnings: true,
    /**
     * Configure what mouse buttons can be used for drag and drop.
     * Default value is [0] - only left mouse button.
     * @property dragButtons
     * @default true
     * @memberof Konva
     * @example
     * // enable left and right mouse buttons
     * Konva.dragButtons = [0, 2];
     */
    dragButtons: [0, 1],
    /**
     * returns whether or not drag and drop is currently active
     * @method
     * @memberof Konva
     */
    isDragging() {
        return Konva$2['DD'].isDragging;
    },
    isTransforming() {
        var _a;
        return (_a = Konva$2['Transformer']) === null || _a === void 0 ? void 0 : _a.isTransforming();
    },
    /**
     * returns whether or not a drag and drop operation is ready, but may
     *  not necessarily have started
     * @method
     * @memberof Konva
     */
    isDragReady() {
        return !!Konva$2['DD'].node;
    },
    /**
     * Should Konva release canvas elements on destroy. Default is true.
     * Useful to avoid memory leak issues in Safari on macOS/iOS.
     * @property releaseCanvasOnDestroy
     * @default true
     * @name releaseCanvasOnDestroy
     * @memberof Konva
     * @example
     * Konva.releaseCanvasOnDestroy = true;
     */
    releaseCanvasOnDestroy: true,
    // user agent
    document: glob.document,
    // insert Konva into global namespace (window)
    // it is required for npm packages
    _injectGlobal(Konva) {
        glob.Konva = Konva;
    },
};
const _registerNode = (NodeClass) => {
    Konva$2[NodeClass.prototype.getClassName()] = NodeClass;
};
Konva$2._injectGlobal(Konva$2);

/*
 * Last updated November 2011
 * By Simon Sarris
 * www.simonsarris.com
 * sarris@acm.org
 *
 * Free to use and distribute at will
 * So long as you are nice to people, etc
 */
/*
 * The usage of this class was inspired by some of the work done by a forked
 * project, KineticJS-Ext by Wappworks, which is based on Simon's Transform
 * class.  Modified by Eric Rowell
 */
/**
 * Transform constructor.
 * In most of the cases you don't need to use it in your app. Because it is for internal usage in Konva core.
 * But there is a documentation for that class in case you still want
 * to make some manual calculations.
 * @constructor
 * @param {Array} [m] Optional six-element matrix
 * @memberof Konva
 */
class Transform {
    constructor(m = [1, 0, 0, 1, 0, 0]) {
        this.dirty = false;
        this.m = (m && m.slice()) || [1, 0, 0, 1, 0, 0];
    }
    reset() {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 1;
        this.m[4] = 0;
        this.m[5] = 0;
    }
    /**
     * Copy Konva.Transform object
     * @method
     * @name Konva.Transform#copy
     * @returns {Konva.Transform}
     * @example
     * const tr = shape.getTransform().copy()
     */
    copy() {
        return new Transform(this.m);
    }
    copyInto(tr) {
        tr.m[0] = this.m[0];
        tr.m[1] = this.m[1];
        tr.m[2] = this.m[2];
        tr.m[3] = this.m[3];
        tr.m[4] = this.m[4];
        tr.m[5] = this.m[5];
    }
    /**
     * Transform point
     * @method
     * @name Konva.Transform#point
     * @param {Object} point 2D point(x, y)
     * @returns {Object} 2D point(x, y)
     */
    point(point) {
        const m = this.m;
        return {
            x: m[0] * point.x + m[2] * point.y + m[4],
            y: m[1] * point.x + m[3] * point.y + m[5],
        };
    }
    /**
     * Apply translation
     * @method
     * @name Konva.Transform#translate
     * @param {Number} x
     * @param {Number} y
     * @returns {Konva.Transform}
     */
    translate(x, y) {
        this.m[4] += this.m[0] * x + this.m[2] * y;
        this.m[5] += this.m[1] * x + this.m[3] * y;
        return this;
    }
    /**
     * Apply scale
     * @method
     * @name Konva.Transform#scale
     * @param {Number} sx
     * @param {Number} sy
     * @returns {Konva.Transform}
     */
    scale(sx, sy) {
        this.m[0] *= sx;
        this.m[1] *= sx;
        this.m[2] *= sy;
        this.m[3] *= sy;
        return this;
    }
    /**
     * Apply rotation
     * @method
     * @name Konva.Transform#rotate
     * @param {Number} rad  Angle in radians
     * @returns {Konva.Transform}
     */
    rotate(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        const m11 = this.m[0] * c + this.m[2] * s;
        const m12 = this.m[1] * c + this.m[3] * s;
        const m21 = this.m[0] * -s + this.m[2] * c;
        const m22 = this.m[1] * -s + this.m[3] * c;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    }
    /**
     * Returns the translation
     * @method
     * @name Konva.Transform#getTranslation
     * @returns {Object} 2D point(x, y)
     */
    getTranslation() {
        return {
            x: this.m[4],
            y: this.m[5],
        };
    }
    /**
     * Apply skew
     * @method
     * @name Konva.Transform#skew
     * @param {Number} sx
     * @param {Number} sy
     * @returns {Konva.Transform}
     */
    skew(sx, sy) {
        const m11 = this.m[0] + this.m[2] * sy;
        const m12 = this.m[1] + this.m[3] * sy;
        const m21 = this.m[2] + this.m[0] * sx;
        const m22 = this.m[3] + this.m[1] * sx;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    }
    /**
     * Transform multiplication
     * @method
     * @name Konva.Transform#multiply
     * @param {Konva.Transform} matrix
     * @returns {Konva.Transform}
     */
    multiply(matrix) {
        const m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
        const m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
        const m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
        const m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
        const dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
        const dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        this.m[4] = dx;
        this.m[5] = dy;
        return this;
    }
    /**
     * Invert the matrix
     * @method
     * @name Konva.Transform#invert
     * @returns {Konva.Transform}
     */
    invert() {
        const d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
        const m0 = this.m[3] * d;
        const m1 = -this.m[1] * d;
        const m2 = -this.m[2] * d;
        const m3 = this.m[0] * d;
        const m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
        const m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
        this.m[0] = m0;
        this.m[1] = m1;
        this.m[2] = m2;
        this.m[3] = m3;
        this.m[4] = m4;
        this.m[5] = m5;
        return this;
    }
    /**
     * return matrix
     * @method
     * @name Konva.Transform#getMatrix
     */
    getMatrix() {
        return this.m;
    }
    /**
     * convert transformation matrix back into node's attributes
     * @method
     * @name Konva.Transform#decompose
     * @returns {Konva.Transform}
     */
    decompose() {
        const a = this.m[0];
        const b = this.m[1];
        const c = this.m[2];
        const d = this.m[3];
        const e = this.m[4];
        const f = this.m[5];
        const delta = a * d - b * c;
        const result = {
            x: e,
            y: f,
            rotation: 0,
            scaleX: 0,
            scaleY: 0,
            skewX: 0,
            skewY: 0,
        };
        // Apply the QR-like decomposition.
        if (a != 0 || b != 0) {
            const r = Math.sqrt(a * a + b * b);
            result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
            result.scaleX = r;
            result.scaleY = delta / r;
            result.skewX = (a * c + b * d) / delta;
            result.skewY = 0;
        }
        else if (c != 0 || d != 0) {
            const s = Math.sqrt(c * c + d * d);
            result.rotation =
                Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
            result.scaleX = delta / s;
            result.scaleY = s;
            result.skewX = 0;
            result.skewY = (a * c + b * d) / delta;
        }
        else ;
        result.rotation = Util._getRotation(result.rotation);
        return result;
    }
}
// CONSTANTS
const OBJECT_ARRAY = '[object Array]', OBJECT_NUMBER = '[object Number]', OBJECT_STRING = '[object String]', OBJECT_BOOLEAN = '[object Boolean]', PI_OVER_DEG180 = Math.PI / 180, DEG180_OVER_PI = 180 / Math.PI, HASH = '#', EMPTY_STRING = '', ZERO = '0', KONVA_WARNING = 'Konva warning: ', KONVA_ERROR = 'Konva error: ', RGB_PAREN = 'rgb(', COLORS = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 132, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 255, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 203],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [119, 128, 144],
    slategrey: [119, 128, 144],
    snow: [255, 255, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    transparent: [255, 255, 255, 0],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 5],
}, RGB_REGEX = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;
let animQueue = [];
const req = (typeof requestAnimationFrame !== 'undefined' && requestAnimationFrame) ||
    function (f) {
        setTimeout(f, 60);
    };
/**
 * @namespace Util
 * @memberof Konva
 */
const Util = {
    /*
     * cherry-picked utilities from underscore.js
     */
    _isElement(obj) {
        return !!(obj && obj.nodeType == 1);
    },
    _isFunction(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    },
    _isPlainObject(obj) {
        return !!obj && obj.constructor === Object;
    },
    _isArray(obj) {
        return Object.prototype.toString.call(obj) === OBJECT_ARRAY;
    },
    _isNumber(obj) {
        return (Object.prototype.toString.call(obj) === OBJECT_NUMBER &&
            !isNaN(obj) &&
            isFinite(obj));
    },
    _isString(obj) {
        return Object.prototype.toString.call(obj) === OBJECT_STRING;
    },
    _isBoolean(obj) {
        return Object.prototype.toString.call(obj) === OBJECT_BOOLEAN;
    },
    // arrays are objects too
    isObject(val) {
        return val instanceof Object;
    },
    isValidSelector(selector) {
        if (typeof selector !== 'string') {
            return false;
        }
        const firstChar = selector[0];
        return (firstChar === '#' ||
            firstChar === '.' ||
            firstChar === firstChar.toUpperCase());
    },
    _sign(number) {
        if (number === 0) {
            // that is not what sign usually returns
            // but that is what we need
            return 1;
        }
        if (number > 0) {
            return 1;
        }
        else {
            return -1;
        }
    },
    requestAnimFrame(callback) {
        animQueue.push(callback);
        if (animQueue.length === 1) {
            req(function () {
                const queue = animQueue;
                animQueue = [];
                queue.forEach(function (cb) {
                    cb();
                });
            });
        }
    },
    createImageElement() {
        return document.createElement('img');
    },
    _isInDocument(el) {
        while ((el = el.parentNode)) {
            if (el == document) {
                return true;
            }
        }
        return false;
    },
    /*
     * arg can be an image object or image data
     */
    _urlToImage(url, callback) {
        // if arg is a string, then it's a data url
        const imageObj = Util.createImageElement();
        imageObj.onload = function () {
            callback(imageObj);
        };
        imageObj.src = url;
    },
    _rgbToHex(r, g, b) {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    _hexToRgb(hex) {
        hex = hex.replace(HASH, EMPTY_STRING);
        const bigint = parseInt(hex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    },
    /**
     * return random hex color
     * @method
     * @memberof Konva.Util
     * @example
     * shape.fill(Konva.Util.getRandomColor());
     */
    getRandomColor() {
        let randColor = ((Math.random() * 0xffffff) << 0).toString(16);
        while (randColor.length < 6) {
            randColor = ZERO + randColor;
        }
        return HASH + randColor;
    },
    /**
     * get RGB components of a color
     * @method
     * @memberof Konva.Util
     * @param {String} color
     * @example
     * // each of the following examples return {r:0, g:0, b:255}
     * var rgb = Konva.Util.getRGB('blue');
     * var rgb = Konva.Util.getRGB('#0000ff');
     * var rgb = Konva.Util.getRGB('rgb(0,0,255)');
     */
    getRGB(color) {
        let rgb;
        // color string
        if (color in COLORS) {
            rgb = COLORS[color];
            return {
                r: rgb[0],
                g: rgb[1],
                b: rgb[2],
            };
        }
        else if (color[0] === HASH) {
            // hex
            return this._hexToRgb(color.substring(1));
        }
        else if (color.substr(0, 4) === RGB_PAREN) {
            // rgb string
            rgb = RGB_REGEX.exec(color.replace(/ /g, ''));
            return {
                r: parseInt(rgb[1], 10),
                g: parseInt(rgb[2], 10),
                b: parseInt(rgb[3], 10),
            };
        }
        else {
            // default
            return {
                r: 0,
                g: 0,
                b: 0,
            };
        }
    },
    // convert any color string to RGBA object
    // from https://github.com/component/color-parser
    colorToRGBA(str) {
        str = str || 'black';
        return (Util._namedColorToRBA(str) ||
            Util._hex3ColorToRGBA(str) ||
            Util._hex4ColorToRGBA(str) ||
            Util._hex6ColorToRGBA(str) ||
            Util._hex8ColorToRGBA(str) ||
            Util._rgbColorToRGBA(str) ||
            Util._rgbaColorToRGBA(str) ||
            Util._hslColorToRGBA(str));
    },
    // Parse named css color. Like "green"
    _namedColorToRBA(str) {
        const c = COLORS[str.toLowerCase()];
        if (!c) {
            return null;
        }
        return {
            r: c[0],
            g: c[1],
            b: c[2],
            a: 1,
        };
    },
    // Parse rgb(n, n, n)
    _rgbColorToRGBA(str) {
        if (str.indexOf('rgb(') === 0) {
            str = str.match(/rgb\(([^)]+)\)/)[1];
            const parts = str.split(/ *, */).map(Number);
            return {
                r: parts[0],
                g: parts[1],
                b: parts[2],
                a: 1,
            };
        }
    },
    // Parse rgba(n, n, n, n)
    _rgbaColorToRGBA(str) {
        if (str.indexOf('rgba(') === 0) {
            str = str.match(/rgba\(([^)]+)\)/)[1];
            const parts = str.split(/ *, */).map((n, index) => {
                if (n.slice(-1) === '%') {
                    return index === 3 ? parseInt(n) / 100 : (parseInt(n) / 100) * 255;
                }
                return Number(n);
            });
            return {
                r: parts[0],
                g: parts[1],
                b: parts[2],
                a: parts[3],
            };
        }
    },
    // Parse #nnnnnnnn
    _hex8ColorToRGBA(str) {
        if (str[0] === '#' && str.length === 9) {
            return {
                r: parseInt(str.slice(1, 3), 16),
                g: parseInt(str.slice(3, 5), 16),
                b: parseInt(str.slice(5, 7), 16),
                a: parseInt(str.slice(7, 9), 16) / 0xff,
            };
        }
    },
    // Parse #nnnnnn
    _hex6ColorToRGBA(str) {
        if (str[0] === '#' && str.length === 7) {
            return {
                r: parseInt(str.slice(1, 3), 16),
                g: parseInt(str.slice(3, 5), 16),
                b: parseInt(str.slice(5, 7), 16),
                a: 1,
            };
        }
    },
    // Parse #nnnn
    _hex4ColorToRGBA(str) {
        if (str[0] === '#' && str.length === 5) {
            return {
                r: parseInt(str[1] + str[1], 16),
                g: parseInt(str[2] + str[2], 16),
                b: parseInt(str[3] + str[3], 16),
                a: parseInt(str[4] + str[4], 16) / 0xff,
            };
        }
    },
    // Parse #nnn
    _hex3ColorToRGBA(str) {
        if (str[0] === '#' && str.length === 4) {
            return {
                r: parseInt(str[1] + str[1], 16),
                g: parseInt(str[2] + str[2], 16),
                b: parseInt(str[3] + str[3], 16),
                a: 1,
            };
        }
    },
    // Code adapted from https://github.com/Qix-/color-convert/blob/master/conversions.js#L244
    _hslColorToRGBA(str) {
        // Check hsl() format
        if (/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.test(str)) {
            // Extract h, s, l
            const [_, ...hsl] = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(str);
            const h = Number(hsl[0]) / 360;
            const s = Number(hsl[1]) / 100;
            const l = Number(hsl[2]) / 100;
            let t2;
            let t3;
            let val;
            if (s === 0) {
                val = l * 255;
                return {
                    r: Math.round(val),
                    g: Math.round(val),
                    b: Math.round(val),
                    a: 1,
                };
            }
            if (l < 0.5) {
                t2 = l * (1 + s);
            }
            else {
                t2 = l + s - l * s;
            }
            const t1 = 2 * l - t2;
            const rgb = [0, 0, 0];
            for (let i = 0; i < 3; i++) {
                t3 = h + (1 / 3) * -(i - 1);
                if (t3 < 0) {
                    t3++;
                }
                if (t3 > 1) {
                    t3--;
                }
                if (6 * t3 < 1) {
                    val = t1 + (t2 - t1) * 6 * t3;
                }
                else if (2 * t3 < 1) {
                    val = t2;
                }
                else if (3 * t3 < 2) {
                    val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                }
                else {
                    val = t1;
                }
                rgb[i] = val * 255;
            }
            return {
                r: Math.round(rgb[0]),
                g: Math.round(rgb[1]),
                b: Math.round(rgb[2]),
                a: 1,
            };
        }
    },
    /**
     * check intersection of two client rectangles
     * @method
     * @memberof Konva.Util
     * @param {Object} r1 - { x, y, width, height } client rectangle
     * @param {Object} r2 - { x, y, width, height } client rectangle
     * @example
     * const overlapping = Konva.Util.haveIntersection(shape1.getClientRect(), shape2.getClientRect());
     */
    haveIntersection(r1, r2) {
        return !(r2.x > r1.x + r1.width ||
            r2.x + r2.width < r1.x ||
            r2.y > r1.y + r1.height ||
            r2.y + r2.height < r1.y);
    },
    cloneObject(obj) {
        const retObj = {};
        for (const key in obj) {
            if (this._isPlainObject(obj[key])) {
                retObj[key] = this.cloneObject(obj[key]);
            }
            else if (this._isArray(obj[key])) {
                retObj[key] = this.cloneArray(obj[key]);
            }
            else {
                retObj[key] = obj[key];
            }
        }
        return retObj;
    },
    cloneArray(arr) {
        return arr.slice(0);
    },
    degToRad(deg) {
        return deg * PI_OVER_DEG180;
    },
    radToDeg(rad) {
        return rad * DEG180_OVER_PI;
    },
    _degToRad(deg) {
        Util.warn('Util._degToRad is removed. Please use public Util.degToRad instead.');
        return Util.degToRad(deg);
    },
    _radToDeg(rad) {
        Util.warn('Util._radToDeg is removed. Please use public Util.radToDeg instead.');
        return Util.radToDeg(rad);
    },
    _getRotation(radians) {
        return Konva$2.angleDeg ? Util.radToDeg(radians) : radians;
    },
    _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    throw(str) {
        throw new Error(KONVA_ERROR + str);
    },
    error(str) {
        console.error(KONVA_ERROR + str);
    },
    warn(str) {
        if (!Konva$2.showWarnings) {
            return;
        }
        console.warn(KONVA_WARNING + str);
    },
    each(obj, func) {
        for (const key in obj) {
            func(key, obj[key]);
        }
    },
    _inRange(val, left, right) {
        return left <= val && val < right;
    },
    _getProjectionToSegment(x1, y1, x2, y2, x3, y3) {
        let x, y, dist;
        const pd2 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
        if (pd2 == 0) {
            x = x1;
            y = y1;
            dist = (x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2);
        }
        else {
            const u = ((x3 - x1) * (x2 - x1) + (y3 - y1) * (y2 - y1)) / pd2;
            if (u < 0) {
                x = x1;
                y = y1;
                dist = (x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3);
            }
            else if (u > 1.0) {
                x = x2;
                y = y2;
                dist = (x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3);
            }
            else {
                x = x1 + u * (x2 - x1);
                y = y1 + u * (y2 - y1);
                dist = (x - x3) * (x - x3) + (y - y3) * (y - y3);
            }
        }
        return [x, y, dist];
    },
    // line as array of points.
    // line might be closed
    _getProjectionToLine(pt, line, isClosed) {
        const pc = Util.cloneObject(pt);
        let dist = Number.MAX_VALUE;
        line.forEach(function (p1, i) {
            if (!isClosed && i === line.length - 1) {
                return;
            }
            const p2 = line[(i + 1) % line.length];
            const proj = Util._getProjectionToSegment(p1.x, p1.y, p2.x, p2.y, pt.x, pt.y);
            const px = proj[0], py = proj[1], pdist = proj[2];
            if (pdist < dist) {
                pc.x = px;
                pc.y = py;
                dist = pdist;
            }
        });
        return pc;
    },
    _prepareArrayForTween(startArray, endArray, isClosed) {
        const start = [], end = [];
        if (startArray.length > endArray.length) {
            const temp = endArray;
            endArray = startArray;
            startArray = temp;
        }
        for (let n = 0; n < startArray.length; n += 2) {
            start.push({
                x: startArray[n],
                y: startArray[n + 1],
            });
        }
        for (let n = 0; n < endArray.length; n += 2) {
            end.push({
                x: endArray[n],
                y: endArray[n + 1],
            });
        }
        const newStart = [];
        end.forEach(function (point) {
            const pr = Util._getProjectionToLine(point, start, isClosed);
            newStart.push(pr.x);
            newStart.push(pr.y);
        });
        return newStart;
    },
    _prepareToStringify(obj) {
        let desc;
        obj.visitedByCircularReferenceRemoval = true;
        for (const key in obj) {
            if (!(obj.hasOwnProperty(key) && obj[key] && typeof obj[key] == 'object')) {
                continue;
            }
            desc = Object.getOwnPropertyDescriptor(obj, key);
            if (obj[key].visitedByCircularReferenceRemoval ||
                Util._isElement(obj[key])) {
                if (desc.configurable) {
                    delete obj[key];
                }
                else {
                    return null;
                }
            }
            else if (Util._prepareToStringify(obj[key]) === null) {
                if (desc.configurable) {
                    delete obj[key];
                }
                else {
                    return null;
                }
            }
        }
        delete obj.visitedByCircularReferenceRemoval;
        return obj;
    },
    // very simplified version of Object.assign
    _assign(target, source) {
        for (const key in source) {
            target[key] = source[key];
        }
        return target;
    },
    _getFirstPointerId(evt) {
        if (!evt.touches) {
            // try to use pointer id or fake id
            return evt.pointerId || 999;
        }
        else {
            return evt.changedTouches[0].identifier;
        }
    },
    releaseCanvas(...canvases) {
        if (!Konva$2.releaseCanvasOnDestroy)
            return;
        canvases.forEach((c) => {
            c.width = 0;
            c.height = 0;
        });
    },
    drawRoundedRectPath(g, width, height, cornerRadius) {
        let topLeft = 0, topRight = 0, bottomRight = 0, bottomLeft = 0;
        if (typeof cornerRadius === "number") {
            topLeft = topRight = bottomRight = bottomLeft = Math.min(cornerRadius, width / 2, height / 2);
        }
        else {
            topLeft = Math.min(cornerRadius[0] || 0, width / 2, height / 2);
            topRight = Math.min(cornerRadius[1] || 0, width / 2, height / 2);
            bottomRight = Math.min(cornerRadius[2] || 0, width / 2, height / 2);
            bottomLeft = Math.min(cornerRadius[3] || 0, width / 2, height / 2);
        }
        g.moveTo(topLeft, 0);
        g.lineTo(width - topRight, 0);
        g.arc(width - topRight, topRight, topRight, -Math.PI / 2, 0); // top-right
        g.lineTo(width, height - bottomRight);
        g.arc(width - bottomRight, height - bottomRight, bottomRight, 0, Math.PI / 2); // bottom-right
        g.lineTo(bottomLeft, height);
        g.arc(bottomLeft, height - bottomLeft, bottomLeft, Math.PI / 2, Math.PI); // bottom-left
        g.lineTo(0, topLeft);
        g.arc(topLeft, topLeft, topLeft, Math.PI, (3 * Math.PI) / 2); // top-left
        g.closePath();
    },
    drawRoundedPolygonPath(g, points, sides, radius, cornerRadius) {
        radius = Math.abs(radius);
        for (let i = 0; i < sides; i++) {
            const prev = points[(i - 1 + sides) % sides];
            const curr = points[i];
            const next = points[(i + 1) % sides];
            const vec1 = { x: curr.x - prev.x, y: curr.y - prev.y };
            const vec2 = { x: next.x - curr.x, y: next.y - curr.y };
            const len1 = Math.hypot(vec1.x, vec1.y);
            const len2 = Math.hypot(vec2.x, vec2.y);
            let currCornerRadius = typeof cornerRadius === "number"
                ? cornerRadius
                : i < cornerRadius.length
                    ? cornerRadius[i]
                    : 0;
            const maxCornerRadius = radius * Math.cos(Math.PI / sides);
            currCornerRadius =
                maxCornerRadius * Math.min(1, (currCornerRadius / radius) * 2);
            const normalVec1 = { x: vec1.x / len1, y: vec1.y / len1 };
            const normalVec2 = { x: vec2.x / len2, y: vec2.y / len2 };
            const p1 = {
                x: curr.x - normalVec1.x * currCornerRadius,
                y: curr.y - normalVec1.y * currCornerRadius,
            };
            const p2 = {
                x: curr.x + normalVec2.x * currCornerRadius,
                y: curr.y + normalVec2.y * currCornerRadius,
            };
            if (i === 0) {
                g.moveTo(p1.x, p1.y);
            }
            else {
                g.lineTo(p1.x, p1.y);
            }
            // Arc approximation of arcTo
            g.arc(curr.x, curr.y, currCornerRadius, Math.atan2(p1.y - curr.y, p1.x - curr.x), Math.atan2(p2.y - curr.y, p2.x - curr.x), false);
        }
        g.closePath();
    }
};

function _formatValue(val) {
    if (Util._isString(val)) {
        return '"' + val + '"';
    }
    if (Object.prototype.toString.call(val) === '[object Number]') {
        return val;
    }
    if (Util._isBoolean(val)) {
        return val;
    }
    return Object.prototype.toString.call(val);
}
function RGBComponent(val) {
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    return Math.round(val);
}
function getNumberValidator() {
    if (Konva$2.isUnminified) {
        return function (val, attr) {
            if (!Util._isNumber(val)) {
                Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a number.');
            }
            return val;
        };
    }
}
function getNumberOrArrayOfNumbersValidator(noOfElements) {
    if (Konva$2.isUnminified) {
        return function (val, attr) {
            let isNumber = Util._isNumber(val);
            let isValidArray = Util._isArray(val) && val.length == noOfElements;
            if (!isNumber && !isValidArray) {
                Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a number or Array<number>(' +
                    noOfElements +
                    ')');
            }
            return val;
        };
    }
}
function getNumberOrAutoValidator() {
    if (Konva$2.isUnminified) {
        return function (val, attr) {
            const isNumber = Util._isNumber(val);
            const isAuto = val === 'auto';
            if (!(isNumber || isAuto)) {
                Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a number or "auto".');
            }
            return val;
        };
    }
}
function getStringValidator() {
    if (Konva$2.isUnminified) {
        return function (val, attr) {
            if (!Util._isString(val)) {
                Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a string.');
            }
            return val;
        };
    }
}
function getStringOrGradientValidator() {
    if (Konva$2.isUnminified) {
        return function (val, attr) {
            const isString = Util._isString(val);
            const isGradient = Object.prototype.toString.call(val) === '[object CanvasGradient]' ||
                (val && val['addColorStop']);
            if (!(isString || isGradient)) {
                Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a string or a native gradient.');
            }
            return val;
        };
    }
}
function getNumberArrayValidator() {
    if (Konva$2.isUnminified) {
        return function (val, attr) {
            // Retrieve TypedArray constructor as found in MDN (if TypedArray is available)
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#description
            const TypedArray = Int8Array ? Object.getPrototypeOf(Int8Array) : null;
            if (TypedArray && val instanceof TypedArray) {
                return val;
            }
            if (!Util._isArray(val)) {
                Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a array of numbers.');
            }
            else {
                val.forEach(function (item) {
                    if (!Util._isNumber(item)) {
                        Util.warn('"' +
                            attr +
                            '" attribute has non numeric element ' +
                            item +
                            '. Make sure that all elements are numbers.');
                    }
                });
            }
            return val;
        };
    }
}
function getBooleanValidator() {
    if (Konva$2.isUnminified) {
        return function (val, attr) {
            const isBool = val === true || val === false;
            if (!isBool) {
                Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be a boolean.');
            }
            return val;
        };
    }
}
function getComponentValidator(components) {
    if (Konva$2.isUnminified) {
        return function (val, attr) {
            // ignore validation on undefined value, because it will reset to defalt
            if (val === undefined || val === null) {
                return val;
            }
            if (!Util.isObject(val)) {
                Util.warn(_formatValue(val) +
                    ' is a not valid value for "' +
                    attr +
                    '" attribute. The value should be an object with properties ' +
                    components);
            }
            return val;
        };
    }
}

const GET = 'get';
const SET$1 = 'set';
const Factory = {
    addGetterSetter(constructor, attr, def, validator, after) {
        Factory.addGetter(constructor, attr, def);
        Factory.addSetter(constructor, attr, validator, after);
        Factory.addOverloadedGetterSetter(constructor, attr);
    },
    addGetter(constructor, attr, def) {
        const method = GET + Util._capitalize(attr);
        constructor.prototype[method] =
            constructor.prototype[method] ||
                function () {
                    const val = this.attrs[attr];
                    return val === undefined ? def : val;
                };
    },
    addSetter(constructor, attr, validator, after) {
        const method = SET$1 + Util._capitalize(attr);
        if (!constructor.prototype[method]) {
            Factory.overWriteSetter(constructor, attr, validator, after);
        }
    },
    overWriteSetter(constructor, attr, validator, after) {
        const method = SET$1 + Util._capitalize(attr);
        constructor.prototype[method] = function (val) {
            if (validator && val !== undefined && val !== null) {
                val = validator.call(this, val, attr);
            }
            this._setAttr(attr, val);
            if (after) {
                after.call(this);
            }
            return this;
        };
    },
    addComponentsGetterSetter(constructor, attr, components, validator, after) {
        const len = components.length, capitalize = Util._capitalize, getter = GET + capitalize(attr), setter = SET$1 + capitalize(attr);
        // getter
        constructor.prototype[getter] = function () {
            const ret = {};
            for (let n = 0; n < len; n++) {
                const component = components[n];
                ret[component] = this.getAttr(attr + capitalize(component));
            }
            return ret;
        };
        const basicValidator = getComponentValidator(components);
        // setter
        constructor.prototype[setter] = function (val) {
            const oldVal = this.attrs[attr];
            if (validator) {
                val = validator.call(this, val, attr);
            }
            if (basicValidator) {
                basicValidator.call(this, val, attr);
            }
            for (const key in val) {
                if (!val.hasOwnProperty(key)) {
                    continue;
                }
                this._setAttr(attr + capitalize(key), val[key]);
            }
            if (!val) {
                components.forEach((component) => {
                    this._setAttr(attr + capitalize(component), undefined);
                });
            }
            this._fireChangeEvent(attr, oldVal, val);
            if (after) {
                after.call(this);
            }
            return this;
        };
        Factory.addOverloadedGetterSetter(constructor, attr);
    },
    addOverloadedGetterSetter(constructor, attr) {
        const capitalizedAttr = Util._capitalize(attr), setter = SET$1 + capitalizedAttr, getter = GET + capitalizedAttr;
        constructor.prototype[attr] = function () {
            // setting
            if (arguments.length) {
                this[setter](arguments[0]);
                return this;
            }
            // getting
            return this[getter]();
        };
    },
    addDeprecatedGetterSetter(constructor, attr, def, validator) {
        Util.error('Adding deprecated ' + attr);
        const method = GET + Util._capitalize(attr);
        const message = attr +
            ' property is deprecated and will be removed soon. Look at Konva change log for more information.';
        constructor.prototype[method] = function () {
            Util.error(message);
            const val = this.attrs[attr];
            return val === undefined ? def : val;
        };
        Factory.addSetter(constructor, attr, validator, function () {
            Util.error(message);
        });
        Factory.addOverloadedGetterSetter(constructor, attr);
    },
    backCompat(constructor, methods) {
        Util.each(methods, function (oldMethodName, newMethodName) {
            const method = constructor.prototype[newMethodName];
            const oldGetter = GET + Util._capitalize(oldMethodName);
            const oldSetter = SET$1 + Util._capitalize(oldMethodName);
            function deprecated() {
                method.apply(this, arguments);
                Util.error('"' +
                    oldMethodName +
                    '" method is deprecated and will be removed soon. Use ""' +
                    newMethodName +
                    '" instead.');
            }
            constructor.prototype[oldMethodName] = deprecated;
            constructor.prototype[oldGetter] = deprecated;
            constructor.prototype[oldSetter] = deprecated;
        });
    },
    afterSetFilter() {
        this._filterUpToDate = false;
    },
};

// CONSTANTS
const ALL_LISTENERS = 'allEventListeners', ABSOLUTE_TRANSFORM = 'absoluteTransform', CANVAS = 'canvas', CHILDREN = 'children', KONVA = 'konva', SET = 'set', SPACE$1 = ' ', TRANSFORM = 'transform';
let idCounter$1 = 1;
/**
 * Node constructor. Nodes are entities that can be transformed, layered,
 * and have bound events. The stage, layers, groups, and shapes all extend Node.
 * @constructor
 * @memberof Konva
 * @param {Object} config
 * @@nodeParams
 */
class Node {
    constructor(config) {
        this._id = idCounter$1++;
        this.eventListeners = {};
        this.attrs = {};
        this.index = 0;
        this._allEventListeners = null;
        this.parent = null;
        this._cache = new Map();
        this._attachedDepsListeners = new Map();
        this._lastPos = null;
        this._batchingTransformChange = false;
        this._needClearTransformCache = false;
        this._filterUpToDate = false;
        this._isUnderCache = false;
        this._dragEventId = null;
        this._shouldFireChangeEvents = false;
        // on initial set attrs wi don't need to fire change events
        // because nobody is listening to them yet
        this.setAttrs(config);
        this._shouldFireChangeEvents = true;
        // all change event listeners are attached to the prototype
    }
    hasChildren() {
        return false;
    }
    /**
     * determine if node is currently cached
     * @method
     * @name Konva.Node#isCached
     * @returns {Boolean}
     */
    isCached() {
        return this._cache.has(CANVAS);
    }
    /**
     * Return client rectangle {x, y, width, height} of node. This rectangle also include all styling (strokes, shadows, etc).
     * The purpose of the method is similar to getBoundingClientRect API of the DOM.
     * @method
     * @name Konva.Node#getClientRect
     * @param {Object} config
     * @param {Boolean} [config.skipTransform] should we apply transform to node for calculating rect?
     * @param {Boolean} [config.skipShadow] should we apply shadow to the node for calculating bound box?
     * @param {Boolean} [config.skipStroke] should we apply stroke to the node for calculating bound box?
     * @param {Object} [config.relativeTo] calculate client rect relative to one of the parents
     * @returns {Object} rect with {x, y, width, height} properties
     * @example
     * var rect = new Konva.Rect({
     *      width : 100,
     *      height : 100,
     *      x : 50,
     *      y : 50,
     *      strokeWidth : 4,
     *      stroke : 'black',
     *      offsetX : 50,
     *      scaleY : 2
     * });
     *
     * // get client rect without think off transformations (position, rotation, scale, offset, etc)
     * rect.getClientRect({ skipTransform: true});
     * // returns {
     * //     x : -2,   // two pixels for stroke / 2
     * //     y : -2,
     * //     width : 104, // increased by 4 for stroke
     * //     height : 104
     * //}
     *
     * // get client rect with transformation applied
     * rect.getClientRect();
     * // returns Object {x: -2, y: 46, width: 104, height: 208}
     */
    getClientRect(config) {
        // abstract method
        // redefine in Container and Shape
        throw new Error('abstract "getClientRect" method call');
    }
    _transformedRect(rect, top) {
        const points = [
            { x: rect.x, y: rect.y },
            { x: rect.x + rect.width, y: rect.y },
            { x: rect.x + rect.width, y: rect.y + rect.height },
            { x: rect.x, y: rect.y + rect.height },
        ];
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const trans = this.getAbsoluteTransform(top);
        points.forEach(function (point) {
            const transformed = trans.point(point);
            if (minX === undefined) {
                minX = maxX = transformed.x;
                minY = maxY = transformed.y;
            }
            minX = Math.min(minX, transformed.x);
            minY = Math.min(minY, transformed.y);
            maxX = Math.max(maxX, transformed.x);
            maxY = Math.max(maxY, transformed.y);
        });
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
    }
    /**
     * bind events to the node. KonvaJS supports mouseover, mousemove,
     *  mouseout, mouseenter, mouseleave, mousedown, mouseup, wheel, contextmenu, click, dblclick, touchstart, touchmove,
     *  touchend, tap, dbltap, dragstart, dragmove, and dragend events.
     *  Pass in a string of events delimited by a space to bind multiple events at once
     *  such as 'mousedown mouseup mousemove'. Include a namespace to bind an
     *  event by name such as 'click.foobar'.
     * @method
     * @name Konva.Node#on
     * @param {String} evtStr e.g. 'click', 'mousedown touchstart', 'mousedown.foo touchstart.foo'
     * @param {Function} handler The handler function. The first argument of that function is event object. Event object has `target` as main target of the event, `currentTarget` as current node listener and `evt` as native browser event.
     * @returns {Konva.Node}
     * @example
     * // add click listener
     * node.on('click', function() {
     *   console.log('you clicked me!');
     * });
     *
     * // get the target node
     * node.on('click', function(evt) {
     *   console.log(evt.target);
     * });
     *
     * // stop event propagation
     * node.on('click', function(evt) {
     *   evt.cancelBubble = true;
     * });
     *
     * // bind multiple listeners
     * node.on('click touchstart', function() {
     *   console.log('you clicked/touched me!');
     * });
     *
     * // namespace listener
     * node.on('click.foo', function() {
     *   console.log('you clicked/touched me!');
     * });
     *
     * // get the event type
     * node.on('click tap', function(evt) {
     *   var eventType = evt.type;
     * });
     *
     * // get native event object
     * node.on('click tap', function(evt) {
     *   var nativeEvent = evt.evt;
     * });
     *
     * // for change events, get the old and new val
     * node.on('xChange', function(evt) {
     *   var oldVal = evt.oldVal;
     *   var newVal = evt.newVal;
     * });
     *
     * // get event targets
     * // with event delegations
     * layer.on('click', 'Group', function(evt) {
     *   var shape = evt.target;
     *   var group = evt.currentTarget;
     * });
     */
    on(evtStr, handler) {
        if (this._cache) {
            this._cache.delete(ALL_LISTENERS);
        }
        if (arguments.length === 3) {
            return this._delegate.apply(this, arguments);
        }
        const events = evtStr.split(SPACE$1);
        /*
         * loop through types and attach event listeners to
         * each one.  eg. 'click mouseover.namespace mouseout'
         * will create three event bindings
         */
        for (let n = 0; n < events.length; n++) {
            const event = events[n];
            const parts = event.split('.');
            const baseEvent = parts[0];
            const name = parts[1] || '';
            // create events array if it doesn't exist
            if (!this.eventListeners[baseEvent]) {
                this.eventListeners[baseEvent] = [];
            }
            this.eventListeners[baseEvent].push({ name, handler });
        }
        return this;
    }
    /**
     * remove event bindings from the node. Pass in a string of
     *  event types delimmited by a space to remove multiple event
     *  bindings at once such as 'mousedown mouseup mousemove'.
     *  include a namespace to remove an event binding by name
     *  such as 'click.foobar'. If you only give a name like '.foobar',
     *  all events in that namespace will be removed.
     * @method
     * @name Konva.Node#off
     * @param {String} evtStr e.g. 'click', 'mousedown touchstart', '.foobar'
     * @returns {Konva.Node}
     * @example
     * // remove listener
     * node.off('click');
     *
     * // remove multiple listeners
     * node.off('click touchstart');
     *
     * // remove listener by name
     * node.off('click.foo');
     */
    off(evtStr, callback) {
        let events = (evtStr || '').split(SPACE$1), len = events.length, n, t, event, parts, baseEvent, name;
        this._cache && this._cache.delete(ALL_LISTENERS);
        if (!evtStr) {
            // remove all events
            for (t in this.eventListeners) {
                this._off(t);
            }
        }
        for (n = 0; n < len; n++) {
            event = events[n];
            parts = event.split('.');
            baseEvent = parts[0];
            name = parts[1];
            if (baseEvent) {
                if (this.eventListeners[baseEvent]) {
                    this._off(baseEvent, name, callback);
                }
            }
            else {
                for (t in this.eventListeners) {
                    this._off(t, name, callback);
                }
            }
        }
        return this;
    }
    addEventListener(type, handler) {
        // we have to pass native event to handler
        this.on(type, function (evt) {
            handler.call(this, evt.evt);
        });
        return this;
    }
    removeEventListener(type) {
        this.off(type);
        return this;
    }
    // like node.on
    _delegate(event, selector, handler) {
        const stopNode = this;
        this.on(event, function (evt) {
            const targets = evt.target.findAncestors(selector, true, stopNode);
            for (let i = 0; i < targets.length; i++) {
                evt = Util.cloneObject(evt);
                evt.currentTarget = targets[i];
                handler.call(targets[i], evt);
            }
        });
    }
    /**
     * remove a node from parent, but don't destroy. You can reuse the node later.
     * @method
     * @name Konva.Node#remove
     * @returns {Konva.Node}
     * @example
     * node.remove();
     */
    remove() {
        this._remove();
        return this;
    }
    _remove() {
        // every cached attr that is calculated via node tree
        // traversal must be cleared when removing a node
        const parent = this.getParent();
        if (parent && parent.children) {
            parent.children.splice(this.index, 1);
            parent._setChildrenIndices();
            this.parent = null;
        }
    }
    /**
     * remove and destroy a node. Kill it and delete forever! You should not reuse node after destroy().
     * If the node is a container (Group, Stage or Layer) it will destroy all children too.
     * @method
     * @name Konva.Node#destroy
     * @example
     * node.destroy();
     */
    destroy() {
        this.remove();
        return this;
    }
    /**
     * get attr
     * @method
     * @name Konva.Node#getAttr
     * @param {String} attr
     * @returns {Integer|String|Object|Array}
     * @example
     * var x = node.getAttr('x');
     */
    getAttr(attr) {
        const method = 'get' + Util._capitalize(attr);
        if (Util._isFunction(this[method])) {
            return this[method]();
        }
        // otherwise get directly
        return this.attrs[attr];
    }
    /**
     * get ancestors
     * @method
     * @name Konva.Node#getAncestors
     * @returns {Array}
     * @example
     * shape.getAncestors().forEach(function(node) {
     *   console.log(node.getId());
     * })
     */
    getAncestors() {
        let parent = this.getParent(), ancestors = [];
        while (parent) {
            ancestors.push(parent);
            parent = parent.getParent();
        }
        return ancestors;
    }
    /**
     * get attrs object literal
     * @method
     * @name Konva.Node#getAttrs
     * @returns {Object}
     */
    getAttrs() {
        return (this.attrs || {});
    }
    /**
     * set multiple attrs at once using an object literal
     * @method
     * @name Konva.Node#setAttrs
     * @param {Object} config object containing key value pairs
     * @returns {Konva.Node}
     * @example
     * node.setAttrs({
     *   x: 5,
     *   fill: 'red'
     * });
     */
    setAttrs(config) {
        this._batchTransformChanges(() => {
            let key, method;
            if (!config) {
                return this;
            }
            for (key in config) {
                if (key === CHILDREN) {
                    continue;
                }
                method = SET + Util._capitalize(key);
                // use setter if available
                if (Util._isFunction(this[method])) {
                    this[method](config[key]);
                }
                else {
                    // otherwise set directly
                    this._setAttr(key, config[key]);
                }
                // forgive me
                if (this._object && this._object[key]) {
                    this._object[key] = config[key];
                }
            }
        });
        return this;
    }
    // sometimes we do several attributes changes
    // like node.position(pos)
    // for performance reasons, lets batch transform reset
    // so it work faster
    _batchTransformChanges(func) {
        func();
    }
    setPosition(pos) {
        this._batchTransformChanges(() => {
            this.x(pos.x);
            this.y(pos.y);
        });
        return this;
    }
    getPosition() {
        return {
            x: this.x(),
            y: this.y(),
        };
    }
    /**
     * get position of first pointer (like mouse or first touch) relative to local coordinates of current node
     * @method
     * @name Konva.Node#getRelativePointerPosition
     * @returns {Konva.Node}
     * @example
     *
     * // let's think we have a rectangle at position x = 10, y = 10
     * // now we clicked at x = 15, y = 15 of the stage
     * // if you want to know position of the click, related to the rectangle you can use
     * rect.getRelativePointerPosition();
     */
    getRelativePointerPosition() {
        const stage = this.getStage();
        if (!stage) {
            return null;
        }
        // get pointer (say mouse or touch) position
        const pos = stage.getPointerPosition();
        if (!pos) {
            return null;
        }
        const transform = this.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();
        // now we can find relative point
        return transform.point(pos);
    }
    /**
     * get absolute position of a node. That function can be used to calculate absolute position, but relative to any ancestor
     * @method
     * @name Konva.Node#getAbsolutePosition
     * @param {Object} Ancestor optional ancestor node
     * @returns {Konva.Node}
     * @example
     *
     * // returns absolute position relative to top-left corner of canvas
     * node.getAbsolutePosition();
     *
     * // calculate absolute position of node, inside stage
     * // so stage transforms are ignored
     * node.getAbsolutePosition(stage)
     */
    getAbsolutePosition(top) {
        let haveCachedParent = false;
        let parent = this.parent;
        while (parent) {
            if (parent.isCached()) {
                haveCachedParent = true;
                break;
            }
            parent = parent.parent;
        }
        if (haveCachedParent && !top) {
            // make fake top element
            // "true" is not a node, but it will just allow skip all caching
            top = true;
        }
        const absoluteMatrix = this.getAbsoluteTransform(top).getMatrix(), absoluteTransform = new Transform(), offset = this.offset();
        // clone the matrix array
        absoluteTransform.m = absoluteMatrix.slice();
        absoluteTransform.translate(offset.x, offset.y);
        return absoluteTransform.getTranslation();
    }
    setAbsolutePosition(pos) {
        const { x, y, ...origTrans } = this._clearTransform();
        // don't clear translation
        this.attrs.x = x;
        this.attrs.y = y;
        const it = this._getAbsoluteTransform().copy();
        it.invert();
        it.translate(pos.x, pos.y);
        pos = {
            x: this.attrs.x + it.getTranslation().x,
            y: this.attrs.y + it.getTranslation().y,
        };
        this._setTransform(origTrans);
        this.setPosition({ x: pos.x, y: pos.y });
        return this;
    }
    _setTransform(trans) {
        let key;
        for (key in trans) {
            this.attrs[key] = trans[key];
        }
        // this._clearCache(TRANSFORM);
        // this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
    }
    _clearTransform() {
        const trans = {
            x: this.x(),
            y: this.y(),
            rotation: this.rotation(),
            scaleX: this.scaleX(),
            scaleY: this.scaleY(),
            offsetX: this.offsetX(),
            offsetY: this.offsetY(),
            skewX: this.skewX(),
            skewY: this.skewY(),
        };
        this.attrs.x = 0;
        this.attrs.y = 0;
        this.attrs.rotation = 0;
        this.attrs.scaleX = 1;
        this.attrs.scaleY = 1;
        this.attrs.offsetX = 0;
        this.attrs.offsetY = 0;
        this.attrs.skewX = 0;
        this.attrs.skewY = 0;
        // return original transform
        return trans;
    }
    /**
     * move node by an amount relative to its current position
     * @method
     * @name Konva.Node#move
     * @param {Object} change
     * @param {Number} change.x
     * @param {Number} change.y
     * @returns {Konva.Node}
     * @example
     * // move node in x direction by 1px and y direction by 2px
     * node.move({
     *   x: 1,
     *   y: 2
     * });
     */
    move(change) {
        let changeX = change.x, changeY = change.y, x = this.x(), y = this.y();
        if (changeX !== undefined) {
            x += changeX;
        }
        if (changeY !== undefined) {
            y += changeY;
        }
        this.setPosition({ x: x, y: y });
        return this;
    }
    _eachAncestorReverse(func, top) {
        let family = [], parent = this.getParent(), len, n;
        // if top node is defined, and this node is top node,
        // there's no need to build a family tree.  just execute
        // func with this because it will be the only node
        if (top && top._id === this._id) {
            // func(this);
            return;
        }
        family.unshift(this);
        while (parent && (!top || parent._id !== top._id)) {
            family.unshift(parent);
            parent = parent.parent;
        }
        len = family.length;
        for (n = 0; n < len; n++) {
            func(family[n]);
        }
    }
    /**
     * rotate node by an amount in degrees relative to its current rotation
     * @method
     * @name Konva.Node#rotate
     * @param {Number} theta
     * @returns {Konva.Node}
     */
    rotate(theta) {
        this.rotation(this.rotation() + theta);
        return this;
    }
    /**
     * move node to the top of its siblings
     * @method
     * @name Konva.Node#moveToTop
     * @returns {Boolean}
     */
    moveToTop() {
        if (!this.parent) {
            Util.warn('Node has no parent. moveToTop function is ignored.');
            return false;
        }
        const index = this.index, len = this.parent.getChildren().length;
        if (index < len - 1) {
            this.parent.children.splice(index, 1);
            this.parent.children.push(this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    }
    /**
     * move node up
     * @method
     * @name Konva.Node#moveUp
     * @returns {Boolean} flag is moved or not
     */
    moveUp() {
        if (!this.parent) {
            Util.warn('Node has no parent. moveUp function is ignored.');
            return false;
        }
        const index = this.index, len = this.parent.getChildren().length;
        if (index < len - 1) {
            this.parent.children.splice(index, 1);
            this.parent.children.splice(index + 1, 0, this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    }
    /**
     * move node down
     * @method
     * @name Konva.Node#moveDown
     * @returns {Boolean}
     */
    moveDown() {
        if (!this.parent) {
            Util.warn('Node has no parent. moveDown function is ignored.');
            return false;
        }
        const index = this.index;
        if (index > 0) {
            this.parent.children.splice(index, 1);
            this.parent.children.splice(index - 1, 0, this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    }
    /**
     * move node to the bottom of its siblings
     * @method
     * @name Konva.Node#moveToBottom
     * @returns {Boolean}
     */
    moveToBottom() {
        if (!this.parent) {
            Util.warn('Node has no parent. moveToBottom function is ignored.');
            return false;
        }
        const index = this.index;
        if (index > 0) {
            this.parent.children.splice(index, 1);
            this.parent.children.unshift(this);
            this.parent._setChildrenIndices();
            return true;
        }
        return false;
    }
    setZIndex(zIndex) {
        if (!this.parent) {
            Util.warn('Node has no parent. zIndex parameter is ignored.');
            return this;
        }
        if (zIndex < 0 || zIndex >= this.parent.children.length) {
            Util.warn('Unexpected value ' +
                zIndex +
                ' for zIndex property. zIndex is just index of a node in children of its parent. Expected value is from 0 to ' +
                (this.parent.children.length - 1) +
                '.');
        }
        const index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.splice(zIndex, 0, this);
        this.parent._setChildrenIndices();
        return this;
    }
    /**
     * move node to another container
     * @method
     * @name Konva.Node#moveTo
     * @param {Container} newContainer
     * @returns {Konva.Node}
     * @example
     * // move node from current layer into layer2
     * node.moveTo(layer2);
     */
    moveTo(newContainer) {
        // do nothing if new container is already parent
        if (this.getParent() !== newContainer) {
            this._remove();
            newContainer.add(this);
        }
        return this;
    }
    /**
     * convert Node into an object for serialization.  Returns an object.
     * @method
     * @name Konva.Node#toObject
     * @returns {Object}
     */
    toObject() {
        let attrs = this.getAttrs(), key, val, getter, defaultValue, nonPlainObject;
        const obj = {
            attrs: {},
            className: this.getClassName(),
        };
        for (key in attrs) {
            val = attrs[key];
            // if value is object and object is not plain
            // like class instance, we should skip it and to not include
            nonPlainObject =
                Util.isObject(val) && !Util._isPlainObject(val) && !Util._isArray(val);
            if (nonPlainObject) {
                continue;
            }
            getter = typeof this[key] === 'function' && this[key];
            // remove attr value so that we can extract the default value from the getter
            delete attrs[key];
            defaultValue = getter ? getter.call(this) : null;
            // restore attr value
            attrs[key] = val;
            if (defaultValue !== val) {
                obj.attrs[key] = val;
            }
        }
        return Util._prepareToStringify(obj);
    }
    /**
     * convert Node into a JSON string.  Returns a JSON string.
     * @method
     * @name Konva.Node#toJSON
     * @returns {String}
     */
    toJSON() {
        return JSON.stringify(this.toObject());
    }
    /**
     * get parent container
     * @method
     * @name Konva.Node#getParent
     * @returns {Konva.Node}
     */
    getParent() {
        return this.parent;
    }
    /**
     * get all ancestors (parent then parent of the parent, etc) of the node
     * @method
     * @name Konva.Node#findAncestors
     * @param {String} selector selector for search
     * @param {Boolean} [includeSelf] show we think that node is ancestro itself?
     * @param {Konva.Node} [stopNode] optional node where we need to stop searching (one of ancestors)
     * @returns {Array} [ancestors]
     * @example
     * // get one of the parent group
     * var parentGroups = node.findAncestors('Group');
     */
    findAncestors(selector, includeSelf, stopNode) {
        const res = [];
        if (includeSelf && this._isMatch(selector)) {
            res.push(this);
        }
        let ancestor = this.parent;
        while (ancestor) {
            if (ancestor === stopNode) {
                return res;
            }
            if (ancestor._isMatch(selector)) {
                res.push(ancestor);
            }
            ancestor = ancestor.parent;
        }
        return res;
    }
    isAncestorOf(node) {
        return false;
    }
    /**
     * get ancestor (parent or parent of the parent, etc) of the node that match passed selector
     * @method
     * @name Konva.Node#findAncestor
     * @param {String} selector selector for search
     * @param {Boolean} [includeSelf] show we think that node is ancestro itself?
     * @param {Konva.Node} [stopNode] optional node where we need to stop searching (one of ancestors)
     * @returns {Konva.Node} ancestor
     * @example
     * // get one of the parent group
     * var group = node.findAncestors('.mygroup');
     */
    findAncestor(selector, includeSelf, stopNode) {
        return this.findAncestors(selector, includeSelf, stopNode)[0];
    }
    // is current node match passed selector?
    _isMatch(selector) {
        if (!selector) {
            return false;
        }
        if (typeof selector === 'function') {
            return selector(this);
        }
        let selectorArr = selector.replace(/ /g, '').split(','), len = selectorArr.length, n, sel;
        for (n = 0; n < len; n++) {
            sel = selectorArr[n];
            if (!Util.isValidSelector(sel)) {
                Util.warn('Selector "' +
                    sel +
                    '" is invalid. Allowed selectors examples are "#foo", ".bar" or "Group".');
                Util.warn('If you have a custom shape with such className, please change it to start with upper letter like "Triangle".');
                Util.warn('Konva is awesome, right?');
            }
            // id selector
            if (sel.charAt(0) === '#') {
                if (this.id() === sel.slice(1)) {
                    return true;
                }
            }
            else if (sel.charAt(0) === '.') {
                // name selector
                if (this.hasName(sel.slice(1))) {
                    return true;
                }
            }
            else if (this.className === sel || this.nodeType === sel) {
                return true;
            }
        }
        return false;
    }
    /**
     * get layer ancestor
     * @method
     * @name Konva.Node#getLayer
     * @returns {Konva.Layer}
     */
    getLayer() {
        const parent = this.getParent();
        return parent ? parent.getLayer() : null;
    }
    /**
     * get stage ancestor
     * @method
     * @name Konva.Node#getStage
     * @returns {Konva.Stage}
     */
    getStage() {
        return this._getStage();
    }
    _getStage() {
        const parent = this.getParent();
        if (parent) {
            return parent.getStage();
        }
        else {
            return null;
        }
    }
    /**
     * get absolute transform of the node which takes into
     *  account its ancestor transforms
     * @method
     * @name Konva.Node#getAbsoluteTransform
     * @returns {Konva.Transform}
     */
    getAbsoluteTransform(top) {
        // if using an argument, we can't cache the result.
        if (top) {
            return this._getAbsoluteTransform(top);
        }
        else {
            // if no argument, we can cache the result
            return this._getAbsoluteTransform();
        }
    }
    _getAbsoluteTransform(top) {
        let at;
        // we we need position relative to an ancestor, we will iterate for all
        if (top) {
            at = new Transform();
            // start with stage and traverse downwards to self
            this._eachAncestorReverse(function (node) {
                const transformsEnabled = node.transformsEnabled();
                if (transformsEnabled === 'all') {
                    at.multiply(node.getTransform());
                }
                else if (transformsEnabled === 'position') {
                    at.translate(node.x() - node.offsetX(), node.y() - node.offsetY());
                }
            }, top);
            return at;
        }
        else {
            // try to use a cached value
            at = this._cache.get(ABSOLUTE_TRANSFORM) || new Transform();
            if (this.parent) {
                // transform will be cached
                this.parent.getAbsoluteTransform().copyInto(at);
            }
            else {
                at.reset();
            }
            const transformsEnabled = this.transformsEnabled();
            if (transformsEnabled === 'all') {
                at.multiply(this.getTransform());
            }
            else if (transformsEnabled === 'position') {
                // use "attrs" directly, because it is a bit faster
                const x = this.attrs.x || 0;
                const y = this.attrs.y || 0;
                const offsetX = this.attrs.offsetX || 0;
                const offsetY = this.attrs.offsetY || 0;
                at.translate(x - offsetX, y - offsetY);
            }
            at.dirty = false;
            return at;
        }
    }
    /**
     * get absolute scale of the node which takes into
     *  account its ancestor scales
     * @method
     * @name Konva.Node#getAbsoluteScale
     * @returns {Object}
     * @example
     * // get absolute scale x
     * var scaleX = node.getAbsoluteScale().x;
     */
    getAbsoluteScale(top) {
        // do not cache this calculations,
        // because it use cache transform
        // this is special logic for caching with some shapes with shadow
        let parent = this;
        while (parent) {
            if (parent._isUnderCache) {
                top = parent;
            }
            parent = parent.getParent();
        }
        const transform = this.getAbsoluteTransform(top);
        const attrs = transform.decompose();
        return {
            x: attrs.scaleX,
            y: attrs.scaleY,
        };
    }
    /**
     * get absolute rotation of the node which takes into
     *  account its ancestor rotations
     * @method
     * @name Konva.Node#getAbsoluteRotation
     * @returns {Number}
     * @example
     * // get absolute rotation
     * var rotation = node.getAbsoluteRotation();
     */
    getAbsoluteRotation() {
        // var parent: Node = this;
        // var rotation = 0;
        // while (parent) {
        //   rotation += parent.rotation();
        //   parent = parent.getParent();
        // }
        // return rotation;
        return this.getAbsoluteTransform().decompose().rotation;
    }
    /**
     * get transform of the node
     * @method
     * @name Konva.Node#getTransform
     * @returns {Konva.Transform}
     */
    getTransform() {
        return this._getTransform();
    }
    _getTransform() {
        var _a, _b;
        const m = this._cache.get(TRANSFORM) || new Transform();
        m.reset();
        // I was trying to use attributes directly here
        // but it doesn't work for Transformer well
        // because it overwrite x,y getters
        const x = this.x(), y = this.y(), rotation = Konva$2.getAngle(this.rotation()), scaleX = (_a = this.attrs.scaleX) !== null && _a !== void 0 ? _a : 1, scaleY = (_b = this.attrs.scaleY) !== null && _b !== void 0 ? _b : 1, skewX = this.attrs.skewX || 0, skewY = this.attrs.skewY || 0, offsetX = this.attrs.offsetX || 0, offsetY = this.attrs.offsetY || 0;
        if (x !== 0 || y !== 0) {
            m.translate(x, y);
        }
        if (rotation !== 0) {
            m.rotate(rotation);
        }
        if (skewX !== 0 || skewY !== 0) {
            m.skew(skewX, skewY);
        }
        if (scaleX !== 1 || scaleY !== 1) {
            m.scale(scaleX, scaleY);
        }
        if (offsetX !== 0 || offsetY !== 0) {
            m.translate(-1 * offsetX, -1 * offsetY);
        }
        m.dirty = false;
        return m;
    }
    /**
     * clone node.  Returns a new Node instance with identical attributes.  You can also override
     *  the node properties with an object literal, enabling you to use an existing node as a template
     *  for another node
     * @method
     * @name Konva.Node#clone
     * @param {Object} obj override attrs
     * @returns {Konva.Node}
     * @example
     * // simple clone
     * var clone = node.clone();
     *
     * // clone a node and override the x position
     * var clone = rect.clone({
     *   x: 5
     * });
     */
    clone(obj) {
        // instantiate new node
        let attrs = Util.cloneObject(this.attrs), key, allListeners, len, n, listener;
        // apply attr overrides
        for (key in obj) {
            attrs[key] = obj[key];
        }
        const node = new this.constructor(attrs);
        // copy over listeners
        for (key in this.eventListeners) {
            allListeners = this.eventListeners[key];
            len = allListeners.length;
            for (n = 0; n < len; n++) {
                listener = allListeners[n];
                /*
                 * don't include konva namespaced listeners because
                 *  these are generated by the constructors
                 */
                if (listener.name.indexOf(KONVA) < 0) {
                    // if listeners array doesn't exist, then create it
                    if (!node.eventListeners[key]) {
                        node.eventListeners[key] = [];
                    }
                    node.eventListeners[key].push(listener);
                }
            }
        }
        return node;
    }
    setSize(size) {
        this.width(size.width);
        this.height(size.height);
        return this;
    }
    getSize() {
        return {
            width: this.width(),
            height: this.height(),
        };
    }
    /**
     * get class name, which may return Stage, Layer, Group, or shape class names like Rect, Circle, Text, etc.
     * @method
     * @name Konva.Node#getClassName
     * @returns {String}
     */
    getClassName() {
        return this.className || this.nodeType;
    }
    /**
     * get the node type, which may return Stage, Layer, Group, or Shape
     * @method
     * @name Konva.Node#getType
     * @returns {String}
     */
    getType() {
        return this.nodeType;
    }
    getDragDistance() {
        // compare with undefined because we need to track 0 value
        if (this.attrs.dragDistance !== undefined) {
            return this.attrs.dragDistance;
        }
        else if (this.parent) {
            return this.parent.getDragDistance();
        }
        else {
            return Konva$2.dragDistance;
        }
    }
    _off(type, name, callback) {
        let evtListeners = this.eventListeners[type], i, evtName, handler;
        for (i = 0; i < evtListeners.length; i++) {
            evtName = evtListeners[i].name;
            handler = evtListeners[i].handler;
            // the following two conditions must be true in order to remove a handler:
            // 1) the current event name cannot be konva unless the event name is konva
            //    this enables developers to force remove a konva specific listener for whatever reason
            // 2) an event name is not specified, or if one is specified, it matches the current event name
            if ((evtName !== 'konva' || name === 'konva') &&
                (!name || evtName === name) &&
                (!callback || callback === handler)) {
                evtListeners.splice(i, 1);
                if (evtListeners.length === 0) {
                    delete this.eventListeners[type];
                    break;
                }
                i--;
            }
        }
    }
    /**
     * add name to node
     * @method
     * @name Konva.Node#addName
     * @param {String} name
     * @returns {Konva.Node}
     * @example
     * node.name('red');
     * node.addName('selected');
     * node.name(); // return 'red selected'
     */
    addName(name) {
        if (!this.hasName(name)) {
            const oldName = this.name();
            const newName = oldName ? oldName + ' ' + name : name;
            this.name(newName);
        }
        return this;
    }
    /**
     * check is node has name
     * @method
     * @name Konva.Node#hasName
     * @param {String} name
     * @returns {Boolean}
     * @example
     * node.name('red');
     * node.hasName('red');   // return true
     * node.hasName('selected'); // return false
     * node.hasName(''); // return false
     */
    hasName(name) {
        if (!name) {
            return false;
        }
        const fullName = this.name();
        if (!fullName) {
            return false;
        }
        // if name is '' the "names" will be [''], so I added extra check above
        const names = (fullName || '').split(/\s/g);
        return names.indexOf(name) !== -1;
    }
    /**
     * remove name from node
     * @method
     * @name Konva.Node#removeName
     * @param {String} name
     * @returns {Konva.Node}
     * @example
     * node.name('red selected');
     * node.removeName('selected');
     * node.hasName('selected'); // return false
     * node.name(); // return 'red'
     */
    removeName(name) {
        const names = (this.name() || '').split(/\s/g);
        const index = names.indexOf(name);
        if (index !== -1) {
            names.splice(index, 1);
            this.name(names.join(' '));
        }
        return this;
    }
    /**
     * set attr
     * @method
     * @name Konva.Node#setAttr
     * @param {String} attr
     * @param {*} val
     * @returns {Konva.Node}
     * @example
     * node.setAttr('x', 5);
     */
    setAttr(attr, val) {
        const func = this[SET + Util._capitalize(attr)];
        if (Util._isFunction(func)) {
            func.call(this, val);
        }
        else {
            // otherwise set directly
            this._setAttr(attr, val);
        }
        return this;
    }
    _getCache(attr, privateGetter) {
        let cache = this._cache.get(attr);
        // for transform the cache can be NOT empty
        // but we still need to recalculate it if it is dirty
        const isTransform = attr === TRANSFORM || attr === ABSOLUTE_TRANSFORM;
        const invalid = cache === undefined || (isTransform && cache.dirty === true);
        // if not cached, we need to set it using the private getter method.
        if (invalid) {
            cache = privateGetter.call(this);
            this._cache.set(attr, cache);
        }
        return cache;
    }
    _calculate(name, deps, getter) {
        // if we are trying to calculate function for the first time
        // we need to attach listeners for change events
        // just use cache function
        return this._getCache(name, getter);
    }
    isVisible() {
        return this._isVisible();
    }
    _isVisible(relativeTo) {
        const visible = this.visible();
        if (!visible) {
            return false;
        }
        const parent = this.getParent();
        if (parent && parent !== relativeTo && this !== relativeTo) {
            return parent._isVisible(relativeTo);
        }
        else {
            return true;
        }
    }
    _setAttr(key, val) {
        const oldVal = this.attrs[key];
        if (oldVal === val && !Util.isObject(val)) {
            return;
        }
        if (val === undefined || val === null) {
            delete this.attrs[key];
        }
        else {
            this.attrs[key] = val;
        }
    }
    _setComponentAttr(key, component, val) {
        let oldVal;
        if (val !== undefined) {
            oldVal = this.attrs[key];
            if (!oldVal) {
                // set value to default value using getAttr
                this.attrs[key] = this.getAttr(key);
            }
            this.attrs[key][component] = val;
        }
    }
    /**
     * determine if node (at least partially) is currently in user-visible area
     * @method
     * @param {(Number | Object)} margin optional margin in pixels
     * @param {Number} margin.x
     * @param {Number} margin.y
     * @returns {Boolean}
     * @name Konva.Node#isClientRectOnScreen
     * @example
     * // get index
     * // default calculations
     * var isOnScreen = node.isClientRectOnScreen()
     * // increase object size (or screen size) for cases when objects close to the screen still need to be marked as "visible"
     * var isOnScreen = node.isClientRectOnScreen({ x: stage.width(), y: stage.height() })
     */
    isClientRectOnScreen(margin = { x: 0, y: 0 }) {
        const stage = this.getStage();
        if (!stage) {
            return false;
        }
        const screenRect = {
            x: -margin.x,
            y: -margin.y,
            width: stage.width() + 2 * margin.x,
            height: stage.height() + 2 * margin.y,
        };
        return Util.haveIntersection(screenRect, this.getClientRect());
    }
    /**
     * create node with JSON string or an Object.  De-serializtion does not generate custom
     *  shape drawing functions, images, or event handlers (this would make the
     *  serialized object huge).  If your app uses custom shapes, images, and
     *  event handlers (it probably does), then you need to select the appropriate
     *  shapes after loading the stage and set these properties via on(), setSceneFunc(),
     *  and setImage() methods
     * @method
     * @memberof Konva.Node
     * @param {String|Object} json string or object
     * @param {Element} [container] optional container dom element used only if you're
     *  creating a stage node
     */
    static create(data, container) {
        if (Util._isString(data)) {
            data = JSON.parse(data);
        }
        return this._createNode(data, container);
    }
    static _createNode(obj, container) {
        let className = Node.prototype.getClassName.call(obj), children = obj.children, no, len, n;
        // if container was passed in, add it to attrs
        if (container) {
            obj.attrs.container = container;
        }
        if (!Konva$2[className]) {
            Util.warn('Can not find a node with class name "' +
                className +
                '". Fallback to "Shape".');
            className = 'Shape';
        }
        const Class = Konva$2[className];
        no = new Class(obj.attrs);
        if (children) {
            len = children.length;
            for (n = 0; n < len; n++) {
                no.add(Node._createNode(children[n]));
            }
        }
        return no;
    }
}
Node.prototype.nodeType = 'Node';
Node.prototype._attrsAffectingSize = [];
const addGetterSetter = Factory.addGetterSetter;
/**
 * get/set zIndex relative to the node's siblings who share the same parent.
 * Please remember that zIndex is not absolute (like in CSS). It is relative to parent element only.
 * @name Konva.Node#zIndex
 * @method
 * @param {Number} index
 * @returns {Number}
 * @example
 * // get index
 * var index = node.zIndex();
 *
 * // set index
 * node.zIndex(2);
 */
addGetterSetter(Node, 'zIndex');
/**
 * get/set node absolute position
 * @name Konva.Node#absolutePosition
 * @method
 * @param {Object} pos
 * @param {Number} pos.x
 * @param {Number} pos.y
 * @returns {Object}
 * @example
 * // get position
 * var position = node.absolutePosition();
 *
 * // set position
 * node.absolutePosition({
 *   x: 5,
 *   y: 10
 * });
 */
addGetterSetter(Node, 'absolutePosition');
addGetterSetter(Node, 'position');
/**
 * get/set node position relative to parent
 * @name Konva.Node#position
 * @method
 * @param {Object} pos
 * @param {Number} pos.x
 * @param {Number} pos.y
 * @returns {Object}
 * @example
 * // get position
 * var position = node.position();
 *
 * // set position
 * node.position({
 *   x: 5,
 *   y: 10
 * });
 */
addGetterSetter(Node, 'x', 0, getNumberValidator());
/**
 * get/set x position
 * @name Konva.Node#x
 * @method
 * @param {Number} x
 * @returns {Object}
 * @example
 * // get x
 * var x = node.x();
 *
 * // set x
 * node.x(5);
 */
addGetterSetter(Node, 'y', 0, getNumberValidator());
/**
 * get/set y position
 * @name Konva.Node#y
 * @method
 * @param {Number} y
 * @returns {Integer}
 * @example
 * // get y
 * var y = node.y();
 *
 * // set y
 * node.y(5);
 */
addGetterSetter(Node, 'globalCompositeOperation', 'source-over', getStringValidator());
/**
 * get/set globalCompositeOperation of a node. globalCompositeOperation DOESN'T affect hit graph of nodes. So they are still trigger to events as they have default "source-over" globalCompositeOperation.
 * @name Konva.Node#globalCompositeOperation
 * @method
 * @param {String} type
 * @returns {String}
 * @example
 * // get globalCompositeOperation
 * var globalCompositeOperation = shape.globalCompositeOperation();
 *
 * // set globalCompositeOperation
 * shape.globalCompositeOperation('source-in');
 */
addGetterSetter(Node, 'opacity', 1, getNumberValidator());
/**
 * get/set opacity.  Opacity values range from 0 to 1.
 *  A node with an opacity of 0 is fully transparent, and a node
 *  with an opacity of 1 is fully opaque
 * @name Konva.Node#opacity
 * @method
 * @param {Object} opacity
 * @returns {Number}
 * @example
 * // get opacity
 * var opacity = node.opacity();
 *
 * // set opacity
 * node.opacity(0.5);
 */
addGetterSetter(Node, 'name', '', getStringValidator());
/**
 * get/set name.
 * @name Konva.Node#name
 * @method
 * @param {String} name
 * @returns {String}
 * @example
 * // get name
 * var name = node.name();
 *
 * // set name
 * node.name('foo');
 *
 * // also node may have multiple names (as css classes)
 * node.name('foo bar');
 */
addGetterSetter(Node, 'id', '', getStringValidator());
/**
 * get/set id. Id is global for whole page.
 * @name Konva.Node#id
 * @method
 * @param {String} id
 * @returns {String}
 * @example
 * // get id
 * var name = node.id();
 *
 * // set id
 * node.id('foo');
 */
addGetterSetter(Node, 'rotation', 0, getNumberValidator());
/**
 * get/set rotation in degrees
 * @name Konva.Node#rotation
 * @method
 * @param {Number} rotation
 * @returns {Number}
 * @example
 * // get rotation in degrees
 * var rotation = node.rotation();
 *
 * // set rotation in degrees
 * node.rotation(45);
 */
Factory.addComponentsGetterSetter(Node, 'scale', ['x', 'y']);
/**
 * get/set scale
 * @name Konva.Node#scale
 * @param {Object} scale
 * @param {Number} scale.x
 * @param {Number} scale.y
 * @method
 * @returns {Object}
 * @example
 * // get scale
 * var scale = node.scale();
 *
 * // set scale
 * shape.scale({
 *   x: 2,
 *   y: 3
 * });
 */
addGetterSetter(Node, 'scaleX', 1, getNumberValidator());
/**
 * get/set scale x
 * @name Konva.Node#scaleX
 * @param {Number} x
 * @method
 * @returns {Number}
 * @example
 * // get scale x
 * var scaleX = node.scaleX();
 *
 * // set scale x
 * node.scaleX(2);
 */
addGetterSetter(Node, 'scaleY', 1, getNumberValidator());
/**
 * get/set scale y
 * @name Konva.Node#scaleY
 * @param {Number} y
 * @method
 * @returns {Number}
 * @example
 * // get scale y
 * var scaleY = node.scaleY();
 *
 * // set scale y
 * node.scaleY(2);
 */
Factory.addComponentsGetterSetter(Node, 'skew', ['x', 'y']);
/**
 * get/set skew
 * @name Konva.Node#skew
 * @param {Object} skew
 * @param {Number} skew.x
 * @param {Number} skew.y
 * @method
 * @returns {Object}
 * @example
 * // get skew
 * var skew = node.skew();
 *
 * // set skew
 * node.skew({
 *   x: 20,
 *   y: 10
 * });
 */
addGetterSetter(Node, 'skewX', 0, getNumberValidator());
/**
 * get/set skew x
 * @name Konva.Node#skewX
 * @param {Number} x
 * @method
 * @returns {Number}
 * @example
 * // get skew x
 * var skewX = node.skewX();
 *
 * // set skew x
 * node.skewX(3);
 */
addGetterSetter(Node, 'skewY', 0, getNumberValidator());
/**
 * get/set skew y
 * @name Konva.Node#skewY
 * @param {Number} y
 * @method
 * @returns {Number}
 * @example
 * // get skew y
 * var skewY = node.skewY();
 *
 * // set skew y
 * node.skewY(3);
 */
Factory.addComponentsGetterSetter(Node, 'offset', ['x', 'y']);
/**
 * get/set offset.  Offsets the default position and rotation point
 * @method
 * @param {Object} offset
 * @param {Number} offset.x
 * @param {Number} offset.y
 * @returns {Object}
 * @example
 * // get offset
 * var offset = node.offset();
 *
 * // set offset
 * node.offset({
 *   x: 20,
 *   y: 10
 * });
 */
addGetterSetter(Node, 'offsetX', 0, getNumberValidator());
/**
 * get/set offset x
 * @name Konva.Node#offsetX
 * @method
 * @param {Number} x
 * @returns {Number}
 * @example
 * // get offset x
 * var offsetX = node.offsetX();
 *
 * // set offset x
 * node.offsetX(3);
 */
addGetterSetter(Node, 'offsetY', 0, getNumberValidator());
/**
 * get/set offset y
 * @name Konva.Node#offsetY
 * @method
 * @param {Number} y
 * @returns {Number}
 * @example
 * // get offset y
 * var offsetY = node.offsetY();
 *
 * // set offset y
 * node.offsetY(3);
 */
addGetterSetter(Node, 'dragDistance', undefined, getNumberValidator());
/**
 * get/set drag distance
 * @name Konva.Node#dragDistance
 * @method
 * @param {Number} distance
 * @returns {Number}
 * @example
 * // get drag distance
 * var dragDistance = node.dragDistance();
 *
 * // set distance
 * // node starts dragging only if pointer moved more then 3 pixels
 * node.dragDistance(3);
 * // or set globally
 * Konva.dragDistance = 3;
 */
addGetterSetter(Node, 'width', 0, getNumberValidator());
/**
 * get/set width
 * @name Konva.Node#width
 * @method
 * @param {Number} width
 * @returns {Number}
 * @example
 * // get width
 * var width = node.width();
 *
 * // set width
 * node.width(100);
 */
addGetterSetter(Node, 'height', 0, getNumberValidator());
/**
 * get/set height
 * @name Konva.Node#height
 * @method
 * @param {Number} height
 * @returns {Number}
 * @example
 * // get height
 * var height = node.height();
 *
 * // set height
 * node.height(100);
 */
addGetterSetter(Node, 'listening', true, getBooleanValidator());
/**
 * get/set listening attr.  If you need to determine if a node is listening or not
 *   by taking into account its parents, use the isListening() method
 *   nodes with listening set to false will not be detected in hit graph
 *   so they will be ignored in container.getIntersection() method
 * @name Konva.Node#listening
 * @method
 * @param {Boolean} listening Can be true, or false.  The default is true.
 * @returns {Boolean}
 * @example
 * // get listening attr
 * var listening = node.listening();
 *
 * // stop listening for events, remove node and all its children from hit graph
 * node.listening(false);
 *
 * // listen to events according to the parent
 * node.listening(true);
 */
/**
 * get/set preventDefault
 * By default all shapes will prevent default behavior
 * of a browser on a pointer move or tap.
 * that will prevent native scrolling when you are trying to drag&drop a node
 * but sometimes you may need to enable default actions
 * in that case you can set the property to false
 * @name Konva.Node#preventDefault
 * @method
 * @param {Boolean} preventDefault
 * @returns {Boolean}
 * @example
 * // get preventDefault
 * var shouldPrevent = shape.preventDefault();
 *
 * // set preventDefault
 * shape.preventDefault(false);
 */
addGetterSetter(Node, 'preventDefault', true, getBooleanValidator());
addGetterSetter(Node, 'filters', undefined, function (val) {
    this._filterUpToDate = false;
    return val;
});
/**
 * get/set filters.  Filters are applied to cached canvases
 * @name Konva.Node#filters
 * @method
 * @param {Array} filters array of filters
 * @returns {Array}
 * @example
 * // get filters
 * var filters = node.filters();
 *
 * // set a single filter
 * node.cache();
 * node.filters([Konva.Filters.Blur]);
 *
 * // set multiple filters
 * node.cache();
 * node.filters([
 *   Konva.Filters.Blur,
 *   Konva.Filters.Sepia,
 *   Konva.Filters.Invert
 * ]);
 */
addGetterSetter(Node, 'visible', true, getBooleanValidator());
/**
 * get/set visible attr.  Can be true, or false.  The default is true.
 *   If you need to determine if a node is visible or not
 *   by taking into account its parents, use the isVisible() method
 * @name Konva.Node#visible
 * @method
 * @param {Boolean} visible
 * @returns {Boolean}
 * @example
 * // get visible attr
 * var visible = node.visible();
 *
 * // make invisible
 * node.visible(false);
 *
 * // make visible (according to the parent)
 * node.visible(true);
 *
 */
addGetterSetter(Node, 'transformsEnabled', 'all', getStringValidator());
/**
 * get/set transforms that are enabled.  Can be "all", "none", or "position".  The default
 *  is "all"
 * @name Konva.Node#transformsEnabled
 * @method
 * @param {String} enabled
 * @returns {String}
 * @example
 * // enable position transform only to improve draw performance
 * node.transformsEnabled('position');
 *
 * // enable all transforms
 * node.transformsEnabled('all');
 */
/**
 * get/set node size
 * @name Konva.Node#size
 * @method
 * @param {Object} size
 * @param {Number} size.width
 * @param {Number} size.height
 * @returns {Object}
 * @example
 * // get node size
 * var size = node.size();
 * var width = size.width;
 * var height = size.height;
 *
 * // set size
 * node.size({
 *   width: 100,
 *   height: 200
 * });
 */
addGetterSetter(Node, 'size');
/**
 * get/set drag bound function.  This is used to override the default
 *  drag and drop position.
 * @name Konva.Node#dragBoundFunc
 * @method
 * @param {Function} dragBoundFunc
 * @returns {Function}
 * @example
 * // get drag bound function
 * var dragBoundFunc = node.dragBoundFunc();
 *
 * // create vertical drag and drop
 * node.dragBoundFunc(function(pos){
 *   // important pos - is absolute position of the node
 *   // you should return absolute position too
 *   return {
 *     x: this.absolutePosition().x,
 *     y: pos.y
 *   };
 * });
 */
addGetterSetter(Node, 'dragBoundFunc');
/**
 * get/set draggable flag
 * @name Konva.Node#draggable
 * @method
 * @param {Boolean} draggable
 * @returns {Boolean}
 * @example
 * // get draggable flag
 * var draggable = node.draggable();
 *
 * // enable drag and drop
 * node.draggable(true);
 *
 * // disable drag and drop
 * node.draggable(false);
 */
addGetterSetter(Node, 'draggable', false, getBooleanValidator());
Factory.backCompat(Node, {
    rotateDeg: 'rotate',
    setRotationDeg: 'setRotation',
    getRotationDeg: 'getRotation',
});

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
class Container extends Node {
    constructor() {
        super(...arguments);
        this.children = [];
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
    getChildren(filterFunc) {
        const children = this.children || [];
        if (filterFunc) {
            return children.filter(filterFunc);
        }
        return children;
    }
    /**
     * determine if node has children
     * @method
     * @name Konva.Container#hasChildren
     * @returns {Boolean}
     */
    hasChildren() {
        return this.getChildren().length > 0;
    }
    /**
     * remove all children. Children will be still in memory.
     * If you want to completely destroy all children please use "destroyChildren" method instead
     * @method
     * @name Konva.Container#removeChildren
     */
    removeChildren() {
        this.getChildren().forEach((child) => {
            // reset parent to prevent many _setChildrenIndices calls
            child.parent = null;
            child.index = 0;
            child.remove();
        });
        this.children = [];
        return this;
    }
    /**
     * destroy all children nodes.
     * @method
     * @name Konva.Container#destroyChildren
     */
    destroyChildren() {
        this.getChildren().forEach((child) => {
            // reset parent to prevent many _setChildrenIndices calls
            child.parent = null;
            child.index = 0;
            child.destroy();
        });
        this.children = [];
        return this;
    }
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
    add(...children) {
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
        if (child.getParent()) {
            child.moveTo(this);
            return this;
        }
        this._validateAdd(child);
        child.index = this.getChildren().length;
        child.parent = this;
        this.getChildren().push(child);
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
    find(selector) {
        // protecting _generalFind to prevent user from accidentally adding
        // second argument and getting unexpected `findOne` result
        return this._generalFind(selector, false);
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
    findOne(selector) {
        const result = this._generalFind(selector, true);
        return result.length > 0 ? result[0] : undefined;
    }
    _generalFind(selector, findOne) {
        const retArr = [];
        this._descendants((node) => {
            const valid = node._isMatch(selector);
            if (valid) {
                retArr.push(node);
            }
            if (valid && findOne) {
                return true;
            }
            return false;
        });
        return retArr;
    }
    _descendants(fn) {
        let shouldStop = false;
        const children = this.getChildren();
        for (const child of children) {
            shouldStop = fn(child);
            if (shouldStop) {
                return true;
            }
            if (!child.hasChildren()) {
                continue;
            }
            shouldStop = child._descendants(fn);
            if (shouldStop) {
                return true;
            }
        }
        return false;
    }
    // extenders
    toObject() {
        const obj = Node.prototype.toObject.call(this);
        obj.children = [];
        this.getChildren().forEach((child) => {
            obj.children.push(child.toObject());
        });
        return obj;
    }
    /**
     * determine if node is an ancestor
     * of descendant
     * @method
     * @name Konva.Container#isAncestorOf
     * @param {Konva.Node} node
     */
    isAncestorOf(node) {
        let parent = node.getParent();
        while (parent) {
            if (parent._id === this._id) {
                return true;
            }
            parent = parent.getParent();
        }
        return false;
    }
    clone(obj) {
        // call super method
        const node = Node.prototype.clone.call(this, obj);
        this.getChildren().forEach(function (no) {
            node.add(no.clone());
        });
        return node;
    }
    _setChildrenIndices() {
        var _a;
        (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach(function (child, n) {
            child.index = n;
        });
    }
    getClientRect(config = {}) {
        var _a;
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
        (_a = this.children) === null || _a === void 0 ? void 0 : _a.forEach(function (child) {
            // skip invisible children
            if (!child.visible()) {
                return;
            }
            const rect = child.getClientRect({
                relativeTo: that,
                skipShadow: config.skipShadow,
                skipStroke: config.skipStroke,
            });
            // skip invisible children (like empty groups)
            if (rect.width === 0 && rect.height === 0) {
                return;
            }
            if (minX === undefined) {
                // initial value for first child
                minX = rect.x;
                minY = rect.y;
                maxX = rect.x + rect.width;
                maxY = rect.y + rect.height;
            }
            else {
                minX = Math.min(minX, rect.x);
                minY = Math.min(minY, rect.y);
                maxX = Math.max(maxX, rect.x + rect.width);
                maxY = Math.max(maxY, rect.y + rect.height);
            }
        });
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
        }
        else {
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
Factory.addGetterSetter(Container, 'clipWidth', undefined, getNumberValidator());
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
Factory.addGetterSetter(Container, 'clipHeight', undefined, getNumberValidator());
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

// CONSTANTS
const STAGE = 'Stage', STRING = 'string', MOUSELEAVE = 'mouseleave', MOUSEOVER = 'mouseover', MOUSEENTER = 'mouseenter', MOUSEMOVE = 'mousemove', MOUSEDOWN = 'mousedown', MOUSEUP = 'mouseup', POINTERMOVE = 'pointermove', POINTERDOWN = 'pointerdown', POINTERUP = 'pointerup', POINTERCANCEL = 'pointercancel', LOSTPOINTERCAPTURE = 'lostpointercapture', CONTEXTMENU = 'contextmenu', TOUCHSTART = 'touchstart', TOUCHEND = 'touchend', TOUCHMOVE = 'touchmove', TOUCHCANCEL = 'touchcancel', WHEEL = 'wheel', EVENTS = [
    [MOUSEENTER, '_pointerenter'],
    [MOUSEDOWN, '_pointerdown'],
    [MOUSEMOVE, '_pointermove'],
    [MOUSEUP, '_pointerup'],
    [MOUSELEAVE, '_pointerleave'],
    [TOUCHSTART, '_pointerdown'],
    [TOUCHMOVE, '_pointermove'],
    [TOUCHEND, '_pointerup'],
    [TOUCHCANCEL, '_pointercancel'],
    [MOUSEOVER, '_pointerover'],
    [WHEEL, '_wheel'],
    [CONTEXTMENU, '_contextmenu'],
    [POINTERDOWN, '_pointerdown'],
    [POINTERMOVE, '_pointermove'],
    [POINTERUP, '_pointerup'],
    [POINTERCANCEL, '_pointercancel'],
    [LOSTPOINTERCAPTURE, '_lostpointercapture'],
];
function checkNoClip(attrs = {}) {
    if (attrs.clipFunc || attrs.clipWidth || attrs.clipHeight) {
        Util.warn('Stage does not support clipping. Please use clip for Layers or Groups.');
    }
    return attrs;
}
const NO_POINTERS_MESSAGE = `Pointer position is missing and not registered by the stage. Looks like it is outside of the stage container. You can set it manually from event: stage.setPointersPositions(event);`;
const stages = [];
/**
 * Stage constructor.  A stage is used to contain multiple layers
 * @constructor
 * @memberof Konva
 * @augments Konva.Container
 * @param {Object} config
 * @param {String|Element} config.container Container selector or DOM element
 * @@nodeParams
 * @example
 * var stage = new Konva.Stage({
 *   width: 500,
 *   height: 800,
 *   container: 'containerId' // or "#containerId" or ".containerClass"
 * });
 */
class Stage extends Container {
    constructor(config) {
        super(checkNoClip(config));
        this._pointerPositions = [];
        this._changedPointerPositions = [];
        const stage = new PIXI.Application();
        stage.init({
            width: 800, // Canvas width
            height: 600, // Canvas height
            backgroundColor: 0x1099bb, // Background color
            antialias: true, // Enable antialiasing
            resolution: 1, // Resolution / device pixel ratio
            preference: 'webgl', // or 'webgpu' // Renderer preference
        });
        stages.push(this);
        this._checkVisibility();
    }
    _validateAdd(child) {
        const isLayer = child.getType() === 'Layer';
        const isFastLayer = child.getType() === 'FastLayer';
        const valid = isLayer || isFastLayer;
        if (!valid) {
            Util.throw('You may only add layers to the stage.');
        }
    }
    _checkVisibility() {
        if (!this.content) {
            return;
        }
        const style = this.visible() ? '' : 'none';
        this.content.style.display = style;
    }
    /**
     * set container dom element which contains the stage wrapper div element
     * @method
     * @name Konva.Stage#setContainer
     * @param {DomElement} container can pass in a dom element or id string
     */
    setContainer(container) {
        if (typeof container === STRING) {
            let id;
            if (container.charAt(0) === '.') {
                const className = container.slice(1);
                container = document.getElementsByClassName(className)[0];
            }
            else {
                if (container.charAt(0) !== '#') {
                    id = container;
                }
                else {
                    id = container.slice(1);
                }
                container = document.getElementById(id);
            }
            if (!container) {
                throw 'Can not find container in document with id ' + id;
            }
        }
        this._setAttr('container', container);
        if (this.content) {
            if (this.content.parentElement) {
                this.content.parentElement.removeChild(this.content);
            }
            container.appendChild(this.content);
        }
        return this;
    }
    shouldDrawHit() {
        return true;
    }
    clone(obj) {
        if (!obj) {
            obj = {};
        }
        obj.container =
            typeof document !== 'undefined' && document.createElement('div');
        return Container.prototype.clone.call(this, obj);
    }
    destroy() {
        super.destroy();
        const content = this.content;
        if (content && Util._isInDocument(content)) {
            this.container().removeChild(content);
        }
        const index = stages.indexOf(this);
        if (index > -1) {
            stages.splice(index, 1);
        }
        return this;
    }
    /**
     * returns ABSOLUTE pointer position which can be a touch position or mouse position
     * pointer position doesn't include any transforms (such as scale) of the stage
     * it is just a plain position of pointer relative to top-left corner of the canvas
     * @method
     * @name Konva.Stage#getPointerPosition
     * @returns {Vector2d|null}
     */
    getPointerPosition() {
        const pos = this._pointerPositions[0] || this._changedPointerPositions[0];
        if (!pos) {
            Util.warn(NO_POINTERS_MESSAGE);
            return null;
        }
        return {
            x: pos.x,
            y: pos.y,
        };
    }
    _getPointerById(id) {
        return this._pointerPositions.find((p) => p.id === id);
    }
    getPointersPositions() {
        return this._pointerPositions;
    }
    getStage() {
        return this;
    }
    add(layer, ...rest) {
        if (arguments.length > 1) {
            for (let i = 0; i < arguments.length; i++) {
                this.add(arguments[i]);
            }
            return this;
        }
        super.add(layer);
        layer.setSize({ width: this.width(), height: this.height() });
        // chainable
        return this;
    }
    getParent() {
        return null;
    }
    getLayer() {
        return null;
    }
    /**
     * returns an array of layers
     * @method
     * @name Konva.Stage#getLayers
     */
    getLayers() {
        return this.children;
    }
    _bindContentEvents() {
        if (!Konva$2.isBrowser) {
            return;
        }
        EVENTS.forEach(([event, methodName]) => {
            this.content.addEventListener(event, (evt) => {
                this[methodName](evt);
            }, { passive: false });
        });
    }
    _getTargetShape(evenType) {
        let shape = this[evenType + 'targetShape'];
        if (shape && !shape.getStage()) {
            shape = null;
        }
        return shape;
    }
    /**
     * manually register pointers positions (mouse/touch) in the stage.
     * So you can use stage.getPointerPosition(). Usually you don't need to use that method
     * because all internal events are automatically registered. It may be useful if event
     * is triggered outside of the stage, but you still want to use Konva methods to get pointers position.
     * @method
     * @name Konva.Stage#setPointersPositions
     * @param {Object} event Event object
     * @example
     *
     * window.addEventListener('mousemove', (e) => {
     *   stage.setPointersPositions(e);
     * });
     */
    setPointersPositions(evt) {
        const contentPosition = this._getContentPosition();
        let x = null, y = null;
        evt = evt ? evt : window.event;
        // touch events
        if (evt.touches !== undefined) {
            // touchlist has not support for map method
            // so we have to iterate
            this._pointerPositions = [];
            this._changedPointerPositions = [];
            Array.prototype.forEach.call(evt.touches, (touch) => {
                this._pointerPositions.push({
                    id: touch.identifier,
                    x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
                    y: (touch.clientY - contentPosition.top) / contentPosition.scaleY,
                });
            });
            Array.prototype.forEach.call(evt.changedTouches || evt.touches, (touch) => {
                this._changedPointerPositions.push({
                    id: touch.identifier,
                    x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
                    y: (touch.clientY - contentPosition.top) / contentPosition.scaleY,
                });
            });
        }
        else {
            // mouse events
            x = (evt.clientX - contentPosition.left) / contentPosition.scaleX;
            y = (evt.clientY - contentPosition.top) / contentPosition.scaleY;
            this.pointerPos = {
                x: x,
                y: y,
            };
            this._pointerPositions = [{ x, y, id: Util._getFirstPointerId(evt) }];
            this._changedPointerPositions = [
                { x, y, id: Util._getFirstPointerId(evt) },
            ];
        }
    }
    _setPointerPosition(evt) {
        Util.warn('Method _setPointerPosition is deprecated. Use "stage.setPointersPositions(event)" instead.');
        this.setPointersPositions(evt);
    }
    _getContentPosition() {
        if (!this.content || !this.content.getBoundingClientRect) {
            return {
                top: 0,
                left: 0,
                scaleX: 1,
                scaleY: 1,
            };
        }
        const rect = this.content.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
            // sometimes clientWidth can be equals to 0
            // i saw it in react-konva test, looks like it is because of hidden testing element
            scaleX: rect.width / this.content.clientWidth || 1,
            scaleY: rect.height / this.content.clientHeight || 1,
        };
    }
}
Stage.prototype.nodeType = STAGE;
_registerNode(Stage);
/**
 * get/set container DOM element
 * @method
 * @name Konva.Stage#container
 * @returns {DomElement} container
 * @example
 * // get container
 * var container = stage.container();
 * // set container
 * var container = document.createElement('div');
 * body.appendChild(container);
 * stage.container(container);
 */
Factory.addGetterSetter(Stage, 'container');

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
class Layer extends Container {
    constructor(config) {
        super(config);
        this._waitingForDraw = false;
    }
    getLayer() {
        return this;
    }
    remove() {
        var _a;
        (_a = this.container.parent) === null || _a === void 0 ? void 0 : _a.removeChild();
        return this;
    }
    getStage() {
        return this.parent;
    }
    setSize({ width, height }) {
        this.container.setSize(width, height);
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
        Util.warn('Can not change width of layer. Use "stage.width(value)" function instead.');
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
        Util.warn('Can not change height of layer. Use "stage.height(value)" function instead.');
    }
    destroy() {
        this.container.destroy();
        return super.destroy();
    }
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

/**
 * FastLayer constructor. **DEPRECATED!** Please use `Konva.Layer({ listening: false})` instead. Layers are tied to their own canvas element and are used
 * to contain shapes only.  If you don't need node nesting, mouse and touch interactions,
 * or event pub/sub, you should use FastLayer instead of Layer to create your layers.
 * It renders about 2x faster than normal layers.
 *
 * @constructor
 * @memberof Konva
 * @augments Konva.Layer
 @@containerParams
 * @example
 * var layer = new Konva.FastLayer();
 */
class FastLayer extends Layer {
    constructor(attrs) {
        super(attrs);
        this.listening(false);
        Util.warn('Konva.Fast layer is deprecated. Please use "new Konva.Layer({ listening: false })" instead.');
    }
}
FastLayer.prototype.nodeType = 'FastLayer';
_registerNode(FastLayer);

/**
 * Group constructor.  Groups are used to contain shapes or other groups.
 * @constructor
 * @memberof Konva
 * @augments Konva.Container
 * @param {Object} config
 * @@nodeParams
 * @@containerParams
 * @example
 * var group = new Konva.Group();
 */
class Group extends Container {
    _validateAdd(child) {
        const type = child.getType();
        if (type !== 'Group' && type !== 'Shape') {
            Util.throw('You may only add groups and shapes to groups.');
        }
    }
}
Group.prototype.nodeType = 'Group';
_registerNode(Group);

const shapes = {};
/**
 * Shape constructor.  Shapes are primitive objects such as rectangles,
 *  circles, text, lines, etc.
 * @constructor
 * @memberof Konva
 * @augments Konva.Node
 * @param {Object} config
 * @@shapeParams
 * @@nodeParams
 * @example
 * var customShape = new Konva.Shape({
 *   x: 5,
 *   y: 10,
 *   fill: 'red',
 *   // a Konva.Canvas renderer is passed into the sceneFunc function
 *   sceneFunc (context, shape) {
 *     context.beginPath();
 *     context.moveTo(200, 50);
 *     context.lineTo(420, 80);
 *     context.quadraticCurveTo(300, 100, 260, 170);
 *     context.closePath();
 *     // Konva specific method
 *     context.fillStrokeShape(shape);
 *   }
 *});
 */
class Shape extends Node {
    constructor(config) {
        super(config);
        // set colorKey
        let key;
        while (true) {
            key = Util.getRandomColor();
            if (key && !(key in shapes)) {
                break;
            }
        }
        this.colorKey = key;
        shapes[key] = this;
    }
    /**
     * returns whether or not a shadow will be rendered
     * @method
     * @name Konva.Shape#hasShadow
     * @returns {Boolean}
     */
    //   hasShadow() {
    //     return this._getCache(HAS_SHADOW, this._hasShadow);
    //   }
    //   _hasShadow() {
    //     return (
    //       this.shadowEnabled() &&
    //       this.shadowOpacity() !== 0 &&
    //       !!(
    //         this.shadowColor() ||
    //         this.shadowBlur() ||
    //         this.shadowOffsetX() ||
    //         this.shadowOffsetY()
    //       )
    //     );
    //   }
    //   _getFillPattern() {
    //     return this._getCache(patternImage, this.__getFillPattern);
    //   }
    //   __getFillPattern() {
    //     if (this.fillPatternImage()) {
    //       const ctx = getDummyContext();
    //       const pattern = ctx.createPattern(
    //         this.fillPatternImage(),
    //         this.fillPatternRepeat() || 'repeat'
    //       );
    //       if (pattern && pattern.setTransform) {
    //         const tr = new Transform();
    //         tr.translate(this.fillPatternX(), this.fillPatternY());
    //         tr.rotate(Konva.getAngle(this.fillPatternRotation()));
    //         tr.scale(this.fillPatternScaleX(), this.fillPatternScaleY());
    //         tr.translate(
    //           -1 * this.fillPatternOffsetX(),
    //           -1 * this.fillPatternOffsetY()
    //         );
    //         const m = tr.getMatrix();
    //         const matrix =
    //           typeof DOMMatrix === 'undefined'
    //             ? {
    //                 a: m[0], // Horizontal scaling. A value of 1 results in no scaling.
    //                 b: m[1], // Vertical skewing.
    //                 c: m[2], // Horizontal skewing.
    //                 d: m[3],
    //                 e: m[4], // Horizontal translation (moving).
    //                 f: m[5], // Vertical translation (moving).
    //               }
    //             : new DOMMatrix(m);
    //         pattern.setTransform(matrix);
    //       }
    //       return pattern;
    //     }
    //   }
    //   _getLinearGradient() {
    //     return this._getCache(linearGradient, this.__getLinearGradient);
    //   }
    //   __getLinearGradient() {
    //     const colorStops = this.fillLinearGradientColorStops();
    //     if (colorStops) {
    //       const ctx = getDummyContext();
    //       const start = this.fillLinearGradientStartPoint();
    //       const end = this.fillLinearGradientEndPoint();
    //       const grd = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
    //       // build color stops
    //       for (let n = 0; n < colorStops.length; n += 2) {
    //         grd.addColorStop(colorStops[n] as number, colorStops[n + 1] as string);
    //       }
    //       return grd;
    //     }
    //   }
    //   _getRadialGradient() {
    //     return this._getCache(radialGradient, this.__getRadialGradient);
    //   }
    //   __getRadialGradient() {
    //     const colorStops = this.fillRadialGradientColorStops();
    //     if (colorStops) {
    //       const ctx: PIXI
    //       const start = this.fillRadialGradientStartPoint();
    //       const end = this.fillRadialGradientEndPoint();
    //       const grd = ctx.createRadialGradient(
    //         start.x,
    //         start.y,
    //         this.fillRadialGradientStartRadius(),
    //         end.x,
    //         end.y,
    //         this.fillRadialGradientEndRadius()
    //       );
    //       // build color stops
    //       for (let n = 0; n < colorStops.length; n += 2) {
    //         grd.addColorStop(colorStops[n] as number, colorStops[n + 1] as string);
    //       }
    //       return grd;
    //     }
    //   }
    //   getShadowRGBA() {
    //     return this._getCache(SHADOW_RGBA, this._getShadowRGBA);
    //   }
    //   _getShadowRGBA() {
    //     if (!this.hasShadow()) {
    //       return;
    //     }
    //     const rgba = Util.colorToRGBA(this.shadowColor());
    //     if (rgba) {
    //       return (
    //         'rgba(' +
    //         rgba.r +
    //         ',' +
    //         rgba.g +
    //         ',' +
    //         rgba.b +
    //         ',' +
    //         rgba.a * (this.shadowOpacity() || 1) +
    //         ')'
    //       );
    //     }
    //   }
    /**
     * returns whether or not the shape will be filled
     * @method
     * @name Konva.Shape#hasFill
     * @returns {Boolean}
     */
    hasFill() {
        return this._calculate('hasFill', [
            'fillEnabled',
            'fill',
            'fillPatternImage',
            'fillLinearGradientColorStops',
            'fillRadialGradientColorStops',
        ], () => {
            return (this.fillEnabled() &&
                !!(this.fill() ||
                    this.fillPatternImage() ||
                    this.fillLinearGradientColorStops() ||
                    this.fillRadialGradientColorStops()));
        });
    }
    /**
     * returns whether or not the shape will be stroked
     * @method
     * @name Konva.Shape#hasStroke
     * @returns {Boolean}
     */
    hasStroke() {
        return this._calculate('hasStroke', [
            'strokeEnabled',
            'strokeWidth',
            'stroke',
            'strokeLinearGradientColorStops',
        ], () => {
            return (this.strokeEnabled() &&
                this.strokeWidth() &&
                !!(this.stroke() || this.strokeLinearGradientColorStops())
            // this.getStrokeRadialGradientColorStops()
            );
        });
        // return (
        //   this.strokeEnabled() &&
        //   this.strokeWidth() &&
        //   !!(this.stroke() || this.strokeLinearGradientColorStops())
        //   // this.getStrokeRadialGradientColorStops()
        // );
    }
    destroy() {
        Node.prototype.destroy.call(this);
        delete shapes[this.colorKey];
        delete this.colorKey;
        return this;
    }
    /**
     * return self rectangle (x, y, width, height) of shape.
     * This method are not taken into account transformation and styles.
     * @method
     * @name Konva.Shape#getSelfRect
     * @returns {Object} rect with {x, y, width, height} properties
     * @example
     *
     * rect.getSelfRect();  // return {x:0, y:0, width:rect.width(), height:rect.height()}
     * circle.getSelfRect();  // return {x: - circle.width() / 2, y: - circle.height() / 2, width:circle.width(), height:circle.height()}
     *
     */
    getSelfRect() {
        const size = this.size();
        return {
            x: this._centroid ? -size.width / 2 : 0,
            y: this._centroid ? -size.height / 2 : 0,
            width: size.width,
            height: size.height,
        };
    }
    getClientRect(config = {}) {
        // if we have a cached parent, it will use cached transform matrix
        // but we don't want to that
        let hasCachedParent = false;
        let parent = this.getParent();
        while (parent) {
            if (parent.isCached()) {
                hasCachedParent = true;
                break;
            }
            parent = parent.getParent();
        }
        const skipTransform = config.skipTransform;
        // force relative to stage if we have a cached parent
        const relativeTo = config.relativeTo || (hasCachedParent && this.getStage()) || undefined;
        const fillRect = this.getSelfRect();
        const applyStroke = !config.skipStroke && this.hasStroke();
        const strokeWidth = (applyStroke && this.strokeWidth()) || 0;
        const fillAndStrokeWidth = fillRect.width + strokeWidth;
        const fillAndStrokeHeight = fillRect.height + strokeWidth;
        !config.skipShadow && false; // this.hasShadow();
        const shadowOffsetX = 0;
        const shadowOffsetY = 0;
        const preWidth = fillAndStrokeWidth + Math.abs(shadowOffsetX);
        const preHeight = fillAndStrokeHeight + Math.abs(shadowOffsetY);
        const blurRadius = 0;
        const width = preWidth + blurRadius * 2;
        const height = preHeight + blurRadius * 2;
        const rect = {
            width: width,
            height: height,
            x: -(strokeWidth / 2 + blurRadius) +
                Math.min(shadowOffsetX, 0) +
                fillRect.x,
            y: -(strokeWidth / 2 + blurRadius) +
                Math.min(shadowOffsetY, 0) +
                fillRect.y,
        };
        if (!skipTransform) {
            return this._transformedRect(rect, relativeTo);
        }
        return rect;
    }
}
Shape.prototype._centroid = false;
Shape.prototype.nodeType = 'Shape';
_registerNode(Shape);
Shape.prototype.eventListeners = {};
// add getters and setters
Factory.addGetterSetter(Shape, 'stroke', undefined, getStringOrGradientValidator());
/**
 * get/set stroke color
 * @name Konva.Shape#stroke
 * @method
 * @param {String} color
 * @returns {String}
 * @example
 * // get stroke color
 * var stroke = shape.stroke();
 *
 * // set stroke color with color string
 * shape.stroke('green');
 *
 * // set stroke color with hex
 * shape.stroke('#00ff00');
 *
 * // set stroke color with rgb
 * shape.stroke('rgb(0,255,0)');
 *
 * // set stroke color with rgba and make it 50% opaque
 * shape.stroke('rgba(0,255,0,0.5');
 */
Factory.addGetterSetter(Shape, 'strokeWidth', 2, getNumberValidator());
/**
 * get/set stroke width
 * @name Konva.Shape#strokeWidth
 * @method
 * @param {Number} strokeWidth
 * @returns {Number}
 * @example
 * // get stroke width
 * var strokeWidth = shape.strokeWidth();
 *
 * // set stroke width
 * shape.strokeWidth(10);
 */
Factory.addGetterSetter(Shape, 'fillAfterStrokeEnabled', false);
/**
 * get/set fillAfterStrokeEnabled property. By default Konva is drawing filling first, then stroke on top of the fill.
 * In rare situations you may want a different behavior. When you have a stroke first then fill on top of it.
 * Especially useful for Text objects.
 * Default is false.
 * @name Konva.Shape#fillAfterStrokeEnabled
 * @method
 * @param {Boolean} fillAfterStrokeEnabled
 * @returns {Boolean}
 * @example
 * // get stroke width
 * var fillAfterStrokeEnabled = shape.fillAfterStrokeEnabled();
 *
 * // set stroke width
 * shape.fillAfterStrokeEnabled(true);
 */
Factory.addGetterSetter(Shape, 'hitStrokeWidth', 'auto', getNumberOrAutoValidator());
/**
 * get/set stroke width for hit detection. Default value is "auto", it means it will be equals to strokeWidth
 * @name Konva.Shape#hitStrokeWidth
 * @method
 * @param {Number} hitStrokeWidth
 * @returns {Number}
 * @example
 * // get stroke width
 * var hitStrokeWidth = shape.hitStrokeWidth();
 *
 * // set hit stroke width
 * shape.hitStrokeWidth(20);
 * // set hit stroke width always equals to scene stroke width
 * shape.hitStrokeWidth('auto');
 */
Factory.addGetterSetter(Shape, 'strokeHitEnabled', true, getBooleanValidator());
/**
 * **deprecated, use hitStrokeWidth instead!** get/set strokeHitEnabled property. Useful for performance optimization.
 * You may set `shape.strokeHitEnabled(false)`. In this case stroke will be no draw on hit canvas, so hit area
 * of shape will be decreased (by lineWidth / 2). Remember that non closed line with `strokeHitEnabled = false`
 * will be not drawn on hit canvas, that is mean line will no trigger pointer events (like mouseover)
 * Default value is true.
 * @name Konva.Shape#strokeHitEnabled
 * @method
 * @param {Boolean} strokeHitEnabled
 * @returns {Boolean}
 * @example
 * // get strokeHitEnabled
 * var strokeHitEnabled = shape.strokeHitEnabled();
 *
 * // set strokeHitEnabled
 * shape.strokeHitEnabled();
 */
Factory.addGetterSetter(Shape, 'perfectDrawEnabled', true, getBooleanValidator());
/**
 * get/set perfectDrawEnabled. If a shape has fill, stroke and opacity you may set `perfectDrawEnabled` to false to improve performance.
 * See http://konvajs.org/docs/performance/Disable_Perfect_Draw.html for more information.
 * Default value is true
 * @name Konva.Shape#perfectDrawEnabled
 * @method
 * @param {Boolean} perfectDrawEnabled
 * @returns {Boolean}
 * @example
 * // get perfectDrawEnabled
 * var perfectDrawEnabled = shape.perfectDrawEnabled();
 *
 * // set perfectDrawEnabled
 * shape.perfectDrawEnabled();
 */
Factory.addGetterSetter(Shape, 'shadowForStrokeEnabled', true, getBooleanValidator());
/**
 * get/set shadowForStrokeEnabled. Useful for performance optimization.
 * You may set `shape.shadowForStrokeEnabled(false)`. In this case stroke will no effect shadow.
 * Remember if you set `shadowForStrokeEnabled = false` for non closed line - that line will have no shadow!.
 * Default value is true
 * @name Konva.Shape#shadowForStrokeEnabled
 * @method
 * @param {Boolean} shadowForStrokeEnabled
 * @returns {Boolean}
 * @example
 * // get shadowForStrokeEnabled
 * var shadowForStrokeEnabled = shape.shadowForStrokeEnabled();
 *
 * // set shadowForStrokeEnabled
 * shape.shadowForStrokeEnabled();
 */
Factory.addGetterSetter(Shape, 'lineJoin');
/**
 * get/set line join.  Can be miter, round, or bevel.  The
 *  default is miter
 * @name Konva.Shape#lineJoin
 * @method
 * @param {String} lineJoin
 * @returns {String}
 * @example
 * // get line join
 * var lineJoin = shape.lineJoin();
 *
 * // set line join
 * shape.lineJoin('round');
 */
Factory.addGetterSetter(Shape, 'lineCap');
/**
 * get/set hit draw function. That function is used to draw custom hit area of a shape.
 * @name Konva.Shape#hitFunc
 * @method
 * @param {Function} drawFunc drawing function
 * @returns {Function}
 * @example
 * // get hit draw function
 * var hitFunc = shape.hitFunc();
 *
 * // set hit draw function
 * shape.hitFunc(function(context) {
 *   context.beginPath();
 *   context.rect(0, 0, shape.width(), shape.height());
 *   context.closePath();
 *   // important Konva method that fill and stroke shape from its properties
 *   context.fillStrokeShape(shape);
 * });
 */
Factory.addGetterSetter(Shape, 'dash');
/**
 * get/set dash array for stroke.
 * @name Konva.Shape#dash
 * @method
 * @param {Array} dash
 * @returns {Array}
 * @example
 *  // apply dashed stroke that is 10px long and 5 pixels apart
 *  line.dash([10, 5]);
 *  // apply dashed stroke that is made up of alternating dashed
 *  // lines that are 10px long and 20px apart, and dots that have
 *  // a radius of 5px and are 20px apart
 *  line.dash([10, 20, 0.001, 20]);
 */
Factory.addGetterSetter(Shape, 'dashOffset', 0, getNumberValidator());
/**
 * get/set dash offset for stroke.
 * @name Konva.Shape#dash
 * @method
 * @param {Number} dash offset
 * @returns {Number}
 * @example
 *  // apply dashed stroke that is 10px long and 5 pixels apart with an offset of 5px
 *  line.dash([10, 5]);
 *  line.dashOffset(5);
 */
Factory.addGetterSetter(Shape, 'shadowColor', undefined, getStringValidator());
/**
 * get/set shadow color
 * @name Konva.Shape#shadowColor
 * @method
 * @param {String} color
 * @returns {String}
 * @example
 * // get shadow color
 * var shadow = shape.shadowColor();
 *
 * // set shadow color with color string
 * shape.shadowColor('green');
 *
 * // set shadow color with hex
 * shape.shadowColor('#00ff00');
 *
 * // set shadow color with rgb
 * shape.shadowColor('rgb(0,255,0)');
 *
 * // set shadow color with rgba and make it 50% opaque
 * shape.shadowColor('rgba(0,255,0,0.5');
 */
Factory.addGetterSetter(Shape, 'shadowBlur', 0, getNumberValidator());
/**
 * get/set shadow blur
 * @name Konva.Shape#shadowBlur
 * @method
 * @param {Number} blur
 * @returns {Number}
 * @example
 * // get shadow blur
 * var shadowBlur = shape.shadowBlur();
 *
 * // set shadow blur
 * shape.shadowBlur(10);
 */
Factory.addGetterSetter(Shape, 'shadowOpacity', 1, getNumberValidator());
/**
 * get/set shadow opacity.  must be a value between 0 and 1
 * @name Konva.Shape#shadowOpacity
 * @method
 * @param {Number} opacity
 * @returns {Number}
 * @example
 * // get shadow opacity
 * var shadowOpacity = shape.shadowOpacity();
 *
 * // set shadow opacity
 * shape.shadowOpacity(0.5);
 */
Factory.addComponentsGetterSetter(Shape, 'shadowOffset', ['x', 'y']);
/**
 * get/set shadow offset
 * @name Konva.Shape#shadowOffset
 * @method
 * @param {Object} offset
 * @param {Number} offset.x
 * @param {Number} offset.y
 * @returns {Object}
 * @example
 * // get shadow offset
 * var shadowOffset = shape.shadowOffset();
 *
 * // set shadow offset
 * shape.shadowOffset({
 *   x: 20,
 *   y: 10
 * });
 */
Factory.addGetterSetter(Shape, 'shadowOffsetX', 0, getNumberValidator());
/**
 * get/set shadow offset x
 * @name Konva.Shape#shadowOffsetX
 * @method
 * @param {Number} x
 * @returns {Number}
 * @example
 * // get shadow offset x
 * var shadowOffsetX = shape.shadowOffsetX();
 *
 * // set shadow offset x
 * shape.shadowOffsetX(5);
 */
Factory.addGetterSetter(Shape, 'shadowOffsetY', 0, getNumberValidator());
/**
 * get/set shadow offset y
 * @name Konva.Shape#shadowOffsetY
 * @method
 * @param {Number} y
 * @returns {Number}
 * @example
 * // get shadow offset y
 * var shadowOffsetY = shape.shadowOffsetY();
 *
 * // set shadow offset y
 * shape.shadowOffsetY(5);
 */
Factory.addGetterSetter(Shape, 'fillPatternImage');
/**
 * get/set fill pattern image
 * @name Konva.Shape#fillPatternImage
 * @method
 * @param {Image} image object
 * @returns {Image}
 * @example
 * // get fill pattern image
 * var fillPatternImage = shape.fillPatternImage();
 *
 * // set fill pattern image
 * var imageObj = new Image();
 * imageObj.onload = function() {
 *   shape.fillPatternImage(imageObj);
 * };
 * imageObj.src = 'path/to/image/jpg';
 */
Factory.addGetterSetter(Shape, 'fill', undefined, getStringOrGradientValidator());
/**
 * get/set fill color
 * @name Konva.Shape#fill
 * @method
 * @param {String} color
 * @returns {String}
 * @example
 * // get fill color
 * var fill = shape.fill();
 *
 * // set fill color with color string
 * shape.fill('green');
 *
 * // set fill color with hex
 * shape.fill('#00ff00');
 *
 * // set fill color with rgb
 * shape.fill('rgb(0,255,0)');
 *
 * // set fill color with rgba and make it 50% opaque
 * shape.fill('rgba(0,255,0,0.5');
 *
 * // shape without fill
 * shape.fill(null);
 */
Factory.addGetterSetter(Shape, 'fillPatternX', 0, getNumberValidator());
/**
 * get/set fill pattern x
 * @name Konva.Shape#fillPatternX
 * @method
 * @param {Number} x
 * @returns {Number}
 * @example
 * // get fill pattern x
 * var fillPatternX = shape.fillPatternX();
 * // set fill pattern x
 * shape.fillPatternX(20);
 */
Factory.addGetterSetter(Shape, 'fillPatternY', 0, getNumberValidator());
/**
 * get/set fill pattern y
 * @name Konva.Shape#fillPatternY
 * @method
 * @param {Number} y
 * @returns {Number}
 * @example
 * // get fill pattern y
 * var fillPatternY = shape.fillPatternY();
 * // set fill pattern y
 * shape.fillPatternY(20);
 */
Factory.addGetterSetter(Shape, 'fillLinearGradientColorStops');
/**
 * get/set fill linear gradient color stops
 * @name Konva.Shape#fillLinearGradientColorStops
 * @method
 * @param {Array} colorStops
 * @returns {Array} colorStops
 * @example
 * // get fill linear gradient color stops
 * var colorStops = shape.fillLinearGradientColorStops();
 *
 * // create a linear gradient that starts with red, changes to blue
 * // halfway through, and then changes to green
 * shape.fillLinearGradientColorStops(0, 'red', 0.5, 'blue', 1, 'green');
 */
Factory.addGetterSetter(Shape, 'strokeLinearGradientColorStops');
/**
 * get/set stroke linear gradient color stops
 * @name Konva.Shape#strokeLinearGradientColorStops
 * @method
 * @param {Array} colorStops
 * @returns {Array} colorStops
 * @example
 * // get stroke linear gradient color stops
 * var colorStops = shape.strokeLinearGradientColorStops();
 *
 * // create a linear gradient that starts with red, changes to blue
 * // halfway through, and then changes to green
 * shape.strokeLinearGradientColorStops([0, 'red', 0.5, 'blue', 1, 'green']);
 */
Factory.addGetterSetter(Shape, 'fillRadialGradientStartRadius', 0);
/**
 * get/set fill radial gradient start radius
 * @name Konva.Shape#fillRadialGradientStartRadius
 * @method
 * @param {Number} radius
 * @returns {Number}
 * @example
 * // get radial gradient start radius
 * var startRadius = shape.fillRadialGradientStartRadius();
 *
 * // set radial gradient start radius
 * shape.fillRadialGradientStartRadius(0);
 */
Factory.addGetterSetter(Shape, 'fillRadialGradientEndRadius', 0);
/**
 * get/set fill radial gradient end radius
 * @name Konva.Shape#fillRadialGradientEndRadius
 * @method
 * @param {Number} radius
 * @returns {Number}
 * @example
 * // get radial gradient end radius
 * var endRadius = shape.fillRadialGradientEndRadius();
 *
 * // set radial gradient end radius
 * shape.fillRadialGradientEndRadius(100);
 */
Factory.addGetterSetter(Shape, 'fillRadialGradientColorStops');
/**
 * get/set fill radial gradient color stops
 * @name Konva.Shape#fillRadialGradientColorStops
 * @method
 * @param {Number} colorStops
 * @returns {Array}
 * @example
 * // get fill radial gradient color stops
 * var colorStops = shape.fillRadialGradientColorStops();
 *
 * // create a radial gradient that starts with red, changes to blue
 * // halfway through, and then changes to green
 * shape.fillRadialGradientColorStops(0, 'red', 0.5, 'blue', 1, 'green');
 */
Factory.addGetterSetter(Shape, 'fillPatternRepeat', 'repeat');
/**
 * get/set fill pattern repeat.  Can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'repeat'
 * @name Konva.Shape#fillPatternRepeat
 * @method
 * @param {String} repeat
 * @returns {String}
 * @example
 * // get fill pattern repeat
 * var repeat = shape.fillPatternRepeat();
 *
 * // repeat pattern in x direction only
 * shape.fillPatternRepeat('repeat-x');
 *
 * // do not repeat the pattern
 * shape.fillPatternRepeat('no-repeat');
 */
Factory.addGetterSetter(Shape, 'fillEnabled', true);
/**
 * get/set fill enabled flag
 * @name Konva.Shape#fillEnabled
 * @method
 * @param {Boolean} enabled
 * @returns {Boolean}
 * @example
 * // get fill enabled flag
 * var fillEnabled = shape.fillEnabled();
 *
 * // disable fill
 * shape.fillEnabled(false);
 *
 * // enable fill
 * shape.fillEnabled(true);
 */
Factory.addGetterSetter(Shape, 'strokeEnabled', true);
/**
 * get/set stroke enabled flag
 * @name Konva.Shape#strokeEnabled
 * @method
 * @param {Boolean} enabled
 * @returns {Boolean}
 * @example
 * // get stroke enabled flag
 * var strokeEnabled = shape.strokeEnabled();
 *
 * // disable stroke
 * shape.strokeEnabled(false);
 *
 * // enable stroke
 * shape.strokeEnabled(true);
 */
Factory.addGetterSetter(Shape, 'shadowEnabled', true);
/**
 * get/set shadow enabled flag
 * @name Konva.Shape#shadowEnabled
 * @method
 * @param {Boolean} enabled
 * @returns {Boolean}
 * @example
 * // get shadow enabled flag
 * var shadowEnabled = shape.shadowEnabled();
 *
 * // disable shadow
 * shape.shadowEnabled(false);
 *
 * // enable shadow
 * shape.shadowEnabled(true);
 */
Factory.addGetterSetter(Shape, 'dashEnabled', true);
/**
 * get/set dash enabled flag
 * @name Konva.Shape#dashEnabled
 * @method
 * @param {Boolean} enabled
 * @returns {Boolean}
 * @example
 * // get dash enabled flag
 * var dashEnabled = shape.dashEnabled();
 *
 * // disable dash
 * shape.dashEnabled(false);
 *
 * // enable dash
 * shape.dashEnabled(true);
 */
Factory.addGetterSetter(Shape, 'strokeScaleEnabled', true);
/**
 * get/set strokeScale enabled flag
 * @name Konva.Shape#strokeScaleEnabled
 * @method
 * @param {Boolean} enabled
 * @returns {Boolean}
 * @example
 * // get stroke scale enabled flag
 * var strokeScaleEnabled = shape.strokeScaleEnabled();
 *
 * // disable stroke scale
 * shape.strokeScaleEnabled(false);
 *
 * // enable stroke scale
 * shape.strokeScaleEnabled(true);
 */
Factory.addGetterSetter(Shape, 'fillPriority', 'color');
/**
 * get/set fill priority.  can be color, pattern, linear-gradient, or radial-gradient.  The default is color.
 *   This is handy if you want to toggle between different fill types.
 * @name Konva.Shape#fillPriority
 * @method
 * @param {String} priority
 * @returns {String}
 * @example
 * // get fill priority
 * var fillPriority = shape.fillPriority();
 *
 * // set fill priority
 * shape.fillPriority('linear-gradient');
 */
Factory.addComponentsGetterSetter(Shape, 'fillPatternOffset', ['x', 'y']);
/**
 * get/set fill pattern offset
 * @name Konva.Shape#fillPatternOffset
 * @method
 * @param {Object} offset
 * @param {Number} offset.x
 * @param {Number} offset.y
 * @returns {Object}
 * @example
 * // get fill pattern offset
 * var patternOffset = shape.fillPatternOffset();
 *
 * // set fill pattern offset
 * shape.fillPatternOffset({
 *   x: 20,
 *   y: 10
 * });
 */
Factory.addGetterSetter(Shape, 'fillPatternOffsetX', 0, getNumberValidator());
/**
 * get/set fill pattern offset x
 * @name Konva.Shape#fillPatternOffsetX
 * @method
 * @param {Number} x
 * @returns {Number}
 * @example
 * // get fill pattern offset x
 * var patternOffsetX = shape.fillPatternOffsetX();
 *
 * // set fill pattern offset x
 * shape.fillPatternOffsetX(20);
 */
Factory.addGetterSetter(Shape, 'fillPatternOffsetY', 0, getNumberValidator());
/**
 * get/set fill pattern offset y
 * @name Konva.Shape#fillPatternOffsetY
 * @method
 * @param {Number} y
 * @returns {Number}
 * @example
 * // get fill pattern offset y
 * var patternOffsetY = shape.fillPatternOffsetY();
 *
 * // set fill pattern offset y
 * shape.fillPatternOffsetY(10);
 */
Factory.addComponentsGetterSetter(Shape, 'fillPatternScale', ['x', 'y']);
/**
 * get/set fill pattern scale
 * @name Konva.Shape#fillPatternScale
 * @method
 * @param {Object} scale
 * @param {Number} scale.x
 * @param {Number} scale.y
 * @returns {Object}
 * @example
 * // get fill pattern scale
 * var patternScale = shape.fillPatternScale();
 *
 * // set fill pattern scale
 * shape.fillPatternScale({
 *   x: 2,
 *   y: 2
 * });
 */
Factory.addGetterSetter(Shape, 'fillPatternScaleX', 1, getNumberValidator());
/**
 * get/set fill pattern scale x
 * @name Konva.Shape#fillPatternScaleX
 * @method
 * @param {Number} x
 * @returns {Number}
 * @example
 * // get fill pattern scale x
 * var patternScaleX = shape.fillPatternScaleX();
 *
 * // set fill pattern scale x
 * shape.fillPatternScaleX(2);
 */
Factory.addGetterSetter(Shape, 'fillPatternScaleY', 1, getNumberValidator());
/**
 * get/set fill pattern scale y
 * @name Konva.Shape#fillPatternScaleY
 * @method
 * @param {Number} y
 * @returns {Number}
 * @example
 * // get fill pattern scale y
 * var patternScaleY = shape.fillPatternScaleY();
 *
 * // set fill pattern scale y
 * shape.fillPatternScaleY(2);
 */
Factory.addComponentsGetterSetter(Shape, 'fillLinearGradientStartPoint', [
    'x',
    'y',
]);
/**
 * get/set fill linear gradient start point
 * @name Konva.Shape#fillLinearGradientStartPoint
 * @method
 * @param {Object} startPoint
 * @param {Number} startPoint.x
 * @param {Number} startPoint.y
 * @returns {Object}
 * @example
 * // get fill linear gradient start point
 * var startPoint = shape.fillLinearGradientStartPoint();
 *
 * // set fill linear gradient start point
 * shape.fillLinearGradientStartPoint({
 *   x: 20,
 *   y: 10
 * });
 */
Factory.addComponentsGetterSetter(Shape, 'strokeLinearGradientStartPoint', [
    'x',
    'y',
]);
/**
 * get/set stroke linear gradient start point
 * @name Konva.Shape#strokeLinearGradientStartPoint
 * @method
 * @param {Object} startPoint
 * @param {Number} startPoint.x
 * @param {Number} startPoint.y
 * @returns {Object}
 * @example
 * // get stroke linear gradient start point
 * var startPoint = shape.strokeLinearGradientStartPoint();
 *
 * // set stroke linear gradient start point
 * shape.strokeLinearGradientStartPoint({
 *   x: 20,
 *   y: 10
 * });
 */
Factory.addGetterSetter(Shape, 'fillLinearGradientStartPointX', 0);
/**
 * get/set fill linear gradient start point x
 * @name Konva.Shape#fillLinearGradientStartPointX
 * @method
 * @param {Number} x
 * @returns {Number}
 * @example
 * // get fill linear gradient start point x
 * var startPointX = shape.fillLinearGradientStartPointX();
 *
 * // set fill linear gradient start point x
 * shape.fillLinearGradientStartPointX(20);
 */
Factory.addGetterSetter(Shape, 'strokeLinearGradientStartPointX', 0);
/**
 * get/set stroke linear gradient start point x
 * @name Konva.Shape#linearLinearGradientStartPointX
 * @method
 * @param {Number} x
 * @returns {Number}
 * @example
 * // get stroke linear gradient start point x
 * var startPointX = shape.strokeLinearGradientStartPointX();
 *
 * // set stroke linear gradient start point x
 * shape.strokeLinearGradientStartPointX(20);
 */
Factory.addGetterSetter(Shape, 'fillLinearGradientStartPointY', 0);
/**
 * get/set fill linear gradient start point y
 * @name Konva.Shape#fillLinearGradientStartPointY
 * @method
 * @param {Number} y
 * @returns {Number}
 * @example
 * // get fill linear gradient start point y
 * var startPointY = shape.fillLinearGradientStartPointY();
 *
 * // set fill linear gradient start point y
 * shape.fillLinearGradientStartPointY(20);
 */
Factory.addGetterSetter(Shape, 'strokeLinearGradientStartPointY', 0);
/**
 * get/set stroke linear gradient start point y
 * @name Konva.Shape#strokeLinearGradientStartPointY
 * @method
 * @param {Number} y
 * @returns {Number}
 * @example
 * // get stroke linear gradient start point y
 * var startPointY = shape.strokeLinearGradientStartPointY();
 *
 * // set stroke linear gradient start point y
 * shape.strokeLinearGradientStartPointY(20);
 */
Factory.addComponentsGetterSetter(Shape, 'fillLinearGradientEndPoint', [
    'x',
    'y',
]);
/**
 * get/set fill linear gradient end point
 * @name Konva.Shape#fillLinearGradientEndPoint
 * @method
 * @param {Object} endPoint
 * @param {Number} endPoint.x
 * @param {Number} endPoint.y
 * @returns {Object}
 * @example
 * // get fill linear gradient end point
 * var endPoint = shape.fillLinearGradientEndPoint();
 *
 * // set fill linear gradient end point
 * shape.fillLinearGradientEndPoint({
 *   x: 20,
 *   y: 10
 * });
 */
Factory.addComponentsGetterSetter(Shape, 'strokeLinearGradientEndPoint', [
    'x',
    'y',
]);
/**
 * get/set stroke linear gradient end point
 * @name Konva.Shape#strokeLinearGradientEndPoint
 * @method
 * @param {Object} endPoint
 * @param {Number} endPoint.x
 * @param {Number} endPoint.y
 * @returns {Object}
 * @example
 * // get stroke linear gradient end point
 * var endPoint = shape.strokeLinearGradientEndPoint();
 *
 * // set stroke linear gradient end point
 * shape.strokeLinearGradientEndPoint({
 *   x: 20,
 *   y: 10
 * });
 */
Factory.addGetterSetter(Shape, 'fillLinearGradientEndPointX', 0);
/**
 * get/set fill linear gradient end point x
 * @name Konva.Shape#fillLinearGradientEndPointX
 * @method
 * @param {Number} x
 * @returns {Number}
 * @example
 * // get fill linear gradient end point x
 * var endPointX = shape.fillLinearGradientEndPointX();
 *
 * // set fill linear gradient end point x
 * shape.fillLinearGradientEndPointX(20);
 */
Factory.addGetterSetter(Shape, 'strokeLinearGradientEndPointX', 0);
/**
 * get/set fill linear gradient end point x
 * @name Konva.Shape#strokeLinearGradientEndPointX
 * @method
 * @param {Number} x
 * @returns {Number}
 * @example
 * // get stroke linear gradient end point x
 * var endPointX = shape.strokeLinearGradientEndPointX();
 *
 * // set stroke linear gradient end point x
 * shape.strokeLinearGradientEndPointX(20);
 */
Factory.addGetterSetter(Shape, 'fillLinearGradientEndPointY', 0);
/**
 * get/set fill linear gradient end point y
 * @name Konva.Shape#fillLinearGradientEndPointY
 * @method
 * @param {Number} y
 * @returns {Number}
 * @example
 * // get fill linear gradient end point y
 * var endPointY = shape.fillLinearGradientEndPointY();
 *
 * // set fill linear gradient end point y
 * shape.fillLinearGradientEndPointY(20);
 */
Factory.addGetterSetter(Shape, 'strokeLinearGradientEndPointY', 0);
/**
 * get/set stroke linear gradient end point y
 * @name Konva.Shape#strokeLinearGradientEndPointY
 * @method
 * @param {Number} y
 * @returns {Number}
 * @example
 * // get stroke linear gradient end point y
 * var endPointY = shape.strokeLinearGradientEndPointY();
 *
 * // set stroke linear gradient end point y
 * shape.strokeLinearGradientEndPointY(20);
 */
Factory.addComponentsGetterSetter(Shape, 'fillRadialGradientStartPoint', [
    'x',
    'y',
]);
/**
 * get/set fill radial gradient start point
 * @name Konva.Shape#fillRadialGradientStartPoint
 * @method
 * @param {Object} startPoint
 * @param {Number} startPoint.x
 * @param {Number} startPoint.y
 * @returns {Object}
 * @example
 * // get fill radial gradient start point
 * var startPoint = shape.fillRadialGradientStartPoint();
 *
 * // set fill radial gradient start point
 * shape.fillRadialGradientStartPoint({
 *   x: 20,
 *   y: 10
 * });
 */
Factory.addGetterSetter(Shape, 'fillRadialGradientStartPointX', 0);
/**
 * get/set fill radial gradient start point x
 * @name Konva.Shape#fillRadialGradientStartPointX
 * @method
 * @param {Number} x
 * @returns {Number}
 * @example
 * // get fill radial gradient start point x
 * var startPointX = shape.fillRadialGradientStartPointX();
 *
 * // set fill radial gradient start point x
 * shape.fillRadialGradientStartPointX(20);
 */
Factory.addGetterSetter(Shape, 'fillRadialGradientStartPointY', 0);
/**
 * get/set fill radial gradient start point y
 * @name Konva.Shape#fillRadialGradientStartPointY
 * @method
 * @param {Number} y
 * @returns {Number}
 * @example
 * // get fill radial gradient start point y
 * var startPointY = shape.fillRadialGradientStartPointY();
 *
 * // set fill radial gradient start point y
 * shape.fillRadialGradientStartPointY(20);
 */
Factory.addComponentsGetterSetter(Shape, 'fillRadialGradientEndPoint', [
    'x',
    'y',
]);
/**
 * get/set fill radial gradient end point
 * @name Konva.Shape#fillRadialGradientEndPoint
 * @method
 * @param {Object} endPoint
 * @param {Number} endPoint.x
 * @param {Number} endPoint.y
 * @returns {Object}
 * @example
 * // get fill radial gradient end point
 * var endPoint = shape.fillRadialGradientEndPoint();
 *
 * // set fill radial gradient end point
 * shape.fillRadialGradientEndPoint({
 *   x: 20,
 *   y: 10
 * });
 */
Factory.addGetterSetter(Shape, 'fillRadialGradientEndPointX', 0);
/**
 * get/set fill radial gradient end point x
 * @name Konva.Shape#fillRadialGradientEndPointX
 * @method
 * @param {Number} x
 * @returns {Number}
 * @example
 * // get fill radial gradient end point x
 * var endPointX = shape.fillRadialGradientEndPointX();
 *
 * // set fill radial gradient end point x
 * shape.fillRadialGradientEndPointX(20);
 */
Factory.addGetterSetter(Shape, 'fillRadialGradientEndPointY', 0);
/**
 * get/set fill radial gradient end point y
 * @name Konva.Shape#fillRadialGradientEndPointY
 * @method
 * @param {Number} y
 * @returns {Number}
 * @example
 * // get fill radial gradient end point y
 * var endPointY = shape.fillRadialGradientEndPointY();
 *
 * // set fill radial gradient end point y
 * shape.fillRadialGradientEndPointY(20);
 */
Factory.addGetterSetter(Shape, 'fillPatternRotation', 0);
/**
 * get/set fill pattern rotation in degrees
 * @name Konva.Shape#fillPatternRotation
 * @method
 * @param {Number} rotation
 * @returns {Konva.Shape}
 * @example
 * // get fill pattern rotation
 * var patternRotation = shape.fillPatternRotation();
 *
 * // set fill pattern rotation
 * shape.fillPatternRotation(20);
 */
Factory.addGetterSetter(Shape, 'fillRule', undefined, getStringValidator());
/**
 * get/set fill rule
 * @name Konva.Shape#fillRule
 * @method
 * @param {CanvasFillRule} rotation
 * @returns {Konva.Shape}
 * @example
 * // get fill rule
 * var fillRule = shape.fillRule();
 *
 * // set fill rule
 * shape.fillRule('evenodd');
 */
Factory.backCompat(Shape, {
    dashArray: 'dash',
    getDashArray: 'getDash',
    setDashArray: 'getDash',
    drawFunc: 'sceneFunc',
    getDrawFunc: 'getSceneFunc',
    setDrawFunc: 'setSceneFunc',
    drawHitFunc: 'hitFunc',
    getDrawHitFunc: 'getHitFunc',
    setDrawHitFunc: 'setHitFunc',
});

const now = (function () {
    if (glob.performance && glob.performance.now) {
        return function () {
            return glob.performance.now();
        };
    }
    return function () {
        return new Date().getTime();
    };
})();
/**
 * Animation constructor.
 * @constructor
 * @memberof Konva
 * @param {AnimationFn} func function executed on each animation frame.  The function is passed a frame object, which contains
 *  timeDiff, lastTime, time, and frameRate properties.  The timeDiff property is the number of milliseconds that have passed
 *  since the last animation frame. The time property is the time in milliseconds that elapsed from the moment the animation started
 *  to the current animation frame. The lastTime property is a `time` value from the previous frame.  The frameRate property is the current frame rate in frames / second.
 *  Return false from function, if you don't need to redraw layer/layers on some frames.
 * @param {Konva.Layer|Array} [layers] layer(s) to be redrawn on each animation frame. Can be a layer, an array of layers, or null.
 *  Not specifying a node will result in no redraw.
 * @example
 * // move a node to the right at 50 pixels / second
 * var velocity = 50;
 *
 * var anim = new Konva.Animation(function(frame) {
 *   var dist = velocity * (frame.timeDiff / 1000);
 *   node.move({x: dist, y: 0});
 * }, layer);
 *
 * anim.start();
 */
class Animation {
    constructor(func, layers) {
        this.id = Animation.animIdCounter++;
        this.frame = {
            time: 0,
            timeDiff: 0,
            lastTime: now(),
            frameRate: 0,
        };
        this.func = func;
        this.setLayers(layers);
    }
    /**
     * set layers to be redrawn on each animation frame
     * @method
     * @name Konva.Animation#setLayers
     * @param {Konva.Layer|Array} [layers] layer(s) to be redrawn. Can be a layer, an array of layers, or null.  Not specifying a node will result in no redraw.
     * @return {Konva.Animation} this
     */
    setLayers(layers) {
        let lays = [];
        // if passing in no layers
        if (layers) {
            lays = Array.isArray(layers) ? layers : [layers];
        }
        this.layers = lays;
        return this;
    }
    /**
     * get layers
     * @method
     * @name Konva.Animation#getLayers
     * @return {Array} Array of Konva.Layer
     */
    getLayers() {
        return this.layers;
    }
    /**
     * add layer.  Returns true if the layer was added, and false if it was not
     * @method
     * @name Konva.Animation#addLayer
     * @param {Konva.Layer} layer to add
     * @return {Bool} true if layer is added to animation, otherwise false
     */
    addLayer(layer) {
        const layers = this.layers;
        const len = layers.length;
        // don't add the layer if it already exists
        for (let n = 0; n < len; n++) {
            if (layers[n]._id === layer._id) {
                return false;
            }
        }
        this.layers.push(layer);
        return true;
    }
    /**
     * determine if animation is running or not.  returns true or false
     * @method
     * @name Konva.Animation#isRunning
     * @return {Bool} is animation running?
     */
    isRunning() {
        const a = Animation;
        const animations = a.animations;
        const len = animations.length;
        for (let n = 0; n < len; n++) {
            if (animations[n].id === this.id) {
                return true;
            }
        }
        return false;
    }
    /**
     * start animation
     * @method
     * @name Konva.Animation#start
     * @return {Konva.Animation} this
     */
    start() {
        this.stop();
        this.frame.timeDiff = 0;
        this.frame.lastTime = now();
        Animation._addAnimation(this);
        return this;
    }
    /**
     * stop animation
     * @method
     * @name Konva.Animation#stop
     * @return {Konva.Animation} this
     */
    stop() {
        Animation._removeAnimation(this);
        return this;
    }
    _updateFrameObject(time) {
        this.frame.timeDiff = time - this.frame.lastTime;
        this.frame.lastTime = time;
        this.frame.time += this.frame.timeDiff;
        this.frame.frameRate = 1000 / this.frame.timeDiff;
    }
    static _addAnimation(anim) {
        this.animations.push(anim);
        this._handleAnimation();
    }
    static _removeAnimation(anim) {
        const id = anim.id;
        const animations = this.animations;
        const len = animations.length;
        for (let n = 0; n < len; n++) {
            if (animations[n].id === id) {
                this.animations.splice(n, 1);
                break;
            }
        }
    }
    static _runFrames() {
        const layerHash = {};
        const animations = this.animations;
        /*
         * loop through all animations and execute animation
         *  function.  if the animation object has specified node,
         *  we can add the node to the nodes hash to eliminate
         *  drawing the same node multiple times.  The node property
         *  can be the stage itself or a layer
         */
        /*
         * WARNING: don't cache animations.length because it could change while
         * the for loop is running, causing a JS error
         */
        for (let n = 0; n < animations.length; n++) {
            const anim = animations[n];
            const layers = anim.layers;
            const func = anim.func;
            anim._updateFrameObject(now());
            const layersLen = layers.length;
            // if animation object has a function, execute it
            let needRedraw;
            if (func) {
                // allow anim bypassing drawing
                needRedraw = func.call(anim, anim.frame) !== false;
            }
            else {
                needRedraw = true;
            }
            if (!needRedraw) {
                continue;
            }
            for (let i = 0; i < layersLen; i++) {
                const layer = layers[i];
                if (layer._id !== undefined) {
                    layerHash[layer._id] = layer;
                }
            }
        }
        for (const key in layerHash) {
            if (!layerHash.hasOwnProperty(key)) {
                continue;
            }
            layerHash[key].batchDraw();
        }
    }
    static _animationLoop() {
        const Anim = Animation;
        if (Anim.animations.length) {
            Anim._runFrames();
            Util.requestAnimFrame(Anim._animationLoop);
        }
        else {
            Anim.animRunning = false;
        }
    }
    static _handleAnimation() {
        if (!this.animRunning) {
            this.animRunning = true;
            Util.requestAnimFrame(this._animationLoop);
        }
    }
}
Animation.animations = [];
Animation.animIdCounter = 0;
Animation.animRunning = false;

const blacklist = {
    node: 1,
    duration: 1,
    easing: 1,
    onFinish: 1,
    yoyo: 1,
}, PAUSED = 1, PLAYING = 2, REVERSING = 3, colorAttrs = ['fill', 'stroke', 'shadowColor'];
let idCounter = 0;
class TweenEngine {
    constructor(prop, propFunc, func, begin, finish, duration, yoyo) {
        this.prop = prop;
        this.propFunc = propFunc;
        this.begin = begin;
        this._pos = begin;
        this.duration = duration;
        this._change = 0;
        this.prevPos = 0;
        this.yoyo = yoyo;
        this._time = 0;
        this._position = 0;
        this._startTime = 0;
        this._finish = 0;
        this.func = func;
        this._change = finish - this.begin;
        this.pause();
    }
    fire(str) {
        const handler = this[str];
        if (handler) {
            handler();
        }
    }
    setTime(t) {
        if (t > this.duration) {
            if (this.yoyo) {
                this._time = this.duration;
                this.reverse();
            }
            else {
                this.finish();
            }
        }
        else if (t < 0) {
            if (this.yoyo) {
                this._time = 0;
                this.play();
            }
            else {
                this.reset();
            }
        }
        else {
            this._time = t;
            this.update();
        }
    }
    getTime() {
        return this._time;
    }
    setPosition(p) {
        this.prevPos = this._pos;
        this.propFunc(p);
        this._pos = p;
    }
    getPosition(t) {
        if (t === undefined) {
            t = this._time;
        }
        return this.func(t, this.begin, this._change, this.duration);
    }
    play() {
        this.state = PLAYING;
        this._startTime = this.getTimer() - this._time;
        this.onEnterFrame();
        this.fire('onPlay');
    }
    reverse() {
        this.state = REVERSING;
        this._time = this.duration - this._time;
        this._startTime = this.getTimer() - this._time;
        this.onEnterFrame();
        this.fire('onReverse');
    }
    seek(t) {
        this.pause();
        this._time = t;
        this.update();
        this.fire('onSeek');
    }
    reset() {
        this.pause();
        this._time = 0;
        this.update();
        this.fire('onReset');
    }
    finish() {
        this.pause();
        this._time = this.duration;
        this.update();
        this.fire('onFinish');
    }
    update() {
        this.setPosition(this.getPosition(this._time));
        this.fire('onUpdate');
    }
    onEnterFrame() {
        const t = this.getTimer() - this._startTime;
        if (this.state === PLAYING) {
            this.setTime(t);
        }
        else if (this.state === REVERSING) {
            this.setTime(this.duration - t);
        }
    }
    pause() {
        this.state = PAUSED;
        this.fire('onPause');
    }
    getTimer() {
        return new Date().getTime();
    }
}
/**
 * Tween constructor.  Tweens enable you to animate a node between the current state and a new state.
 *  You can play, pause, reverse, seek, reset, and finish tweens.  By default, tweens are animated using
 *  a linear easing.  For more tweening options, check out {@link Konva.Easings}
 * @constructor
 * @memberof Konva
 * @example
 * // instantiate new tween which fully rotates a node in 1 second
 * var tween = new Konva.Tween({
 *   // list of tween specific properties
 *   node: node,
 *   duration: 1,
 *   easing: Konva.Easings.EaseInOut,
 *   onUpdate: () => console.log('node attrs updated')
 *   onFinish: () => console.log('finished'),
 *   // set new values for any attributes of a passed node
 *   rotation: 360,
 *   fill: 'red'
 * });
 *
 * // play tween
 * tween.play();
 *
 * // pause tween
 * tween.pause();
 */
class Tween {
    constructor(config) {
        const that = this, node = config.node, nodeId = node._id, easing = config.easing || Easings.Linear, yoyo = !!config.yoyo;
        let duration, key;
        if (typeof config.duration === 'undefined') {
            duration = 0.3;
        }
        else if (config.duration === 0) {
            // zero is bad value for duration
            duration = 0.001;
        }
        else {
            duration = config.duration;
        }
        this.node = node;
        this._id = idCounter++;
        const layers = node.getLayer() ||
            (node instanceof Konva$2['Stage'] ? node.getLayers() : null);
        if (!layers) {
            Util.error('Tween constructor have `node` that is not in a layer. Please add node into layer first.');
        }
        this.anim = new Animation(function () {
            that.tween.onEnterFrame();
        }, layers);
        this.tween = new TweenEngine(key, function (i) {
            that._tweenFunc(i);
        }, easing, 0, 1, duration * 1000, yoyo);
        this._addListeners();
        // init attrs map
        if (!Tween.attrs[nodeId]) {
            Tween.attrs[nodeId] = {};
        }
        if (!Tween.attrs[nodeId][this._id]) {
            Tween.attrs[nodeId][this._id] = {};
        }
        // init tweens map
        if (!Tween.tweens[nodeId]) {
            Tween.tweens[nodeId] = {};
        }
        for (key in config) {
            if (blacklist[key] === undefined) {
                this._addAttr(key, config[key]);
            }
        }
        this.reset();
        // callbacks
        this.onFinish = config.onFinish;
        this.onReset = config.onReset;
        this.onUpdate = config.onUpdate;
    }
    _addAttr(key, end) {
        const node = this.node, nodeId = node._id;
        let diff, len, trueEnd, trueStart, endRGBA;
        // remove conflict from tween map if it exists
        const tweenId = Tween.tweens[nodeId][key];
        if (tweenId) {
            delete Tween.attrs[nodeId][tweenId][key];
        }
        // add to tween map
        let start = node.getAttr(key);
        if (Util._isArray(end)) {
            diff = [];
            len = Math.max(end.length, start.length);
            if (key === 'points' && end.length !== start.length) {
                // before tweening points we need to make sure that start.length === end.length
                // Util._prepareArrayForTween thinking that end.length > start.length
                if (end.length > start.length) {
                    // so in this case we will increase number of starting points
                    trueStart = start;
                    start = Util._prepareArrayForTween(start, end, node.closed());
                }
                else {
                    // in this case we will increase number of eding points
                    trueEnd = end;
                    end = Util._prepareArrayForTween(end, start, node.closed());
                }
            }
            if (key.indexOf('fill') === 0) {
                for (let n = 0; n < len; n++) {
                    if (n % 2 === 0) {
                        diff.push(end[n] - start[n]);
                    }
                    else {
                        const startRGBA = Util.colorToRGBA(start[n]);
                        endRGBA = Util.colorToRGBA(end[n]);
                        start[n] = startRGBA;
                        diff.push({
                            r: endRGBA.r - startRGBA.r,
                            g: endRGBA.g - startRGBA.g,
                            b: endRGBA.b - startRGBA.b,
                            a: endRGBA.a - startRGBA.a,
                        });
                    }
                }
            }
            else {
                for (let n = 0; n < len; n++) {
                    diff.push(end[n] - start[n]);
                }
            }
        }
        else if (colorAttrs.indexOf(key) !== -1) {
            start = Util.colorToRGBA(start);
            endRGBA = Util.colorToRGBA(end);
            diff = {
                r: endRGBA.r - start.r,
                g: endRGBA.g - start.g,
                b: endRGBA.b - start.b,
                a: endRGBA.a - start.a,
            };
        }
        else {
            diff = end - start;
        }
        Tween.attrs[nodeId][this._id][key] = {
            start: start,
            diff: diff,
            end: end,
            trueEnd: trueEnd,
            trueStart: trueStart,
        };
        Tween.tweens[nodeId][key] = this._id;
    }
    _tweenFunc(i) {
        const node = this.node, attrs = Tween.attrs[node._id][this._id];
        let key, attr, start, diff, newVal, n, len, end;
        for (key in attrs) {
            attr = attrs[key];
            start = attr.start;
            diff = attr.diff;
            end = attr.end;
            if (Util._isArray(start)) {
                newVal = [];
                len = Math.max(start.length, end.length);
                if (key.indexOf('fill') === 0) {
                    for (n = 0; n < len; n++) {
                        if (n % 2 === 0) {
                            newVal.push((start[n] || 0) + diff[n] * i);
                        }
                        else {
                            newVal.push('rgba(' +
                                Math.round(start[n].r + diff[n].r * i) +
                                ',' +
                                Math.round(start[n].g + diff[n].g * i) +
                                ',' +
                                Math.round(start[n].b + diff[n].b * i) +
                                ',' +
                                (start[n].a + diff[n].a * i) +
                                ')');
                        }
                    }
                }
                else {
                    for (n = 0; n < len; n++) {
                        newVal.push((start[n] || 0) + diff[n] * i);
                    }
                }
            }
            else if (colorAttrs.indexOf(key) !== -1) {
                newVal =
                    'rgba(' +
                        Math.round(start.r + diff.r * i) +
                        ',' +
                        Math.round(start.g + diff.g * i) +
                        ',' +
                        Math.round(start.b + diff.b * i) +
                        ',' +
                        (start.a + diff.a * i) +
                        ')';
            }
            else {
                newVal = start + diff * i;
            }
            node.setAttr(key, newVal);
        }
    }
    _addListeners() {
        // start listeners
        this.tween.onPlay = () => {
            this.anim.start();
        };
        this.tween.onReverse = () => {
            this.anim.start();
        };
        // stop listeners
        this.tween.onPause = () => {
            this.anim.stop();
        };
        this.tween.onFinish = () => {
            const node = this.node;
            // after tweening  points of line we need to set original end
            const attrs = Tween.attrs[node._id][this._id];
            if (attrs.points && attrs.points.trueEnd) {
                node.setAttr('points', attrs.points.trueEnd);
            }
            if (this.onFinish) {
                this.onFinish.call(this);
            }
        };
        this.tween.onReset = () => {
            const node = this.node;
            // after tweening  points of line we need to set original start
            const attrs = Tween.attrs[node._id][this._id];
            if (attrs.points && attrs.points.trueStart) {
                node.points(attrs.points.trueStart);
            }
            if (this.onReset) {
                this.onReset();
            }
        };
        this.tween.onUpdate = () => {
            if (this.onUpdate) {
                this.onUpdate.call(this);
            }
        };
    }
    /**
     * play
     * @method
     * @name Konva.Tween#play
     * @returns {Tween}
     */
    play() {
        this.tween.play();
        return this;
    }
    /**
     * reverse
     * @method
     * @name Konva.Tween#reverse
     * @returns {Tween}
     */
    reverse() {
        this.tween.reverse();
        return this;
    }
    /**
     * reset
     * @method
     * @name Konva.Tween#reset
     * @returns {Tween}
     */
    reset() {
        this.tween.reset();
        return this;
    }
    /**
     * seek
     * @method
     * @name Konva.Tween#seek(
     * @param {Integer} t time in seconds between 0 and the duration
     * @returns {Tween}
     */
    seek(t) {
        this.tween.seek(t * 1000);
        return this;
    }
    /**
     * pause
     * @method
     * @name Konva.Tween#pause
     * @returns {Tween}
     */
    pause() {
        this.tween.pause();
        return this;
    }
    /**
     * finish
     * @method
     * @name Konva.Tween#finish
     * @returns {Tween}
     */
    finish() {
        this.tween.finish();
        return this;
    }
    /**
     * destroy
     * @method
     * @name Konva.Tween#destroy
     */
    destroy() {
        const nodeId = this.node._id, thisId = this._id, attrs = Tween.tweens[nodeId];
        this.pause();
        // Clean up animation
        if (this.anim) {
            this.anim.stop();
        }
        // Clean up tween entries
        for (const key in attrs) {
            delete Tween.tweens[nodeId][key];
        }
        // Clean up attrs entry
        delete Tween.attrs[nodeId][thisId];
        // Clean up parent objects if empty
        if (Object.keys(Tween.tweens[nodeId]).length === 0) {
            delete Tween.tweens[nodeId];
        }
        if (Object.keys(Tween.attrs[nodeId]).length === 0) {
            delete Tween.attrs[nodeId];
        }
    }
}
Tween.attrs = {};
Tween.tweens = {};
/**
 * Tween node properties. Shorter usage of {@link Konva.Tween} object.
 *
 * @method Konva.Node#to
 * @param {Object} [params] tween params
 * @example
 *
 * circle.to({
 *   x : 50,
 *   duration : 0.5,
 *   onUpdate: () => console.log('props updated'),
 *   onFinish: () => console.log('finished'),
 * });
 */
Node.prototype.to = function (params) {
    const onFinish = params.onFinish;
    params.node = this;
    params.onFinish = function () {
        this.destroy();
        if (onFinish) {
            onFinish();
        }
    };
    const tween = new Tween(params);
    tween.play();
};
/*
 * These eases were ported from an Adobe Flash tweening library to JavaScript
 * by Xaric
 */
/**
 * @namespace Easings
 * @memberof Konva
 */
const Easings = {
    /**
     * back ease in
     * @function
     * @memberof Konva.Easings
     */
    BackEaseIn(t, b, c, d) {
        const s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    /**
     * back ease out
     * @function
     * @memberof Konva.Easings
     */
    BackEaseOut(t, b, c, d) {
        const s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    /**
     * back ease in out
     * @function
     * @memberof Konva.Easings
     */
    BackEaseInOut(t, b, c, d) {
        let s = 1.70158;
        if ((t /= d / 2) < 1) {
            return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        }
        return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    /**
     * elastic ease in
     * @function
     * @memberof Konva.Easings
     */
    ElasticEaseIn(t, b, c, d, a, p) {
        // added s = 0
        let s = 0;
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        return (-(a *
            Math.pow(2, 10 * (t -= 1)) *
            Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b);
    },
    /**
     * elastic ease out
     * @function
     * @memberof Konva.Easings
     */
    ElasticEaseOut(t, b, c, d, a, p) {
        // added s = 0
        let s = 0;
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        return (a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
            c +
            b);
    },
    /**
     * elastic ease in out
     * @function
     * @memberof Konva.Easings
     */
    ElasticEaseInOut(t, b, c, d, a, p) {
        // added s = 0
        let s = 0;
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) === 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = (p / (2 * Math.PI)) * Math.asin(c / a);
        }
        if (t < 1) {
            return (-0.5 *
                (a *
                    Math.pow(2, 10 * (t -= 1)) *
                    Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
                b);
        }
        return (a *
            Math.pow(2, -10 * (t -= 1)) *
            Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
            0.5 +
            c +
            b);
    },
    /**
     * bounce ease out
     * @function
     * @memberof Konva.Easings
     */
    BounceEaseOut(t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        }
        else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
        }
        else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
        }
        else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
        }
    },
    /**
     * bounce ease in
     * @function
     * @memberof Konva.Easings
     */
    BounceEaseIn(t, b, c, d) {
        return c - Easings.BounceEaseOut(d - t, 0, c, d) + b;
    },
    /**
     * bounce ease in out
     * @function
     * @memberof Konva.Easings
     */
    BounceEaseInOut(t, b, c, d) {
        if (t < d / 2) {
            return Easings.BounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
        }
        else {
            return Easings.BounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }
    },
    /**
     * ease in
     * @function
     * @memberof Konva.Easings
     */
    EaseIn(t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    /**
     * ease out
     * @function
     * @memberof Konva.Easings
     */
    EaseOut(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    /**
     * ease in out
     * @function
     * @memberof Konva.Easings
     */
    EaseInOut(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return (c / 2) * t * t + b;
        }
        return (-c / 2) * (--t * (t - 2) - 1) + b;
    },
    /**
     * strong ease in
     * @function
     * @memberof Konva.Easings
     */
    StrongEaseIn(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    /**
     * strong ease out
     * @function
     * @memberof Konva.Easings
     */
    StrongEaseOut(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    /**
     * strong ease in out
     * @function
     * @memberof Konva.Easings
     */
    StrongEaseInOut(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return (c / 2) * t * t * t * t * t + b;
        }
        return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
    },
    /**
     * linear
     * @function
     * @memberof Konva.Easings
     */
    Linear(t, b, c, d) {
        return (c * t) / d + b;
    },
};

// what is core parts of Konva?
const Konva$1 = Util._assign(Konva$2, {
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

/**
 * Circle constructor
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {Number} config.radius
 * @@shapeParams
 * @@nodeParams
 * @example
 * // create circle
 * var circle = new Konva.Circle({
 *   radius: 40,
 *   fill: 'red',
 *   stroke: 'black',
 *   strokeWidth: 5
 * });
 */
class Circle extends Shape {
    constructor(config) {
        var _a, _b, _c;
        super(config);
        this._object = new PIXI.Graphics()
            .beginPath()
            .fill((_a = this.fill()) !== null && _a !== void 0 ? _a : 0xffffff)
            .setStrokeStyle({
            width: (_b = this.strokeWidth()) !== null && _b !== void 0 ? _b : 0,
            color: (_c = this.stroke()) !== null && _c !== void 0 ? _c : 0x000000
        })
            .arc(0, 0, this.attrs.radius || 0, 0, Math.PI * 2, false);
    }
    getWidth() {
        return this.radius() * 2;
    }
    getHeight() {
        return this.radius() * 2;
    }
    setWidth(width) {
        if (this.radius() !== width / 2) {
            this.radius(width / 2);
        }
    }
    setHeight(height) {
        if (this.radius() !== height / 2) {
            this.radius(height / 2);
        }
    }
}
Circle.prototype._centroid = true;
Circle.prototype.className = 'Circle';
Circle.prototype._attrsAffectingSize = ['radius'];
_registerNode(Circle);
/**
 * get/set radius
 * @name Konva.Circle#radius
 * @method
 * @param {Number} radius
 * @returns {Number}
 * @example
 * // get radius
 * var radius = circle.radius();
 *
 * // set radius
 * circle.radius(10);
 */
Factory.addGetterSetter(Circle, 'radius', 0, getNumberValidator());

/**
 * Image constructor
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {Image} config.image
 * @param {Object} [config.crop]
 * @@shapeParams
 * @@nodeParams
 * @example
 * var imageObj = new Image();
 * imageObj.onload = function() {
 *   var image = new Konva.Image({
 *     x: 200,
 *     y: 50,
 *     image: imageObj,
 *     width: 100,
 *     height: 100
 *   });
 * };
 * imageObj.src = '/path/to/image.jpg'
 */
class Image extends Shape {
    constructor(attrs) {
        super(attrs);
        this.on('imageChange.konva', (props) => {
            this._removeImageLoad(props.oldVal);
            this._setImageLoad();
        });
        this._setImageLoad();
    }
    _setImageLoad() {
        const image = this.image();
        // check is image is already loaded
        if (image && image.complete) {
            return;
        }
        // check is video is already loaded
        if (image && image.readyState === 4) {
            return;
        }
        if (image && image['addEventListener']) {
            image['addEventListener']('load', this._loadListener);
        }
    }
    _removeImageLoad(image) {
        if (image && image['removeEventListener']) {
            image['removeEventListener']('load', this._loadListener);
        }
    }
    destroy() {
        this._removeImageLoad(this.image());
        super.destroy();
        return this;
    }
    _sceneFunc(graphics) {
        var _a, _b, _c, _d, _e, _f, _g;
        const width = this.getWidth();
        const height = this.getHeight();
        const cornerRadius = this.cornerRadius();
        const image = this.attrs.image;
        let params;
        const sprite = PIXI.Sprite.from(image);
        this._object = sprite;
        if (image) {
            const cropWidth = this.attrs.cropWidth;
            const cropHeight = this.attrs.cropHeight;
            if (cropWidth && cropHeight) {
                params = [
                    image,
                    this.cropX(),
                    this.cropY(),
                    cropWidth,
                    cropHeight,
                    0,
                    0,
                    width,
                    height,
                ];
            }
            else {
                params = [image, 0, 0, width, height];
            }
        }
        sprite.x = (_a = params[1]) !== null && _a !== void 0 ? _a : 0;
        sprite.y = (_b = params[2]) !== null && _b !== void 0 ? _b : 0;
        sprite.width = (_c = params[3]) !== null && _c !== void 0 ? _c : sprite.texture.width;
        sprite.height = (_d = params[4]) !== null && _d !== void 0 ? _d : sprite.texture.height;
        graphics.x = sprite.x;
        graphics.y = sprite.y;
        if (this.hasFill() || this.hasStroke() || cornerRadius) {
            cornerRadius
                ? Util.drawRoundedRectPath(graphics, width, height, cornerRadius)
                : graphics.rect(0, 0, width, height);
            graphics.fill((_e = this.fill()) !== null && _e !== void 0 ? _e : 0xffffff)
                .setStrokeStyle({
                width: (_f = this.strokeWidth()) !== null && _f !== void 0 ? _f : 0,
                color: (_g = this.stroke()) !== null && _g !== void 0 ? _g : 0x000000
            });
        }
        sprite.mask = graphics;
        // If you need to draw later, you need to execute save/restore
    }
    getWidth() {
        var _a, _b;
        return (_a = this.attrs.width) !== null && _a !== void 0 ? _a : (_b = this.image()) === null || _b === void 0 ? void 0 : _b.width;
    }
    getHeight() {
        var _a, _b;
        return (_a = this.attrs.height) !== null && _a !== void 0 ? _a : (_b = this.image()) === null || _b === void 0 ? void 0 : _b.height;
    }
    /**
     * load image from given url and create `Konva.Image` instance
     * @method
     * @memberof Konva.Image
     * @param {String} url image source
     * @param {Function} callback with Konva.Image instance as first argument
     * @param {Function} onError optional error handler
     * @example
     *  Konva.Image.fromURL(imageURL, function(image){
     *    // image is Konva.Image instance
     *    layer.add(image);
     *  });
     */
    static fromURL(url, callback, onError = null) {
        const img = Util.createImageElement();
        img.onload = function () {
            const image = new Image({
                image: img,
            });
            callback(image);
        };
        img.onerror = onError;
        img.crossOrigin = 'Anonymous';
        img.src = url;
    }
}
Image.prototype.className = 'Image';
_registerNode(Image);
/**
 * get/set corner radius
 * @method
 * @name Konva.Image#cornerRadius
 * @param {Number} cornerRadius
 * @returns {Number}
 * @example
 * // get corner radius
 * var cornerRadius = image.cornerRadius();
 *
 * // set corner radius
 * image.cornerRadius(10);
 *
 * // set different corner radius values
 * // top-left, top-right, bottom-right, bottom-left
 * image.cornerRadius([0, 10, 20, 30]);
 */
Factory.addGetterSetter(Image, 'cornerRadius', 0, getNumberOrArrayOfNumbersValidator(4));
/**
 * get/set image source. It can be image, canvas or video element
 * @name Konva.Image#image
 * @method
 * @param {Object} image source
 * @returns {Object}
 * @example
 * // get value
 * var image = shape.image();
 *
 * // set value
 * shape.image(img);
 */
Factory.addGetterSetter(Image, 'image');
Factory.addComponentsGetterSetter(Image, 'crop', ['x', 'y', 'width', 'height']);
/**
 * get/set crop
 * @method
 * @name Konva.Image#crop
 * @param {Object} crop
 * @param {Number} crop.x
 * @param {Number} crop.y
 * @param {Number} crop.width
 * @param {Number} crop.height
 * @returns {Object}
 * @example
 * // get crop
 * var crop = image.crop();
 *
 * // set crop
 * image.crop({
 *   x: 20,
 *   y: 20,
 *   width: 20,
 *   height: 20
 * });
 */
Factory.addGetterSetter(Image, 'cropX', 0, getNumberValidator());
/**
 * get/set crop x
 * @method
 * @name Konva.Image#cropX
 * @param {Number} x
 * @returns {Number}
 * @example
 * // get crop x
 * var cropX = image.cropX();
 *
 * // set crop x
 * image.cropX(20);
 */
Factory.addGetterSetter(Image, 'cropY', 0, getNumberValidator());
/**
 * get/set crop y
 * @name Konva.Image#cropY
 * @method
 * @param {Number} y
 * @returns {Number}
 * @example
 * // get crop y
 * var cropY = image.cropY();
 *
 * // set crop y
 * image.cropY(20);
 */
Factory.addGetterSetter(Image, 'cropWidth', 0, getNumberValidator());
/**
 * get/set crop width
 * @name Konva.Image#cropWidth
 * @method
 * @param {Number} width
 * @returns {Number}
 * @example
 * // get crop width
 * var cropWidth = image.cropWidth();
 *
 * // set crop width
 * image.cropWidth(20);
 */
Factory.addGetterSetter(Image, 'cropHeight', 0, getNumberValidator());
/**
 * get/set crop height
 * @name Konva.Image#cropHeight
 * @method
 * @param {Number} height
 * @returns {Number}
 * @example
 * // get crop height
 * var cropHeight = image.cropHeight();
 *
 * // set crop height
 * image.cropHeight(20);
 */

function getControlPoints(x0, y0, x1, y1, x2, y2, t) {
    const d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)), d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)), fa = (t * d01) / (d01 + d12), fb = (t * d12) / (d01 + d12), p1x = x1 - fa * (x2 - x0), p1y = y1 - fa * (y2 - y0), p2x = x1 + fb * (x2 - x0), p2y = y1 + fb * (y2 - y0);
    return [p1x, p1y, p2x, p2y];
}
function expandPoints(p, tension) {
    const len = p.length, allPoints = [];
    for (let n = 2; n < len - 2; n += 2) {
        const cp = getControlPoints(p[n - 2], p[n - 1], p[n], p[n + 1], p[n + 2], p[n + 3], tension);
        if (isNaN(cp[0])) {
            continue;
        }
        allPoints.push(cp[0]);
        allPoints.push(cp[1]);
        allPoints.push(p[n]);
        allPoints.push(p[n + 1]);
        allPoints.push(cp[2]);
        allPoints.push(cp[3]);
    }
    return allPoints;
}
/**
 * Line constructor.&nbsp; Lines are defined by an array of points and
 *  a tension
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {Array} config.points Flat array of points coordinates. You should define them as [x1, y1, x2, y2, x3, y3].
 * @param {Number} [config.tension] Higher values will result in a more curvy line.  A value of 0 will result in no interpolation.
 *   The default is 0
 * @param {Boolean} [config.closed] defines whether or not the line shape is closed, creating a polygon or blob
 * @param {Boolean} [config.bezier] if no tension is provided but bezier=true, we draw the line as a bezier using the passed points
 * @@shapeParams
 * @@nodeParams
 * @example
 * var line = new Konva.Line({
 *   x: 100,
 *   y: 50,
 *   points: [73, 70, 340, 23, 450, 60, 500, 20],
 *   stroke: 'red',
 *   tension: 1
 * });
 */
class Line extends Shape {
    constructor(config) {
        var _a, _b, _c, _d, _e;
        super(config);
        const graphics = new PIXI.Graphics();
        this._object = graphics;
        const points = this.points(), length = points.length, tension = this.tension(), closed = this.closed(), bezier = this.bezier();
        if (!length) {
            return;
        }
        let n = 0;
        graphics.beginPath();
        graphics.moveTo(points[0], points[1]);
        // tension
        if (tension !== 0 && length > 4) {
            const tp = this.getTensionPoints();
            const len = tp.length;
            n = closed ? 0 : 4;
            if (!closed) {
                graphics.quadraticCurveTo(tp[0], tp[1], tp[2], tp[3]);
            }
            while (n < len - 2) {
                graphics.bezierCurveTo(tp[n++], tp[n++], tp[n++], tp[n++], tp[n++], tp[n++]);
            }
            if (!closed) {
                graphics.quadraticCurveTo(tp[len - 2], tp[len - 1], points[length - 2], points[length - 1]);
            }
        }
        else if (bezier) {
            // no tension but bezier
            n = 2;
            while (n < length) {
                graphics.bezierCurveTo(points[n++], points[n++], points[n++], points[n++], points[n++], points[n++]);
            }
        }
        else {
            // no tension
            for (n = 2; n < length; n += 2) {
                graphics.lineTo(points[n], points[n + 1]);
            }
        }
        // closed e.g. polygons and blobs
        if (closed) {
            graphics.closePath();
            graphics
                .fill((_a = this.fill()) !== null && _a !== void 0 ? _a : 0xffffff)
                .setStrokeStyle({
                width: (_b = this.strokeWidth()) !== null && _b !== void 0 ? _b : 0,
                color: (_c = this.stroke()) !== null && _c !== void 0 ? _c : 0x000000
            });
        }
        else {
            // open e.g. lines and splines
            graphics
                .setStrokeStyle({
                width: (_d = this.strokeWidth()) !== null && _d !== void 0 ? _d : 0,
                color: (_e = this.stroke()) !== null && _e !== void 0 ? _e : 0x000000
            });
        }
    }
    getTensionPoints() {
        return this._getCache('tensionPoints', this._getTensionPoints);
    }
    _getTensionPoints() {
        if (this.closed()) {
            return this._getTensionPointsClosed();
        }
        else {
            return expandPoints(this.points(), this.tension());
        }
    }
    _getTensionPointsClosed() {
        const p = this.points(), len = p.length, tension = this.tension(), firstControlPoints = getControlPoints(p[len - 2], p[len - 1], p[0], p[1], p[2], p[3], tension), lastControlPoints = getControlPoints(p[len - 4], p[len - 3], p[len - 2], p[len - 1], p[0], p[1], tension), middle = expandPoints(p, tension), tp = [firstControlPoints[2], firstControlPoints[3]]
            .concat(middle)
            .concat([
            lastControlPoints[0],
            lastControlPoints[1],
            p[len - 2],
            p[len - 1],
            lastControlPoints[2],
            lastControlPoints[3],
            firstControlPoints[0],
            firstControlPoints[1],
            p[0],
            p[1],
        ]);
        return tp;
    }
    getWidth() {
        return this.getSelfRect().width;
    }
    getHeight() {
        return this.getSelfRect().height;
    }
    // overload size detection
    getSelfRect() {
        let points = this.points();
        if (points.length < 4) {
            return {
                x: points[0] || 0,
                y: points[1] || 0,
                width: 0,
                height: 0,
            };
        }
        if (this.tension() !== 0) {
            points = [
                points[0],
                points[1],
                ...this._getTensionPoints(),
                points[points.length - 2],
                points[points.length - 1],
            ];
        }
        else {
            points = this.points();
        }
        let minX = points[0];
        let maxX = points[0];
        let minY = points[1];
        let maxY = points[1];
        let x, y;
        for (let i = 0; i < points.length / 2; i++) {
            x = points[i * 2];
            y = points[i * 2 + 1];
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
    }
}
Line.prototype.className = 'Line';
Line.prototype._attrsAffectingSize = ['points', 'bezier', 'tension'];
_registerNode(Line);
// add getters setters
Factory.addGetterSetter(Line, 'closed', false);
/**
 * get/set closed flag.  The default is false
 * @name Konva.Line#closed
 * @method
 * @param {Boolean} closed
 * @returns {Boolean}
 * @example
 * // get closed flag
 * var closed = line.closed();
 *
 * // close the shape
 * line.closed(true);
 *
 * // open the shape
 * line.closed(false);
 */
Factory.addGetterSetter(Line, 'bezier', false);
/**
 * get/set bezier flag.  The default is false
 * @name Konva.Line#bezier
 * @method
 * @param {Boolean} bezier
 * @returns {Boolean}
 * @example
 * // get whether the line is a bezier
 * var isBezier = line.bezier();
 *
 * // set whether the line is a bezier
 * line.bezier(true);
 */
Factory.addGetterSetter(Line, 'tension', 0, getNumberValidator());
/**
 * get/set tension
 * @name Konva.Line#tension
 * @method
 * @param {Number} tension Higher values will result in a more curvy line.  A value of 0 will result in no interpolation. The default is 0
 * @returns {Number}
 * @example
 * // get tension
 * var tension = line.tension();
 *
 * // set tension
 * line.tension(3);
 */
Factory.addGetterSetter(Line, 'points', [], getNumberArrayValidator());
/**
 * get/set points array. Points is a flat array [x1, y1, x2, y2]. It is flat for performance reasons.
 * @name Konva.Line#points
 * @method
 * @param {Array} points
 * @returns {Array}
 * @example
 * // get points
 * var points = line.points();
 *
 * // set points
 * line.points([10, 20, 30, 40, 50, 60]);
 *
 * // push a new point
 * line.points(line.points().concat([70, 80]));
 */

// Credits: rveciana/svg-path-properties
// Legendre-Gauss abscissae (xi values, defined at i=n as the roots of the nth order Legendre polynomial Pn(x))
const tValues = [
    [],
    [],
    [
        -0.5773502691896257,
        0.5773502691896257645091487805019574556476,
    ],
    [
        0, -0.7745966692414834,
        0.7745966692414833770358530799564799221665,
    ],
    [
        -0.33998104358485626,
        0.3399810435848562648026657591032446872005,
        -0.8611363115940526,
        0.8611363115940525752239464888928095050957,
    ],
    [
        0, -0.5384693101056831,
        0.5384693101056830910363144207002088049672,
        -0.906179845938664,
        0.9061798459386639927976268782993929651256,
    ],
    [
        0.6612093864662645136613995950199053470064,
        -0.6612093864662645,
        -0.2386191860831969,
        0.2386191860831969086305017216807119354186,
        -0.932469514203152,
        0.9324695142031520278123015544939946091347,
    ],
    [
        0, 0.4058451513773971669066064120769614633473,
        -0.4058451513773972,
        -0.7415311855993945,
        0.7415311855993944398638647732807884070741,
        -0.9491079123427585,
        0.9491079123427585245261896840478512624007,
    ],
    [
        -0.1834346424956498,
        0.1834346424956498049394761423601839806667,
        -0.525532409916329,
        0.5255324099163289858177390491892463490419,
        -0.7966664774136267,
        0.7966664774136267395915539364758304368371,
        -0.9602898564975363,
        0.9602898564975362316835608685694729904282,
    ],
    [
        0, -0.8360311073266358,
        0.8360311073266357942994297880697348765441,
        -0.9681602395076261,
        0.9681602395076260898355762029036728700494,
        -0.3242534234038089,
        0.3242534234038089290385380146433366085719,
        -0.6133714327005904,
        0.6133714327005903973087020393414741847857,
    ],
    [
        -0.14887433898163122,
        0.1488743389816312108848260011297199846175,
        -0.4333953941292472,
        0.4333953941292471907992659431657841622,
        -0.6794095682990244,
        0.6794095682990244062343273651148735757692,
        -0.8650633666889845,
        0.8650633666889845107320966884234930485275,
        -0.9739065285171717,
        0.9739065285171717200779640120844520534282,
    ],
    [
        0, -0.26954315595234496,
        0.2695431559523449723315319854008615246796,
        -0.5190961292068118,
        0.5190961292068118159257256694586095544802,
        -0.7301520055740494,
        0.7301520055740493240934162520311534580496,
        -0.8870625997680953,
        0.8870625997680952990751577693039272666316,
        -0.978228658146057,
        0.9782286581460569928039380011228573907714,
    ],
    [
        -0.1252334085114689,
        0.1252334085114689154724413694638531299833,
        -0.3678314989981802,
        0.3678314989981801937526915366437175612563,
        -0.5873179542866175,
        0.587317954286617447296702418940534280369,
        -0.7699026741943047,
        0.7699026741943046870368938332128180759849,
        -0.9041172563704749,
        0.9041172563704748566784658661190961925375,
        -0.9815606342467192,
        0.9815606342467192506905490901492808229601,
    ],
    [
        0, -0.2304583159551348,
        0.2304583159551347940655281210979888352115,
        -0.44849275103644687,
        0.4484927510364468528779128521276398678019,
        -0.6423493394403402,
        0.6423493394403402206439846069955156500716,
        -0.8015780907333099,
        0.8015780907333099127942064895828598903056,
        -0.9175983992229779,
        0.9175983992229779652065478365007195123904,
        -0.9841830547185881,
        0.9841830547185881494728294488071096110649,
    ],
    [
        -0.10805494870734367,
        0.1080549487073436620662446502198347476119,
        -0.31911236892788974,
        0.3191123689278897604356718241684754668342,
        -0.5152486363581541,
        0.5152486363581540919652907185511886623088,
        -0.6872929048116855,
        0.6872929048116854701480198030193341375384,
        -0.827201315069765,
        0.8272013150697649931897947426503949610397,
        -0.9284348836635735,
        0.928434883663573517336391139377874264477,
        -0.9862838086968123,
        0.986283808696812338841597266704052801676,
    ],
    [
        0, -0.20119409399743451,
        0.2011940939974345223006283033945962078128,
        -0.3941513470775634,
        0.3941513470775633698972073709810454683627,
        -0.5709721726085388,
        0.5709721726085388475372267372539106412383,
        -0.7244177313601701,
        0.7244177313601700474161860546139380096308,
        -0.8482065834104272,
        0.8482065834104272162006483207742168513662,
        -0.937273392400706,
        0.9372733924007059043077589477102094712439,
        -0.9879925180204854,
        0.9879925180204854284895657185866125811469,
    ],
    [
        -0.09501250983763744,
        0.0950125098376374401853193354249580631303,
        -0.2816035507792589,
        0.281603550779258913230460501460496106486,
        -0.45801677765722737,
        0.45801677765722738634241944298357757354,
        -0.6178762444026438,
        0.6178762444026437484466717640487910189918,
        -0.755404408355003,
        0.7554044083550030338951011948474422683538,
        -0.8656312023878318,
        0.8656312023878317438804678977123931323873,
        -0.9445750230732326,
        0.9445750230732325760779884155346083450911,
        -0.9894009349916499,
        0.9894009349916499325961541734503326274262,
    ],
    [
        0, -0.17848418149584785,
        0.1784841814958478558506774936540655574754,
        -0.3512317634538763,
        0.3512317634538763152971855170953460050405,
        -0.5126905370864769,
        0.5126905370864769678862465686295518745829,
        -0.6576711592166907,
        0.6576711592166907658503022166430023351478,
        -0.7815140038968014,
        0.7815140038968014069252300555204760502239,
        -0.8802391537269859,
        0.8802391537269859021229556944881556926234,
        -0.9506755217687678,
        0.9506755217687677612227169578958030214433,
        -0.9905754753144174,
        0.9905754753144173356754340199406652765077,
    ],
    [
        -0.0847750130417353,
        0.0847750130417353012422618529357838117333,
        -0.2518862256915055,
        0.2518862256915055095889728548779112301628,
        -0.41175116146284263,
        0.4117511614628426460359317938330516370789,
        -0.5597708310739475,
        0.5597708310739475346078715485253291369276,
        -0.6916870430603532,
        0.6916870430603532078748910812888483894522,
        -0.8037049589725231,
        0.8037049589725231156824174550145907971032,
        -0.8926024664975557,
        0.8926024664975557392060605911271455154078,
        -0.9558239495713977,
        0.9558239495713977551811958929297763099728,
        -0.9915651684209309,
        0.9915651684209309467300160047061507702525,
    ],
    [
        0, -0.16035864564022537,
        0.1603586456402253758680961157407435495048,
        -0.31656409996362983,
        0.3165640999636298319901173288498449178922,
        -0.46457074137596094,
        0.4645707413759609457172671481041023679762,
        -0.600545304661681,
        0.6005453046616810234696381649462392798683,
        -0.7209661773352294,
        0.7209661773352293786170958608237816296571,
        -0.8227146565371428,
        0.8227146565371428249789224867127139017745,
        -0.9031559036148179,
        0.9031559036148179016426609285323124878093,
        -0.96020815213483,
        0.960208152134830030852778840687651526615,
        -0.9924068438435844,
        0.9924068438435844031890176702532604935893,
    ],
    [
        -0.07652652113349734,
        0.0765265211334973337546404093988382110047,
        -0.22778585114164507,
        0.227785851141645078080496195368574624743,
        -0.37370608871541955,
        0.3737060887154195606725481770249272373957,
        -0.5108670019508271,
        0.5108670019508270980043640509552509984254,
        -0.636053680726515,
        0.6360536807265150254528366962262859367433,
        -0.7463319064601508,
        0.7463319064601507926143050703556415903107,
        -0.8391169718222188,
        0.8391169718222188233945290617015206853296,
        -0.912234428251326,
        0.9122344282513259058677524412032981130491,
        -0.9639719272779138,
        0.963971927277913791267666131197277221912,
        -0.9931285991850949,
        0.9931285991850949247861223884713202782226,
    ],
    [
        0, -0.1455618541608951,
        0.1455618541608950909370309823386863301163,
        -0.2880213168024011,
        0.288021316802401096600792516064600319909,
        -0.4243421202074388,
        0.4243421202074387835736688885437880520964,
        -0.5516188358872198,
        0.551618835887219807059018796724313286622,
        -0.6671388041974123,
        0.667138804197412319305966669990339162597,
        -0.7684399634756779,
        0.7684399634756779086158778513062280348209,
        -0.8533633645833173,
        0.8533633645833172836472506385875676702761,
        -0.9200993341504008,
        0.9200993341504008287901871337149688941591,
        -0.9672268385663063,
        0.9672268385663062943166222149076951614246,
        -0.9937521706203895,
        0.9937521706203895002602420359379409291933,
    ],
    [
        -0.06973927331972223,
        0.0697392733197222212138417961186280818222,
        -0.20786042668822127,
        0.2078604266882212854788465339195457342156,
        -0.34193582089208424,
        0.3419358208920842251581474204273796195591,
        -0.469355837986757,
        0.4693558379867570264063307109664063460953,
        -0.5876404035069116,
        0.5876404035069115929588769276386473488776,
        -0.6944872631866827,
        0.6944872631866827800506898357622567712673,
        -0.7878168059792081,
        0.7878168059792081620042779554083515213881,
        -0.8658125777203002,
        0.8658125777203001365364256370193787290847,
        -0.926956772187174,
        0.9269567721871740005206929392590531966353,
        -0.9700604978354287,
        0.9700604978354287271239509867652687108059,
        -0.9942945854823992,
        0.994294585482399292073031421161298980393,
    ],
    [
        0, -0.1332568242984661,
        0.1332568242984661109317426822417661370104,
        -0.26413568097034495,
        0.264135680970344930533869538283309602979,
        -0.3903010380302908,
        0.390301038030290831421488872880605458578,
        -0.5095014778460075,
        0.5095014778460075496897930478668464305448,
        -0.6196098757636461,
        0.6196098757636461563850973116495956533871,
        -0.7186613631319502,
        0.7186613631319501944616244837486188483299,
        -0.8048884016188399,
        0.8048884016188398921511184069967785579414,
        -0.8767523582704416,
        0.8767523582704416673781568859341456716389,
        -0.9329710868260161,
        0.9329710868260161023491969890384229782357,
        -0.9725424712181152,
        0.9725424712181152319560240768207773751816,
        -0.9947693349975522,
        0.9947693349975521235239257154455743605736,
    ],
    [
        -0.06405689286260563,
        0.0640568928626056260850430826247450385909,
        -0.1911188674736163,
        0.1911188674736163091586398207570696318404,
        -0.3150426796961634,
        0.3150426796961633743867932913198102407864,
        -0.4337935076260451,
        0.4337935076260451384870842319133497124524,
        -0.5454214713888396,
        0.5454214713888395356583756172183723700107,
        -0.6480936519369755,
        0.6480936519369755692524957869107476266696,
        -0.7401241915785544,
        0.7401241915785543642438281030999784255232,
        -0.820001985973903,
        0.8200019859739029219539498726697452080761,
        -0.8864155270044011,
        0.8864155270044010342131543419821967550873,
        -0.9382745520027328,
        0.9382745520027327585236490017087214496548,
        -0.9747285559713095,
        0.9747285559713094981983919930081690617411,
        -0.9951872199970213,
        0.9951872199970213601799974097007368118745,
    ],
];
// Legendre-Gauss weights (wi values, defined by a function linked to in the Bezier primer article)
const cValues = [
    [],
    [],
    [1.0, 1.0],
    [
        0.8888888888888888888888888888888888888888,
        0.5555555555555555555555555555555555555555,
        0.5555555555555555555555555555555555555555,
    ],
    [
        0.6521451548625461426269360507780005927646,
        0.6521451548625461426269360507780005927646,
        0.3478548451374538573730639492219994072353,
        0.3478548451374538573730639492219994072353,
    ],
    [
        0.5688888888888888888888888888888888888888,
        0.4786286704993664680412915148356381929122,
        0.4786286704993664680412915148356381929122,
        0.2369268850561890875142640407199173626432,
        0.2369268850561890875142640407199173626432,
    ],
    [
        0.3607615730481386075698335138377161116615,
        0.3607615730481386075698335138377161116615,
        0.4679139345726910473898703439895509948116,
        0.4679139345726910473898703439895509948116,
        0.1713244923791703450402961421727328935268,
        0.1713244923791703450402961421727328935268,
    ],
    [
        0.4179591836734693877551020408163265306122,
        0.3818300505051189449503697754889751338783,
        0.3818300505051189449503697754889751338783,
        0.2797053914892766679014677714237795824869,
        0.2797053914892766679014677714237795824869,
        0.1294849661688696932706114326790820183285,
        0.1294849661688696932706114326790820183285,
    ],
    [
        0.3626837833783619829651504492771956121941,
        0.3626837833783619829651504492771956121941,
        0.3137066458778872873379622019866013132603,
        0.3137066458778872873379622019866013132603,
        0.2223810344533744705443559944262408844301,
        0.2223810344533744705443559944262408844301,
        0.1012285362903762591525313543099621901153,
        0.1012285362903762591525313543099621901153,
    ],
    [
        0.3302393550012597631645250692869740488788,
        0.1806481606948574040584720312429128095143,
        0.1806481606948574040584720312429128095143,
        0.0812743883615744119718921581105236506756,
        0.0812743883615744119718921581105236506756,
        0.3123470770400028400686304065844436655987,
        0.3123470770400028400686304065844436655987,
        0.2606106964029354623187428694186328497718,
        0.2606106964029354623187428694186328497718,
    ],
    [
        0.295524224714752870173892994651338329421,
        0.295524224714752870173892994651338329421,
        0.2692667193099963550912269215694693528597,
        0.2692667193099963550912269215694693528597,
        0.2190863625159820439955349342281631924587,
        0.2190863625159820439955349342281631924587,
        0.1494513491505805931457763396576973324025,
        0.1494513491505805931457763396576973324025,
        0.0666713443086881375935688098933317928578,
        0.0666713443086881375935688098933317928578,
    ],
    [
        0.272925086777900630714483528336342189156,
        0.2628045445102466621806888698905091953727,
        0.2628045445102466621806888698905091953727,
        0.2331937645919904799185237048431751394317,
        0.2331937645919904799185237048431751394317,
        0.1862902109277342514260976414316558916912,
        0.1862902109277342514260976414316558916912,
        0.1255803694649046246346942992239401001976,
        0.1255803694649046246346942992239401001976,
        0.0556685671161736664827537204425485787285,
        0.0556685671161736664827537204425485787285,
    ],
    [
        0.2491470458134027850005624360429512108304,
        0.2491470458134027850005624360429512108304,
        0.2334925365383548087608498989248780562594,
        0.2334925365383548087608498989248780562594,
        0.2031674267230659217490644558097983765065,
        0.2031674267230659217490644558097983765065,
        0.160078328543346226334652529543359071872,
        0.160078328543346226334652529543359071872,
        0.1069393259953184309602547181939962242145,
        0.1069393259953184309602547181939962242145,
        0.047175336386511827194615961485017060317,
        0.047175336386511827194615961485017060317,
    ],
    [
        0.2325515532308739101945895152688359481566,
        0.2262831802628972384120901860397766184347,
        0.2262831802628972384120901860397766184347,
        0.2078160475368885023125232193060527633865,
        0.2078160475368885023125232193060527633865,
        0.1781459807619457382800466919960979955128,
        0.1781459807619457382800466919960979955128,
        0.1388735102197872384636017768688714676218,
        0.1388735102197872384636017768688714676218,
        0.0921214998377284479144217759537971209236,
        0.0921214998377284479144217759537971209236,
        0.0404840047653158795200215922009860600419,
        0.0404840047653158795200215922009860600419,
    ],
    [
        0.2152638534631577901958764433162600352749,
        0.2152638534631577901958764433162600352749,
        0.2051984637212956039659240656612180557103,
        0.2051984637212956039659240656612180557103,
        0.1855383974779378137417165901251570362489,
        0.1855383974779378137417165901251570362489,
        0.1572031671581935345696019386238421566056,
        0.1572031671581935345696019386238421566056,
        0.1215185706879031846894148090724766259566,
        0.1215185706879031846894148090724766259566,
        0.0801580871597602098056332770628543095836,
        0.0801580871597602098056332770628543095836,
        0.0351194603317518630318328761381917806197,
        0.0351194603317518630318328761381917806197,
    ],
    [
        0.2025782419255612728806201999675193148386,
        0.1984314853271115764561183264438393248186,
        0.1984314853271115764561183264438393248186,
        0.1861610000155622110268005618664228245062,
        0.1861610000155622110268005618664228245062,
        0.1662692058169939335532008604812088111309,
        0.1662692058169939335532008604812088111309,
        0.1395706779261543144478047945110283225208,
        0.1395706779261543144478047945110283225208,
        0.1071592204671719350118695466858693034155,
        0.1071592204671719350118695466858693034155,
        0.0703660474881081247092674164506673384667,
        0.0703660474881081247092674164506673384667,
        0.0307532419961172683546283935772044177217,
        0.0307532419961172683546283935772044177217,
    ],
    [
        0.1894506104550684962853967232082831051469,
        0.1894506104550684962853967232082831051469,
        0.1826034150449235888667636679692199393835,
        0.1826034150449235888667636679692199393835,
        0.1691565193950025381893120790303599622116,
        0.1691565193950025381893120790303599622116,
        0.1495959888165767320815017305474785489704,
        0.1495959888165767320815017305474785489704,
        0.1246289712555338720524762821920164201448,
        0.1246289712555338720524762821920164201448,
        0.0951585116824927848099251076022462263552,
        0.0951585116824927848099251076022462263552,
        0.0622535239386478928628438369943776942749,
        0.0622535239386478928628438369943776942749,
        0.0271524594117540948517805724560181035122,
        0.0271524594117540948517805724560181035122,
    ],
    [
        0.1794464703562065254582656442618856214487,
        0.1765627053669926463252709901131972391509,
        0.1765627053669926463252709901131972391509,
        0.1680041021564500445099706637883231550211,
        0.1680041021564500445099706637883231550211,
        0.1540457610768102880814315948019586119404,
        0.1540457610768102880814315948019586119404,
        0.1351363684685254732863199817023501973721,
        0.1351363684685254732863199817023501973721,
        0.1118838471934039710947883856263559267358,
        0.1118838471934039710947883856263559267358,
        0.0850361483171791808835353701910620738504,
        0.0850361483171791808835353701910620738504,
        0.0554595293739872011294401653582446605128,
        0.0554595293739872011294401653582446605128,
        0.0241483028685479319601100262875653246916,
        0.0241483028685479319601100262875653246916,
    ],
    [
        0.1691423829631435918406564701349866103341,
        0.1691423829631435918406564701349866103341,
        0.1642764837458327229860537764659275904123,
        0.1642764837458327229860537764659275904123,
        0.1546846751262652449254180038363747721932,
        0.1546846751262652449254180038363747721932,
        0.1406429146706506512047313037519472280955,
        0.1406429146706506512047313037519472280955,
        0.1225552067114784601845191268002015552281,
        0.1225552067114784601845191268002015552281,
        0.1009420441062871655628139849248346070628,
        0.1009420441062871655628139849248346070628,
        0.0764257302548890565291296776166365256053,
        0.0764257302548890565291296776166365256053,
        0.0497145488949697964533349462026386416808,
        0.0497145488949697964533349462026386416808,
        0.0216160135264833103133427102664524693876,
        0.0216160135264833103133427102664524693876,
    ],
    [
        0.1610544498487836959791636253209167350399,
        0.1589688433939543476499564394650472016787,
        0.1589688433939543476499564394650472016787,
        0.152766042065859666778855400897662998461,
        0.152766042065859666778855400897662998461,
        0.1426067021736066117757461094419029724756,
        0.1426067021736066117757461094419029724756,
        0.1287539625393362276755157848568771170558,
        0.1287539625393362276755157848568771170558,
        0.1115666455473339947160239016817659974813,
        0.1115666455473339947160239016817659974813,
        0.0914900216224499994644620941238396526609,
        0.0914900216224499994644620941238396526609,
        0.0690445427376412265807082580060130449618,
        0.0690445427376412265807082580060130449618,
        0.0448142267656996003328381574019942119517,
        0.0448142267656996003328381574019942119517,
        0.0194617882297264770363120414644384357529,
        0.0194617882297264770363120414644384357529,
    ],
    [
        0.1527533871307258506980843319550975934919,
        0.1527533871307258506980843319550975934919,
        0.1491729864726037467878287370019694366926,
        0.1491729864726037467878287370019694366926,
        0.1420961093183820513292983250671649330345,
        0.1420961093183820513292983250671649330345,
        0.1316886384491766268984944997481631349161,
        0.1316886384491766268984944997481631349161,
        0.118194531961518417312377377711382287005,
        0.118194531961518417312377377711382287005,
        0.1019301198172404350367501354803498761666,
        0.1019301198172404350367501354803498761666,
        0.0832767415767047487247581432220462061001,
        0.0832767415767047487247581432220462061001,
        0.0626720483341090635695065351870416063516,
        0.0626720483341090635695065351870416063516,
        0.040601429800386941331039952274932109879,
        0.040601429800386941331039952274932109879,
        0.0176140071391521183118619623518528163621,
        0.0176140071391521183118619623518528163621,
    ],
    [
        0.1460811336496904271919851476833711882448,
        0.1445244039899700590638271665537525436099,
        0.1445244039899700590638271665537525436099,
        0.1398873947910731547221334238675831108927,
        0.1398873947910731547221334238675831108927,
        0.132268938633337461781052574496775604329,
        0.132268938633337461781052574496775604329,
        0.1218314160537285341953671771257335983563,
        0.1218314160537285341953671771257335983563,
        0.1087972991671483776634745780701056420336,
        0.1087972991671483776634745780701056420336,
        0.0934444234560338615532897411139320884835,
        0.0934444234560338615532897411139320884835,
        0.0761001136283793020170516533001831792261,
        0.0761001136283793020170516533001831792261,
        0.0571344254268572082836358264724479574912,
        0.0571344254268572082836358264724479574912,
        0.0369537897708524937999506682993296661889,
        0.0369537897708524937999506682993296661889,
        0.0160172282577743333242246168584710152658,
        0.0160172282577743333242246168584710152658,
    ],
    [
        0.1392518728556319933754102483418099578739,
        0.1392518728556319933754102483418099578739,
        0.1365414983460151713525738312315173965863,
        0.1365414983460151713525738312315173965863,
        0.1311735047870623707329649925303074458757,
        0.1311735047870623707329649925303074458757,
        0.1232523768105124242855609861548144719594,
        0.1232523768105124242855609861548144719594,
        0.1129322960805392183934006074217843191142,
        0.1129322960805392183934006074217843191142,
        0.1004141444428809649320788378305362823508,
        0.1004141444428809649320788378305362823508,
        0.0859416062170677274144436813727028661891,
        0.0859416062170677274144436813727028661891,
        0.0697964684245204880949614189302176573987,
        0.0697964684245204880949614189302176573987,
        0.0522933351526832859403120512732112561121,
        0.0522933351526832859403120512732112561121,
        0.0337749015848141547933022468659129013491,
        0.0337749015848141547933022468659129013491,
        0.0146279952982722006849910980471854451902,
        0.0146279952982722006849910980471854451902,
    ],
    [
        0.1336545721861061753514571105458443385831,
        0.132462039404696617371642464703316925805,
        0.132462039404696617371642464703316925805,
        0.1289057221880821499785953393997936532597,
        0.1289057221880821499785953393997936532597,
        0.1230490843067295304675784006720096548158,
        0.1230490843067295304675784006720096548158,
        0.1149966402224113649416435129339613014914,
        0.1149966402224113649416435129339613014914,
        0.1048920914645414100740861850147438548584,
        0.1048920914645414100740861850147438548584,
        0.0929157660600351474770186173697646486034,
        0.0929157660600351474770186173697646486034,
        0.0792814117767189549228925247420432269137,
        0.0792814117767189549228925247420432269137,
        0.0642324214085258521271696151589109980391,
        0.0642324214085258521271696151589109980391,
        0.0480376717310846685716410716320339965612,
        0.0480376717310846685716410716320339965612,
        0.0309880058569794443106942196418845053837,
        0.0309880058569794443106942196418845053837,
        0.0134118594871417720813094934586150649766,
        0.0134118594871417720813094934586150649766,
    ],
    [
        0.1279381953467521569740561652246953718517,
        0.1279381953467521569740561652246953718517,
        0.1258374563468282961213753825111836887264,
        0.1258374563468282961213753825111836887264,
        0.121670472927803391204463153476262425607,
        0.121670472927803391204463153476262425607,
        0.1155056680537256013533444839067835598622,
        0.1155056680537256013533444839067835598622,
        0.1074442701159656347825773424466062227946,
        0.1074442701159656347825773424466062227946,
        0.0976186521041138882698806644642471544279,
        0.0976186521041138882698806644642471544279,
        0.086190161531953275917185202983742667185,
        0.086190161531953275917185202983742667185,
        0.0733464814110803057340336152531165181193,
        0.0733464814110803057340336152531165181193,
        0.0592985849154367807463677585001085845412,
        0.0592985849154367807463677585001085845412,
        0.0442774388174198061686027482113382288593,
        0.0442774388174198061686027482113382288593,
        0.0285313886289336631813078159518782864491,
        0.0285313886289336631813078159518782864491,
        0.0123412297999871995468056670700372915759,
        0.0123412297999871995468056670700372915759,
    ],
];
// LUT for binomial coefficient arrays per curve order 'n'
const binomialCoefficients = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]];
const getCubicArcLength = (xs, ys, t) => {
    let sum;
    let correctedT;
    /*if (xs.length >= tValues.length) {
          throw new Error('too high n bezier');
        }*/
    const n = 20;
    const z = t / 2;
    sum = 0;
    for (let i = 0; i < n; i++) {
        correctedT = z * tValues[n][i] + z;
        sum += cValues[n][i] * BFunc(xs, ys, correctedT);
    }
    return z * sum;
};
const getQuadraticArcLength = (xs, ys, t) => {
    if (t === undefined) {
        t = 1;
    }
    const ax = xs[0] - 2 * xs[1] + xs[2];
    const ay = ys[0] - 2 * ys[1] + ys[2];
    const bx = 2 * xs[1] - 2 * xs[0];
    const by = 2 * ys[1] - 2 * ys[0];
    const A = 4 * (ax * ax + ay * ay);
    const B = 4 * (ax * bx + ay * by);
    const C = bx * bx + by * by;
    if (A === 0) {
        return (t * Math.sqrt(Math.pow(xs[2] - xs[0], 2) + Math.pow(ys[2] - ys[0], 2)));
    }
    const b = B / (2 * A);
    const c = C / A;
    const u = t + b;
    const k = c - b * b;
    const uuk = u * u + k > 0 ? Math.sqrt(u * u + k) : 0;
    const bbk = b * b + k > 0 ? Math.sqrt(b * b + k) : 0;
    const term = b + Math.sqrt(b * b + k) !== 0
        ? k * Math.log(Math.abs((u + uuk) / (b + bbk)))
        : 0;
    return (Math.sqrt(A) / 2) * (u * uuk - b * bbk + term);
};
function BFunc(xs, ys, t) {
    const xbase = getDerivative(1, t, xs);
    const ybase = getDerivative(1, t, ys);
    const combined = xbase * xbase + ybase * ybase;
    return Math.sqrt(combined);
}
/**
 * Compute the curve derivative (hodograph) at t.
 */
const getDerivative = (derivative, t, vs) => {
    // the derivative of any 't'-less function is zero.
    const n = vs.length - 1;
    let _vs;
    let value;
    if (n === 0) {
        return 0;
    }
    // direct values? compute!
    if (derivative === 0) {
        value = 0;
        for (let k = 0; k <= n; k++) {
            value +=
                binomialCoefficients[n][k] *
                    Math.pow(1 - t, n - k) *
                    Math.pow(t, k) *
                    vs[k];
        }
        return value;
    }
    else {
        // Still some derivative? go down one order, then try
        // for the lower order curve's.
        _vs = new Array(n);
        for (let k = 0; k < n; k++) {
            _vs[k] = n * (vs[k + 1] - vs[k]);
        }
        return getDerivative(derivative - 1, t, _vs);
    }
};
const t2length = (length, totalLength, func) => {
    let error = 1;
    let t = length / totalLength;
    let step = (length - func(t)) / totalLength;
    let numIterations = 0;
    while (error > 0.001) {
        const increasedTLength = func(t + step);
        const increasedTError = Math.abs(length - increasedTLength) / totalLength;
        if (increasedTError < error) {
            error = increasedTError;
            t += step;
        }
        else {
            const decreasedTLength = func(t - step);
            const decreasedTError = Math.abs(length - decreasedTLength) / totalLength;
            if (decreasedTError < error) {
                error = decreasedTError;
                t -= step;
            }
            else {
                step /= 2;
            }
        }
        numIterations++;
        if (numIterations > 500) {
            break;
        }
    }
    return t;
};

/**
 * Path constructor.
 * @author Jason Follas
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {String} config.data SVG data string
 * @@shapeParams
 * @@nodeParams
 * @example
 * var path = new Konva.Path({
 *   x: 240,
 *   y: 40,
 *   data: 'M12.582,9.551C3.251,16.237,0.921,29.021,7.08,38.564l-2.36,1.689l4.893,2.262l4.893,2.262l-0.568-5.36l-0.567-5.359l-2.365,1.694c-4.657-7.375-2.83-17.185,4.352-22.33c7.451-5.338,17.817-3.625,23.156,3.824c5.337,7.449,3.625,17.813-3.821,23.152l2.857,3.988c9.617-6.893,11.827-20.277,4.935-29.896C35.591,4.87,22.204,2.658,12.582,9.551z',
 *   fill: 'green',
 *   scaleX: 2,
 *   scaleY: 2
 * });
 */
class Path extends Shape {
    constructor(config) {
        var _a, _b, _c, _d, _e;
        super(config);
        this.dataArray = [];
        this.pathLength = 0;
        this._readDataAttribute();
        this.on('dataChange.konva', function () {
            this._readDataAttribute();
        });
        const ca = this.dataArray;
        const graphics = new PIXI.Graphics();
        this._object = graphics;
        // context position
        graphics.beginPath();
        let isClosed = false;
        for (let n = 0; n < ca.length; n++) {
            const c = ca[n].command;
            const p = ca[n].points;
            switch (c) {
                case 'L':
                    graphics.lineTo(p[0], p[1]);
                    break;
                case 'M':
                    graphics.moveTo(p[0], p[1]);
                    break;
                case 'C':
                    graphics.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                    break;
                case 'Q':
                    graphics.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                    break;
                case 'A':
                    const cx = p[0], cy = p[1], rx = p[2], ry = p[3], theta = p[4], dTheta = p[5], psi = p[6], fs = p[7];
                    const r = rx > ry ? rx : ry;
                    const scaleX = rx > ry ? 1 : rx / ry;
                    const scaleY = rx > ry ? ry / rx : 1;
                    graphics.position.set(graphics.position.x + cx, graphics.position.y + cy);
                    graphics.rotation = psi;
                    graphics.scale.set(scaleX, scaleY);
                    graphics.arc(0, 0, r, theta, theta + dTheta, fs === 0);
                    graphics.scale.set(1 / scaleX, 1 / scaleY);
                    graphics.rotation = 0;
                    graphics.position.set(graphics.position.x - cx, graphics.position.y - cy);
                    graphics.position.set(0, 0);
                    break;
                case 'z':
                    isClosed = true;
                    graphics.closePath();
                    break;
            }
        }
        if (!isClosed && !this.hasFill()) {
            graphics
                .fill((_a = this.fill()) !== null && _a !== void 0 ? _a : 0xffffff)
                .setStrokeStyle({
                width: (_b = this.strokeWidth()) !== null && _b !== void 0 ? _b : 0,
                color: (_c = this.stroke()) !== null && _c !== void 0 ? _c : 0x000000
            });
        }
        else {
            graphics
                .setStrokeStyle({
                width: (_d = this.strokeWidth()) !== null && _d !== void 0 ? _d : 0,
                color: (_e = this.stroke()) !== null && _e !== void 0 ? _e : 0x000000
            });
        }
    }
    _readDataAttribute() {
        this.dataArray = Path.parsePathData(this.data());
        this.pathLength = Path.getPathLength(this.dataArray);
    }
    getSelfRect() {
        let points = [];
        this.dataArray.forEach(function (data) {
            if (data.command === 'A') {
                // Approximates by breaking curve into line segments
                const start = data.points[4];
                // 4 = theta
                const dTheta = data.points[5];
                // 5 = dTheta
                const end = data.points[4] + dTheta;
                let inc = Math.PI / 180.0;
                // 1 degree resolution
                if (Math.abs(start - end) < inc) {
                    inc = Math.abs(start - end);
                }
                if (dTheta < 0) {
                    // clockwise
                    for (let t = start - inc; t > end; t -= inc) {
                        const point = Path.getPointOnEllipticalArc(data.points[0], data.points[1], data.points[2], data.points[3], t, 0);
                        points.push(point.x, point.y);
                    }
                }
                else {
                    // counter-clockwise
                    for (let t = start + inc; t < end; t += inc) {
                        const point = Path.getPointOnEllipticalArc(data.points[0], data.points[1], data.points[2], data.points[3], t, 0);
                        points.push(point.x, point.y);
                    }
                }
            }
            else if (data.command === 'C') {
                // Approximates by breaking curve into 100 line segments
                for (let t = 0.0; t <= 1; t += 0.01) {
                    const point = Path.getPointOnCubicBezier(t, data.start.x, data.start.y, data.points[0], data.points[1], data.points[2], data.points[3], data.points[4], data.points[5]);
                    points.push(point.x, point.y);
                }
            }
            else {
                // TODO: how can we calculate bezier curves better?
                points = points.concat(data.points);
            }
        });
        let minX = points[0];
        let maxX = points[0];
        let minY = points[1];
        let maxY = points[1];
        let x, y;
        for (let i = 0; i < points.length / 2; i++) {
            x = points[i * 2];
            y = points[i * 2 + 1];
            // skip bad values
            if (!isNaN(x)) {
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
            }
            if (!isNaN(y)) {
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            }
        }
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
    }
    /**
     * Return length of the path.
     * @method
     * @name Konva.Path#getLength
     * @returns {Number} length
     * @example
     * var length = path.getLength();
     */
    getLength() {
        return this.pathLength;
    }
    /**
     * Get point on path at specific length of the path
     * @method
     * @name Konva.Path#getPointAtLength
     * @param {Number} length length
     * @returns {Object} point {x,y} point
     * @example
     * var point = path.getPointAtLength(10);
     */
    getPointAtLength(length) {
        return Path.getPointAtLengthOfDataArray(length, this.dataArray);
    }
    static getLineLength(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
    static getPathLength(dataArray) {
        let pathLength = 0;
        for (let i = 0; i < dataArray.length; ++i) {
            pathLength += dataArray[i].pathLength;
        }
        return pathLength;
    }
    static getPointAtLengthOfDataArray(length, dataArray) {
        let points, i = 0, ii = dataArray.length;
        if (!ii) {
            return null;
        }
        while (i < ii && length > dataArray[i].pathLength) {
            length -= dataArray[i].pathLength;
            ++i;
        }
        if (i === ii) {
            points = dataArray[i - 1].points.slice(-2);
            return {
                x: points[0],
                y: points[1],
            };
        }
        if (length < 0.01) {
            const cmd = dataArray[i].command;
            if (cmd === 'M') {
                points = dataArray[i].points.slice(0, 2);
                return {
                    x: points[0],
                    y: points[1],
                };
            }
            else {
                return {
                    x: dataArray[i].start.x,
                    y: dataArray[i].start.y,
                };
            }
        }
        const cp = dataArray[i];
        const p = cp.points;
        switch (cp.command) {
            case 'L':
                return Path.getPointOnLine(length, cp.start.x, cp.start.y, p[0], p[1]);
            case 'C':
                return Path.getPointOnCubicBezier(t2length(length, Path.getPathLength(dataArray), (i) => {
                    return getCubicArcLength([cp.start.x, p[0], p[2], p[4]], [cp.start.y, p[1], p[3], p[5]], i);
                }), cp.start.x, cp.start.y, p[0], p[1], p[2], p[3], p[4], p[5]);
            case 'Q':
                return Path.getPointOnQuadraticBezier(t2length(length, Path.getPathLength(dataArray), (i) => {
                    return getQuadraticArcLength([cp.start.x, p[0], p[2]], [cp.start.y, p[1], p[3]], i);
                }), cp.start.x, cp.start.y, p[0], p[1], p[2], p[3]);
            case 'A':
                const cx = p[0], cy = p[1], rx = p[2], ry = p[3], dTheta = p[5], psi = p[6];
                let theta = p[4];
                theta += (dTheta * length) / cp.pathLength;
                return Path.getPointOnEllipticalArc(cx, cy, rx, ry, theta, psi);
        }
        return null;
    }
    static getPointOnLine(dist, P1x, P1y, P2x, P2y, fromX, fromY) {
        fromX = fromX !== null && fromX !== void 0 ? fromX : P1x;
        fromY = fromY !== null && fromY !== void 0 ? fromY : P1y;
        const len = this.getLineLength(P1x, P1y, P2x, P2y);
        if (len < 1e-10) {
            return { x: P1x, y: P1y };
        }
        if (P2x === P1x) {
            // Vertical line
            return { x: fromX, y: fromY + (P2y > P1y ? dist : -dist) };
        }
        const m = (P2y - P1y) / (P2x - P1x);
        const run = Math.sqrt((dist * dist) / (1 + m * m)) * (P2x < P1x ? -1 : 1);
        const rise = m * run;
        if (Math.abs(fromY - P1y - m * (fromX - P1x)) < 1e-10) {
            return { x: fromX + run, y: fromY + rise };
        }
        const u = ((fromX - P1x) * (P2x - P1x) + (fromY - P1y) * (P2y - P1y)) / (len * len);
        const ix = P1x + u * (P2x - P1x);
        const iy = P1y + u * (P2y - P1y);
        const pRise = this.getLineLength(fromX, fromY, ix, iy);
        const pRun = Math.sqrt(dist * dist - pRise * pRise);
        const adjustedRun = Math.sqrt((pRun * pRun) / (1 + m * m)) * (P2x < P1x ? -1 : 1);
        const adjustedRise = m * adjustedRun;
        return { x: ix + adjustedRun, y: iy + adjustedRise };
    }
    static getPointOnCubicBezier(pct, P1x, P1y, P2x, P2y, P3x, P3y, P4x, P4y) {
        function CB1(t) {
            return t * t * t;
        }
        function CB2(t) {
            return 3 * t * t * (1 - t);
        }
        function CB3(t) {
            return 3 * t * (1 - t) * (1 - t);
        }
        function CB4(t) {
            return (1 - t) * (1 - t) * (1 - t);
        }
        const x = P4x * CB1(pct) + P3x * CB2(pct) + P2x * CB3(pct) + P1x * CB4(pct);
        const y = P4y * CB1(pct) + P3y * CB2(pct) + P2y * CB3(pct) + P1y * CB4(pct);
        return { x, y };
    }
    static getPointOnQuadraticBezier(pct, P1x, P1y, P2x, P2y, P3x, P3y) {
        function QB1(t) {
            return t * t;
        }
        function QB2(t) {
            return 2 * t * (1 - t);
        }
        function QB3(t) {
            return (1 - t) * (1 - t);
        }
        const x = P3x * QB1(pct) + P2x * QB2(pct) + P1x * QB3(pct);
        const y = P3y * QB1(pct) + P2y * QB2(pct) + P1y * QB3(pct);
        return { x, y };
    }
    static getPointOnEllipticalArc(cx, cy, rx, ry, theta, psi) {
        const cosPsi = Math.cos(psi), sinPsi = Math.sin(psi);
        const pt = {
            x: rx * Math.cos(theta),
            y: ry * Math.sin(theta),
        };
        return {
            x: cx + (pt.x * cosPsi - pt.y * sinPsi),
            y: cy + (pt.x * sinPsi + pt.y * cosPsi),
        };
    }
    /*
     * get parsed data array from the data
     *  string.  V, v, H, h, and l data are converted to
     *  L data for the purpose of high performance Path
     *  rendering
     */
    static parsePathData(data) {
        // Path Data Segment must begin with a moveTo
        //m (x y)+  Relative moveTo (subsequent points are treated as lineTo)
        //M (x y)+  Absolute moveTo (subsequent points are treated as lineTo)
        //l (x y)+  Relative lineTo
        //L (x y)+  Absolute LineTo
        //h (x)+    Relative horizontal lineTo
        //H (x)+    Absolute horizontal lineTo
        //v (y)+    Relative vertical lineTo
        //V (y)+    Absolute vertical lineTo
        //z (closepath)
        //Z (closepath)
        //c (x1 y1 x2 y2 x y)+ Relative Bezier curve
        //C (x1 y1 x2 y2 x y)+ Absolute Bezier curve
        //q (x1 y1 x y)+       Relative Quadratic Bezier
        //Q (x1 y1 x y)+       Absolute Quadratic Bezier
        //t (x y)+    Shorthand/Smooth Relative Quadratic Bezier
        //T (x y)+    Shorthand/Smooth Absolute Quadratic Bezier
        //s (x2 y2 x y)+       Shorthand/Smooth Relative Bezier curve
        //S (x2 y2 x y)+       Shorthand/Smooth Absolute Bezier curve
        //a (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+     Relative Elliptical Arc
        //A (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+  Absolute Elliptical Arc
        // return early if data is not defined
        if (!data) {
            return [];
        }
        // command string
        let cs = data;
        // command chars
        const cc = [
            'm',
            'M',
            'l',
            'L',
            'v',
            'V',
            'h',
            'H',
            'z',
            'Z',
            'c',
            'C',
            'q',
            'Q',
            't',
            'T',
            's',
            'S',
            'a',
            'A',
        ];
        // convert white spaces to commas
        cs = cs.replace(new RegExp(' ', 'g'), ',');
        // create pipes so that we can split the data
        for (let n = 0; n < cc.length; n++) {
            cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
        }
        // create array
        const arr = cs.split('|');
        const ca = [];
        const coords = [];
        // init context point
        let cpx = 0;
        let cpy = 0;
        const re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi;
        let match;
        for (let n = 1; n < arr.length; n++) {
            let str = arr[n];
            let c = str.charAt(0);
            str = str.slice(1);
            coords.length = 0;
            while ((match = re.exec(str))) {
                coords.push(match[0]);
            }
            // while ((match = re.exec(str))) {
            //   coords.push(match[0]);
            // }
            const p = [];
            for (let j = 0, jlen = coords.length; j < jlen; j++) {
                // extra case for merged flags
                if (coords[j] === '00') {
                    p.push(0, 0);
                    continue;
                }
                const parsed = parseFloat(coords[j]);
                if (!isNaN(parsed)) {
                    p.push(parsed);
                }
                else {
                    p.push(0);
                }
            }
            while (p.length > 0) {
                if (isNaN(p[0])) {
                    // case for a trailing comma before next command
                    break;
                }
                let cmd = '';
                let points = [];
                const startX = cpx, startY = cpy;
                // Move var from within the switch to up here (jshint)
                let prevCmd, ctlPtx, ctlPty; // Ss, Tt
                let rx, ry, psi, fa, fs, x1, y1; // Aa
                // convert l, H, h, V, and v to L
                switch (c) {
                    // Note: Keep the lineTo's above the moveTo's in this switch
                    case 'l':
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'L':
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    // Note: lineTo handlers need to be above this point
                    case 'm':
                        const dx = p.shift();
                        const dy = p.shift();
                        cpx += dx;
                        cpy += dy;
                        cmd = 'M';
                        // After closing the path move the current position
                        // to the the first point of the path (if any).
                        if (ca.length > 2 && ca[ca.length - 1].command === 'z') {
                            for (let idx = ca.length - 2; idx >= 0; idx--) {
                                if (ca[idx].command === 'M') {
                                    cpx = ca[idx].points[0] + dx;
                                    cpy = ca[idx].points[1] + dy;
                                    break;
                                }
                            }
                        }
                        points.push(cpx, cpy);
                        c = 'l';
                        // subsequent points are treated as relative lineTo
                        break;
                    case 'M':
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'M';
                        points.push(cpx, cpy);
                        c = 'L';
                        // subsequent points are treated as absolute lineTo
                        break;
                    case 'h':
                        cpx += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'H':
                        cpx = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'v':
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'V':
                        cpy = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'C':
                        points.push(p.shift(), p.shift(), p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'c':
                        points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'S':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 's':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'Q':
                        points.push(p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'q':
                        points.push(cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(cpx, cpy);
                        break;
                    case 'T':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 't':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 'A':
                        rx = p.shift();
                        ry = p.shift();
                        psi = p.shift();
                        fa = p.shift();
                        fs = p.shift();
                        x1 = cpx;
                        y1 = cpy;
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'A';
                        points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                    case 'a':
                        rx = p.shift();
                        ry = p.shift();
                        psi = p.shift();
                        fa = p.shift();
                        fs = p.shift();
                        x1 = cpx;
                        y1 = cpy;
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'A';
                        points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                }
                ca.push({
                    command: cmd || c,
                    points: points,
                    start: {
                        x: startX,
                        y: startY,
                    },
                    pathLength: this.calcLength(startX, startY, cmd || c, points),
                });
            }
            if (c === 'z' || c === 'Z') {
                ca.push({
                    command: 'z',
                    points: [],
                    start: undefined,
                    pathLength: 0,
                });
            }
        }
        return ca;
    }
    static calcLength(x, y, cmd, points) {
        let len, p1, p2, t;
        const path = Path;
        switch (cmd) {
            case 'L':
                return path.getLineLength(x, y, points[0], points[1]);
            case 'C':
                return getCubicArcLength([x, points[0], points[2], points[4]], [y, points[1], points[3], points[5]], 1);
            case 'Q':
                return getQuadraticArcLength([x, points[0], points[2]], [y, points[1], points[3]], 1);
            case 'A':
                // Approximates by breaking curve into line segments
                len = 0.0;
                const start = points[4];
                // 4 = theta
                const dTheta = points[5];
                // 5 = dTheta
                const end = points[4] + dTheta;
                let inc = Math.PI / 180.0;
                // 1 degree resolution
                if (Math.abs(start - end) < inc) {
                    inc = Math.abs(start - end);
                }
                // Note: for purpose of calculating arc length, not going to worry about rotating X-axis by angle psi
                p1 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);
                if (dTheta < 0) {
                    // clockwise
                    for (t = start - inc; t > end; t -= inc) {
                        p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                        len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                        p1 = p2;
                    }
                }
                else {
                    // counter-clockwise
                    for (t = start + inc; t < end; t += inc) {
                        p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                        len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                        p1 = p2;
                    }
                }
                p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
                len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                return len;
        }
        return 0;
    }
    static convertEndpointToCenterParameterization(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
        // Derived from: http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
        const psi = psiDeg * (Math.PI / 180.0);
        const xp = (Math.cos(psi) * (x1 - x2)) / 2.0 + (Math.sin(psi) * (y1 - y2)) / 2.0;
        const yp = (-1 * Math.sin(psi) * (x1 - x2)) / 2.0 +
            (Math.cos(psi) * (y1 - y2)) / 2.0;
        const lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
        if (lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }
        let f = Math.sqrt((rx * rx * (ry * ry) - rx * rx * (yp * yp) - ry * ry * (xp * xp)) /
            (rx * rx * (yp * yp) + ry * ry * (xp * xp)));
        if (fa === fs) {
            f *= -1;
        }
        if (isNaN(f)) {
            f = 0;
        }
        const cxp = (f * rx * yp) / ry;
        const cyp = (f * -ry * xp) / rx;
        const cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
        const cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;
        const vMag = function (v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        };
        const vRatio = function (u, v) {
            return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
        };
        const vAngle = function (u, v) {
            return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
        };
        const theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
        const u = [(xp - cxp) / rx, (yp - cyp) / ry];
        const v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
        let dTheta = vAngle(u, v);
        if (vRatio(u, v) <= -1) {
            dTheta = Math.PI;
        }
        if (vRatio(u, v) >= 1) {
            dTheta = 0;
        }
        if (fs === 0 && dTheta > 0) {
            dTheta = dTheta - 2 * Math.PI;
        }
        if (fs === 1 && dTheta < 0) {
            dTheta = dTheta + 2 * Math.PI;
        }
        return [cx, cy, rx, ry, theta, dTheta, psi, fs];
    }
}
Path.prototype.className = 'Path';
Path.prototype._attrsAffectingSize = ['data'];
_registerNode(Path);
/**
 * get/set SVG path data string.  This method
 *  also automatically parses the data string
 *  into a data array.  Currently supported SVG data:
 *  M, m, L, l, H, h, V, v, Q, q, T, t, C, c, S, s, A, a, Z, z
 * @name Konva.Path#data
 * @method
 * @param {String} data svg path string
 * @returns {String}
 * @example
 * // get data
 * var data = path.data();
 *
 * // set data
 * path.data('M200,100h100v50z');
 */
Factory.addGetterSetter(Path, 'data');

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
class Rect extends Shape {
    constructor(config) {
        var _a, _b, _c;
        super(config);
        const graphics = new PIXI.Graphics();
        const cornerRadius = this.cornerRadius(), width = this.width(), height = this.height();
        graphics.beginPath();
        if (!cornerRadius) {
            graphics
                .fill((_a = this.fill()) !== null && _a !== void 0 ? _a : 0xffffff)
                .setStrokeStyle({
                width: (_b = this.strokeWidth()) !== null && _b !== void 0 ? _b : 0,
                color: (_c = this.stroke()) !== null && _c !== void 0 ? _c : 0x000000
            })
                .rect(0, 0, width, height);
        }
        else {
            Util.drawRoundedRectPath(graphics, width, height, cornerRadius);
        }
        const texture = stages[0].application.renderer.generateTexture(graphics);
        this._object = new PIXI.NineSlicePlane(texture, 0, 0, 0, 0);
    }
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
Factory.addGetterSetter(Rect, 'cornerRadius', 0, getNumberOrArrayOfNumbersValidator(4));

/**
 * RegularPolygon constructor. Examples include triangles, squares, pentagons, hexagons, etc.
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {Number} [config.cornerRadius]
 * @param {Number} config.sides
 * @param {Number} config.radius
 * @@shapeParams
 * @@nodeParams
 * @example
 * var hexagon = new Konva.RegularPolygon({
 *   x: 100,
 *   y: 200,
 *   sides: 6,
 *   radius: 70,
 *   fill: 'red',
 *   stroke: 'black',
 *   strokeWidth: 4
 * });
 */
class RegularPolygon extends Shape {
    constructor(config) {
        var _a, _b, _c;
        super(config);
        const graphics = new PIXI.Graphics();
        this._object = graphics;
        const points = this._getPoints(), radius = this.radius(), sides = this.sides(), cornerRadius = this.cornerRadius();
        graphics.beginPath();
        if (!cornerRadius) {
            graphics.moveTo(points[0].x, points[0].y);
            for (let n = 1; n < points.length; n++) {
                graphics.lineTo(points[n].x, points[n].y);
            }
        }
        else {
            Util.drawRoundedPolygonPath(graphics, points, sides, radius, cornerRadius);
        }
        graphics
            .closePath()
            .fill((_a = this.fill()) !== null && _a !== void 0 ? _a : 0xffffff)
            .setStrokeStyle({
            width: (_b = this.strokeWidth()) !== null && _b !== void 0 ? _b : 0,
            color: (_c = this.stroke()) !== null && _c !== void 0 ? _c : 0x000000
        });
    }
    _getPoints() {
        const sides = this.attrs.sides;
        const radius = this.attrs.radius || 0;
        const points = [];
        for (let n = 0; n < sides; n++) {
            points.push({
                x: radius * Math.sin((n * 2 * Math.PI) / sides),
                y: -1 * radius * Math.cos((n * 2 * Math.PI) / sides),
            });
        }
        return points;
    }
    getSelfRect() {
        const points = this._getPoints();
        let minX = points[0].x;
        let maxX = points[0].y;
        let minY = points[0].x;
        let maxY = points[0].y;
        points.forEach((point) => {
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
        });
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
    }
    getWidth() {
        return this.radius() * 2;
    }
    getHeight() {
        return this.radius() * 2;
    }
    setWidth(width) {
        this.radius(width / 2);
    }
    setHeight(height) {
        this.radius(height / 2);
    }
}
RegularPolygon.prototype.className = 'RegularPolygon';
RegularPolygon.prototype._centroid = true;
RegularPolygon.prototype._attrsAffectingSize = ['radius'];
_registerNode(RegularPolygon);
/**
 * get/set radius
 * @method
 * @name Konva.RegularPolygon#radius
 * @param {Number} radius
 * @returns {Number}
 * @example
 * // get radius
 * var radius = shape.radius();
 *
 * // set radius
 * shape.radius(10);
 */
Factory.addGetterSetter(RegularPolygon, 'radius', 0, getNumberValidator());
/**
 * get/set sides
 * @method
 * @name Konva.RegularPolygon#sides
 * @param {Number} sides
 * @returns {Number}
 * @example
 * // get sides
 * var sides = shape.sides();
 *
 * // set sides
 * shape.sides(10);
 */
Factory.addGetterSetter(RegularPolygon, 'sides', 0, getNumberValidator());
/**
 * get/set corner radius
 * @method
 * @name Konva.RegularPolygon#cornerRadius
 * @param {Number} cornerRadius
 * @returns {Number}
 * @example
 * // get corner radius
 * var cornerRadius = poly.cornerRadius();
 *
 * // set corner radius
 * poly.cornerRadius(10);
 *
 * // set different corner radius values (pentagon)
 * poly.cornerRadius([0, 10, 20, 30, 40]);
 */
Factory.addGetterSetter(RegularPolygon, 'cornerRadius', 0, getNumberOrArrayOfNumbersValidator(4));

// constants
const AUTO = 'auto', 
INHERIT = 'inherit', LEFT = 'left', TEXT = 'text', TEXT_UPPER = 'Text', TOP = 'top', NORMAL = 'normal', PX_SPACE = 'px ', SPACE = ' ', WORD = 'word', NONE = 'none';
function normalizeFontFamily(fontFamily) {
    return fontFamily
        .split(',')
        .map((family) => {
        family = family.trim();
        const hasSpace = family.indexOf(' ') >= 0;
        const hasQuotes = family.indexOf('"') >= 0 || family.indexOf("'") >= 0;
        if (hasSpace && !hasQuotes) {
            family = `"${family}"`;
        }
        return family;
    })
        .join(', ');
}
function checkDefaultFill(config) {
    config = config || {};
    // set default color to black
    if (!config.fillLinearGradientColorStops &&
        !config.fillRadialGradientColorStops &&
        !config.fillPatternImage) {
        config.fill = config.fill || 'black';
    }
    return config;
}
/**
 * Text constructor
 * @constructor
 * @memberof Konva
 * @augments Konva.Shape
 * @param {Object} config
 * @param {String} [config.direction] default is inherit
 * @param {String} [config.fontFamily] default is Arial
 * @param {Number} [config.fontSize] in pixels.  Default is 12
 * @param {String} [config.fontStyle] can be 'normal', 'italic', or 'bold', '500' or even 'italic bold'.  'normal' is the default.
 * @param {String} [config.fontVariant] can be normal or small-caps.  Default is normal
 * @param {String} [config.textDecoration] can be line-through, underline or empty string. Default is empty string.
 * @param {String} config.text
 * @param {String} [config.align] can be left, center, right or justify
 * @param {String} [config.verticalAlign] can be top, middle or bottom
 * @param {Number} [config.padding]
 * @param {Number} [config.lineHeight] default is 1
 * @param {String} [config.wrap] can be "word", "char", or "none". Default is word
 * @param {Boolean} [config.ellipsis] can be true or false. Default is false. if Konva.Text config is set to wrap="none" and ellipsis=true, then it will add "..." to the end
 * @@shapeParams
 * @@nodeParams
 * @example
 * var text = new Konva.Text({
 *   x: 10,
 *   y: 15,
 *   text: 'Simple Text',
 *   fontSize: 30,
 *   fontFamily: 'Calibri',
 *   fill: 'green'
 * });
 */
class Text extends Shape {
    constructor(config) {
        super(checkDefaultFill(config));
        this._partialTextX = 0;
        this._partialTextY = 0;
        const textArr = this.textArr; textArr.length;
        if (!this.text()) {
            return;
        }
        this.padding(); let fontSize = this.fontSize(); this.lineHeight() * fontSize; let verticalAlign = this.verticalAlign(); this.direction(); let align = this.align(); this.getWidth(); let letterSpacing = this.letterSpacing(), fill = this.fill(), textDecoration = this.textDecoration(); textDecoration.indexOf('underline') !== -1; textDecoration.indexOf('line-through') !== -1;
        const text = new PIXI.Text(this.text(), {
            fontFamily: "Arial",
            fontSize: fontSize,
            fontWeight: "bold",
            fill: fill !== null && fill !== void 0 ? fill : 0x000000,
            align: align,
            lineHeight: this.lineHeight(),
            letterSpacing: letterSpacing,
        });
        this._object = text;
        if (verticalAlign === "middle") {
            text.anchor.y = 0.5;
        }
        else if (verticalAlign === "bottom") {
            text.anchor.y = 1;
        }
        else {
            text.anchor.y = 0; // top (default)
        }
        // horizontal anchor for "padding/align"
        if (align === "center") {
            text.anchor.x = 0.5;
        }
        else if (align === "right") {
            text.anchor.x = 1;
        }
        else {
            text.anchor.x = 0; // left
        }
    }
    setText(text) {
        const str = Util._isString(text)
            ? text
            : text === null || text === undefined
                ? ''
                : text + '';
        this._setAttr(TEXT, str);
        return this;
    }
    getWidth() {
        const isAuto = this.attrs.width === AUTO || this.attrs.width === undefined;
        return isAuto ? this.getTextWidth() + this.padding() * 2 : this.attrs.width;
    }
    getHeight() {
        const isAuto = this.attrs.height === AUTO || this.attrs.height === undefined;
        return isAuto
            ? this.fontSize() * this.textArr.length * this.lineHeight() +
                this.padding() * 2
            : this.attrs.height;
    }
    /**
     * get pure text width without padding
     * @method
     * @name Konva.Text#getTextWidth
     * @returns {Number}
     */
    getTextWidth() {
        return this.textWidth;
    }
    getTextHeight() {
        Util.warn('text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height.');
        return this.textHeight;
    }
    _getContextFont() {
        return (this.fontStyle() +
            SPACE +
            this.fontVariant() +
            SPACE +
            (this.fontSize() + PX_SPACE) +
            // wrap font family into " so font families with spaces works ok
            normalizeFontFamily(this.fontFamily()));
    }
    /**
     * whether to handle ellipsis, there are two cases:
     * 1. the current line is the last line
     * 2. wrap is NONE
     * @param {Number} currentHeightPx
     * @returns {Boolean}
     */
    _shouldHandleEllipsis(currentHeightPx) {
        const fontSize = +this.fontSize(), lineHeightPx = this.lineHeight() * fontSize, height = this.attrs.height, fixedHeight = height !== AUTO && height !== undefined, padding = this.padding(), maxHeightPx = height - padding * 2, wrap = this.wrap(), shouldWrap = wrap !== NONE;
        return (!shouldWrap ||
            (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx));
    }
    // for text we can't disable stroke scaling
    // if we do, the result will be unexpected
    getStrokeScaleEnabled() {
        return true;
    }
}
Text.prototype.className = TEXT_UPPER;
Text.prototype._attrsAffectingSize = [
    'text',
    'fontSize',
    'padding',
    'wrap',
    'lineHeight',
    'letterSpacing',
];
_registerNode(Text);
/**
 * get/set width of text area, which includes padding.
 * @name Konva.Text#width
 * @method
 * @param {Number} width
 * @returns {Number}
 * @example
 * // get width
 * var width = text.width();
 *
 * // set width
 * text.width(20);
 *
 * // set to auto
 * text.width('auto');
 * text.width() // will return calculated width, and not "auto"
 */
Factory.overWriteSetter(Text, 'width', getNumberOrAutoValidator());
/**
 * get/set the height of the text area, which takes into account multi-line text, line heights, and padding.
 * @name Konva.Text#height
 * @method
 * @param {Number} height
 * @returns {Number}
 * @example
 * // get height
 * var height = text.height();
 *
 * // set height
 * text.height(20);
 *
 * // set to auto
 * text.height('auto');
 * text.height() // will return calculated height, and not "auto"
 */
Factory.overWriteSetter(Text, 'height', getNumberOrAutoValidator());
/**
 * get/set direction
 * @name Konva.Text#direction
 * @method
 * @param {String} direction
 * @returns {String}
 * @example
 * // get direction
 * var direction = text.direction();
 *
 * // set direction
 * text.direction('rtl');
 */
Factory.addGetterSetter(Text, 'direction', INHERIT);
/**
 * get/set font family
 * @name Konva.Text#fontFamily
 * @method
 * @param {String} fontFamily
 * @returns {String}
 * @example
 * // get font family
 * var fontFamily = text.fontFamily();
 *
 * // set font family
 * text.fontFamily('Arial');
 */
Factory.addGetterSetter(Text, 'fontFamily', 'Arial');
/**
 * get/set font size in pixels
 * @name Konva.Text#fontSize
 * @method
 * @param {Number} fontSize
 * @returns {Number}
 * @example
 * // get font size
 * var fontSize = text.fontSize();
 *
 * // set font size to 22px
 * text.fontSize(22);
 */
Factory.addGetterSetter(Text, 'fontSize', 12, getNumberValidator());
/**
 * get/set font style.  Can be 'normal', 'italic', or 'bold', '500' or even 'italic bold'.  'normal' is the default.
 * @name Konva.Text#fontStyle
 * @method
 * @param {String} fontStyle
 * @returns {String}
 * @example
 * // get font style
 * var fontStyle = text.fontStyle();
 *
 * // set font style
 * text.fontStyle('bold');
 */
Factory.addGetterSetter(Text, 'fontStyle', NORMAL);
/**
 * get/set font variant.  Can be 'normal' or 'small-caps'.  'normal' is the default.
 * @name Konva.Text#fontVariant
 * @method
 * @param {String} fontVariant
 * @returns {String}
 * @example
 * // get font variant
 * var fontVariant = text.fontVariant();
 *
 * // set font variant
 * text.fontVariant('small-caps');
 */
Factory.addGetterSetter(Text, 'fontVariant', NORMAL);
/**
 * get/set padding
 * @name Konva.Text#padding
 * @method
 * @param {Number} padding
 * @returns {Number}
 * @example
 * // get padding
 * var padding = text.padding();
 *
 * // set padding to 10 pixels
 * text.padding(10);
 */
Factory.addGetterSetter(Text, 'padding', 0, getNumberValidator());
/**
 * get/set horizontal align of text.  Can be 'left', 'center', 'right' or 'justify'
 * @name Konva.Text#align
 * @method
 * @param {String} align
 * @returns {String}
 * @example
 * // get text align
 * var align = text.align();
 *
 * // center text
 * text.align('center');
 *
 * // align text to right
 * text.align('right');
 *
 * // justify text
 */
Factory.addGetterSetter(Text, 'align', LEFT);
/**
 * get/set vertical align of text.  Can be 'top', 'middle', 'bottom'.
 * @name Konva.Text#verticalAlign
 * @method
 * @param {String} verticalAlign
 * @returns {String}
 * @example
 * // get text vertical align
 * var verticalAlign = text.verticalAlign();
 *
 * // center text
 * text.verticalAlign('middle');
 */
Factory.addGetterSetter(Text, 'verticalAlign', TOP);
/**
 * get/set line height.  The default is 1.
 * @name Konva.Text#lineHeight
 * @method
 * @param {Number} lineHeight
 * @returns {Number}
 * @example
 * // get line height
 * var lineHeight = text.lineHeight();
 *
 * // set the line height
 * text.lineHeight(2);
 */
Factory.addGetterSetter(Text, 'lineHeight', 1, getNumberValidator());
/**
 * get/set wrap.  Can be "word", "char", or "none". Default is "word".
 * In "word" wrapping any word still can be wrapped if it can't be placed in the required width
 * without breaks.
 * @name Konva.Text#wrap
 * @method
 * @param {String} wrap
 * @returns {String}
 * @example
 * // get wrap
 * var wrap = text.wrap();
 *
 * // set wrap
 * text.wrap('word');
 */
Factory.addGetterSetter(Text, 'wrap', WORD);
/**
 * get/set ellipsis. Can be true or false. Default is false. If ellipses is true,
 * Konva will add "..." at the end of the text if it doesn't have enough space to write characters.
 * That is possible only when you limit both width and height of the text
 * @name Konva.Text#ellipsis
 * @method
 * @param {Boolean} ellipsis
 * @returns {Boolean}
 * @example
 * // get ellipsis param, returns true or false
 * var ellipsis = text.ellipsis();
 *
 * // set ellipsis
 * text.ellipsis(true);
 */
Factory.addGetterSetter(Text, 'ellipsis', false, getBooleanValidator());
/**
 * set letter spacing property. Default value is 0.
 * @name Konva.Text#letterSpacing
 * @method
 * @param {Number} letterSpacing
 */
Factory.addGetterSetter(Text, 'letterSpacing', 0, getNumberValidator());
/**
 * get/set text
 * @name Konva.Text#text
 * @method
 * @param {String} text
 * @returns {String}
 * @example
 * // get text
 * var text = text.text();
 *
 * // set text
 * text.text('Hello world!');
 */
Factory.addGetterSetter(Text, 'text', '', getStringValidator());
/**
 * get/set text decoration of a text.  Possible values are 'underline', 'line-through' or combination of these values separated by space
 * @name Konva.Text#textDecoration
 * @method
 * @param {String} textDecoration
 * @returns {String}
 * @example
 * // get text decoration
 * var textDecoration = text.textDecoration();
 *
 * // underline text
 * text.textDecoration('underline');
 *
 * // strike text
 * text.textDecoration('line-through');
 *
 * // underline and strike text
 * text.textDecoration('underline line-through');
 */
Factory.addGetterSetter(Text, 'textDecoration', '');

/*
 the Gauss filter
 master repo: https://github.com/pavelpower/kineticjsGaussFilter
*/
/*

     StackBlur - a fast almost Gaussian Blur For Canvas

     Version:   0.5
     Author:    Mario Klingemann
     Contact:   mario@quasimondo.com
     Website:   http://www.quasimondo.com/StackBlurForCanvas
     Twitter:   @quasimondo

     In case you find this class useful - especially in commercial projects -
     I am not totally unhappy for a small donation to my PayPal account
     mario@quasimondo.de

     Or support me on flattr:
     https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

     Copyright (c) 2010 Mario Klingemann

     Permission is hereby granted, free of charge, to any person
     obtaining a copy of this software and associated documentation
     files (the "Software"), to deal in the Software without
     restriction, including without limitation the rights to use,
     copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the
     Software is furnished to do so, subject to the following
     conditions:

     The above copyright notice and this permission notice shall be
     included in all copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
     OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
     HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
     WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
     FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
     OTHER DEALINGS IN THE SOFTWARE.
     */
function BlurStack() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
}
const mul_table = [
    512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292,
    512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292,
    273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259,
    496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292,
    282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373,
    364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259,
    507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381,
    374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292,
    287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461,
    454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373,
    368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309,
    305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259,
    257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442,
    437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381,
    377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332,
    329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292,
    289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259,
];
const shg_table = [
    9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17,
    17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19,
    19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
    21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23,
    23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
    23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
    23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24,
];
function filterGaussBlurRGBA(imageData, radius) {
    const pixels = imageData.data, width = imageData.width, height = imageData.height;
    let p, yi, yw, r_sum, g_sum, b_sum, a_sum, r_out_sum, g_out_sum, b_out_sum, a_out_sum, r_in_sum, g_in_sum, b_in_sum, a_in_sum, pr, pg, pb, pa, rbs;
    const div = radius + radius + 1, widthMinus1 = width - 1, heightMinus1 = height - 1, radiusPlus1 = radius + 1, sumFactor = (radiusPlus1 * (radiusPlus1 + 1)) / 2, stackStart = new BlurStack(), mul_sum = mul_table[radius], shg_sum = shg_table[radius];
    let stackEnd = null, stack = stackStart, stackIn = null, stackOut = null;
    for (let i = 1; i < div; i++) {
        stack = stack.next = new BlurStack();
        if (i === radiusPlus1) {
            stackEnd = stack;
        }
    }
    stack.next = stackStart;
    yw = yi = 0;
    for (let y = 0; y < height; y++) {
        r_in_sum =
            g_in_sum =
                b_in_sum =
                    a_in_sum =
                        r_sum =
                            g_sum =
                                b_sum =
                                    a_sum =
                                        0;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
        a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;
        stack = stackStart;
        for (let i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }
        for (let i = 1; i < radiusPlus1; i++) {
            p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
            r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
            b_sum += (stack.b = pb = pixels[p + 2]) * rbs;
            a_sum += (stack.a = pa = pixels[p + 3]) * rbs;
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;
            stack = stack.next;
        }
        stackIn = stackStart;
        stackOut = stackEnd;
        for (let x = 0; x < width; x++) {
            pixels[yi + 3] = pa = (a_sum * mul_sum) >> shg_sum;
            if (pa !== 0) {
                pa = 255 / pa;
                pixels[yi] = ((r_sum * mul_sum) >> shg_sum) * pa;
                pixels[yi + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                pixels[yi + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
            }
            else {
                pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
            }
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;
            p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;
            r_in_sum += stackIn.r = pixels[p];
            g_in_sum += stackIn.g = pixels[p + 1];
            b_in_sum += stackIn.b = pixels[p + 2];
            a_in_sum += stackIn.a = pixels[p + 3];
            r_sum += r_in_sum;
            g_sum += g_in_sum;
            b_sum += b_in_sum;
            a_sum += a_in_sum;
            stackIn = stackIn.next;
            r_out_sum += pr = stackOut.r;
            g_out_sum += pg = stackOut.g;
            b_out_sum += pb = stackOut.b;
            a_out_sum += pa = stackOut.a;
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;
            stackOut = stackOut.next;
            yi += 4;
        }
        yw += width;
    }
    for (let x = 0; x < width; x++) {
        g_in_sum =
            b_in_sum =
                a_in_sum =
                    r_in_sum =
                        g_sum =
                            b_sum =
                                a_sum =
                                    r_sum =
                                        0;
        yi = x << 2;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
        a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;
        stack = stackStart;
        for (let i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }
        let yp = width;
        for (let i = 1; i <= radius; i++) {
            yi = (yp + x) << 2;
            r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
            b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;
            a_sum += (stack.a = pa = pixels[yi + 3]) * rbs;
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;
            stack = stack.next;
            if (i < heightMinus1) {
                yp += width;
            }
        }
        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for (let y = 0; y < height; y++) {
            p = yi << 2;
            pixels[p + 3] = pa = (a_sum * mul_sum) >> shg_sum;
            if (pa > 0) {
                pa = 255 / pa;
                pixels[p] = ((r_sum * mul_sum) >> shg_sum) * pa;
                pixels[p + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                pixels[p + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
            }
            else {
                pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
            }
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;
            p =
                (x +
                    ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width) <<
                    2;
            r_sum += r_in_sum += stackIn.r = pixels[p];
            g_sum += g_in_sum += stackIn.g = pixels[p + 1];
            b_sum += b_in_sum += stackIn.b = pixels[p + 2];
            a_sum += a_in_sum += stackIn.a = pixels[p + 3];
            stackIn = stackIn.next;
            r_out_sum += pr = stackOut.r;
            g_out_sum += pg = stackOut.g;
            b_out_sum += pb = stackOut.b;
            a_out_sum += pa = stackOut.a;
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;
            stackOut = stackOut.next;
            yi += width;
        }
    }
}
/**
 * Blur Filter
 * @function
 * @name Blur
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Blur]);
 * node.blurRadius(10);
 */
const Blur = function Blur(imageData) {
    const radius = Math.round(this.blurRadius());
    if (radius > 0) {
        filterGaussBlurRGBA(imageData, radius);
    }
};
Factory.addGetterSetter(Node, 'blurRadius', 0, getNumberValidator(), Factory.afterSetFilter);
/**
 * get/set blur radius. Use with {@link Konva.Filters.Blur} filter
 * @name Konva.Node#blurRadius
 * @method
 * @param {Integer} radius
 * @returns {Integer}
 */

/**
 * Brighten Filter.
 * @function
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Brighten]);
 * node.brightness(0.8);
 */
const Brighten = function (imageData) {
    const brightness = this.brightness() * 255, data = imageData.data, len = data.length;
    for (let i = 0; i < len; i += 4) {
        // red
        data[i] += brightness;
        // green
        data[i + 1] += brightness;
        // blue
        data[i + 2] += brightness;
    }
};
Factory.addGetterSetter(Node, 'brightness', 0, getNumberValidator(), Factory.afterSetFilter);
/**
 * get/set filter brightness.  The brightness is a number between -1 and 1.&nbsp; Positive values
 *  brighten the pixels and negative values darken them. Use with {@link Konva.Filters.Brighten} filter.
 * @name Konva.Node#brightness
 * @method

 * @param {Number} brightness value between -1 and 1
 * @returns {Number}
 */

/**
 * Contrast Filter.
 * @function
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Contrast]);
 * node.contrast(10);
 */
const Contrast = function (imageData) {
    const adjust = Math.pow((this.contrast() + 100) / 100, 2);
    const data = imageData.data, nPixels = data.length;
    let red = 150, green = 150, blue = 150;
    for (let i = 0; i < nPixels; i += 4) {
        red = data[i];
        green = data[i + 1];
        blue = data[i + 2];
        //Red channel
        red /= 255;
        red -= 0.5;
        red *= adjust;
        red += 0.5;
        red *= 255;
        //Green channel
        green /= 255;
        green -= 0.5;
        green *= adjust;
        green += 0.5;
        green *= 255;
        //Blue channel
        blue /= 255;
        blue -= 0.5;
        blue *= adjust;
        blue += 0.5;
        blue *= 255;
        red = red < 0 ? 0 : red > 255 ? 255 : red;
        green = green < 0 ? 0 : green > 255 ? 255 : green;
        blue = blue < 0 ? 0 : blue > 255 ? 255 : blue;
        data[i] = red;
        data[i + 1] = green;
        data[i + 2] = blue;
    }
};
/**
 * get/set filter contrast.  The contrast is a number between -100 and 100.
 * Use with {@link Konva.Filters.Contrast} filter.
 * @name Konva.Node#contrast
 * @method
 * @param {Number} contrast value between -100 and 100
 * @returns {Number}
 */
Factory.addGetterSetter(Node, 'contrast', 0, getNumberValidator(), Factory.afterSetFilter);

/**
 * Emboss Filter.
 * Pixastic Lib - Emboss filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 * @function
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Emboss]);
 * node.embossStrength(0.8);
 * node.embossWhiteLevel(0.3);
 * node.embossDirection('right');
 * node.embossBlend(true);
 */
const Emboss = function (imageData) {
    // pixastic strength is between 0 and 10.  I want it between 0 and 1
    // pixastic greyLevel is between 0 and 255.  I want it between 0 and 1.  Also,
    // a max value of greyLevel yields a white emboss, and the min value yields a black
    // emboss.  Therefore, I changed greyLevel to whiteLevel
    const strength = this.embossStrength() * 10, greyLevel = this.embossWhiteLevel() * 255, direction = this.embossDirection(), blend = this.embossBlend(), data = imageData.data, w = imageData.width, h = imageData.height, w4 = w * 4;
    let dirY = 0, dirX = 0, y = h;
    switch (direction) {
        case 'top-left':
            dirY = -1;
            dirX = -1;
            break;
        case 'top':
            dirY = -1;
            dirX = 0;
            break;
        case 'top-right':
            dirY = -1;
            dirX = 1;
            break;
        case 'right':
            dirY = 0;
            dirX = 1;
            break;
        case 'bottom-right':
            dirY = 1;
            dirX = 1;
            break;
        case 'bottom':
            dirY = 1;
            dirX = 0;
            break;
        case 'bottom-left':
            dirY = 1;
            dirX = -1;
            break;
        case 'left':
            dirY = 0;
            dirX = -1;
            break;
        default:
            Util.error('Unknown emboss direction: ' + direction);
    }
    do {
        const offsetY = (y - 1) * w4;
        let otherY = dirY;
        if (y + otherY < 1) {
            otherY = 0;
        }
        if (y + otherY > h) {
            otherY = 0;
        }
        const offsetYOther = (y - 1 + otherY) * w * 4;
        let x = w;
        do {
            const offset = offsetY + (x - 1) * 4;
            let otherX = dirX;
            if (x + otherX < 1) {
                otherX = 0;
            }
            if (x + otherX > w) {
                otherX = 0;
            }
            const offsetOther = offsetYOther + (x - 1 + otherX) * 4;
            const dR = data[offset] - data[offsetOther];
            const dG = data[offset + 1] - data[offsetOther + 1];
            const dB = data[offset + 2] - data[offsetOther + 2];
            let dif = dR;
            const absDif = dif > 0 ? dif : -dif;
            const absG = dG > 0 ? dG : -dG;
            const absB = dB > 0 ? dB : -dB;
            if (absG > absDif) {
                dif = dG;
            }
            if (absB > absDif) {
                dif = dB;
            }
            dif *= strength;
            if (blend) {
                const r = data[offset] + dif;
                const g = data[offset + 1] + dif;
                const b = data[offset + 2] + dif;
                data[offset] = r > 255 ? 255 : r < 0 ? 0 : r;
                data[offset + 1] = g > 255 ? 255 : g < 0 ? 0 : g;
                data[offset + 2] = b > 255 ? 255 : b < 0 ? 0 : b;
            }
            else {
                let grey = greyLevel - dif;
                if (grey < 0) {
                    grey = 0;
                }
                else if (grey > 255) {
                    grey = 255;
                }
                data[offset] = data[offset + 1] = data[offset + 2] = grey;
            }
        } while (--x);
    } while (--y);
};
Factory.addGetterSetter(Node, 'embossStrength', 0.5, getNumberValidator(), Factory.afterSetFilter);
/**
 * get/set emboss strength. Use with {@link Konva.Filters.Emboss} filter.
 * @name Konva.Node#embossStrength
 * @method
 * @param {Number} level between 0 and 1.  Default is 0.5
 * @returns {Number}
 */
Factory.addGetterSetter(Node, 'embossWhiteLevel', 0.5, getNumberValidator(), Factory.afterSetFilter);
/**
 * get/set emboss white level. Use with {@link Konva.Filters.Emboss} filter.
 * @name Konva.Node#embossWhiteLevel
 * @method
 * @param {Number} embossWhiteLevel between 0 and 1.  Default is 0.5
 * @returns {Number}
 */
Factory.addGetterSetter(Node, 'embossDirection', 'top-left', undefined, Factory.afterSetFilter);
/**
 * get/set emboss direction. Use with {@link Konva.Filters.Emboss} filter.
 * @name Konva.Node#embossDirection
 * @method
 * @param {String} embossDirection can be top-left, top, top-right, right, bottom-right, bottom, bottom-left or left
 *   The default is top-left
 * @returns {String}
 */
Factory.addGetterSetter(Node, 'embossBlend', false, undefined, Factory.afterSetFilter);
/**
 * get/set emboss blend. Use with {@link Konva.Filters.Emboss} filter.
 * @name Konva.Node#embossBlend
 * @method
 * @param {Boolean} embossBlend
 * @returns {Boolean}
 */

function remap(fromValue, fromMin, fromMax, toMin, toMax) {
    // Compute the range of the data
    const fromRange = fromMax - fromMin, toRange = toMax - toMin;
    // If either range is 0, then the value can only be mapped to 1 value
    if (fromRange === 0) {
        return toMin + toRange / 2;
    }
    if (toRange === 0) {
        return toMin;
    }
    // (1) untranslate, (2) unscale, (3) rescale, (4) retranslate
    let toValue = (fromValue - fromMin) / fromRange;
    toValue = toRange * toValue + toMin;
    return toValue;
}
/**
 * Enhance Filter. Adjusts the colors so that they span the widest
 *  possible range (ie 0-255). Performs w*h pixel reads and w*h pixel
 *  writes.
 * @function
 * @name Enhance
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @author ippo615
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Enhance]);
 * node.enhance(0.4);
 */
const Enhance = function (imageData) {
    const data = imageData.data, nSubPixels = data.length;
    let rMin = data[0], rMax = rMin, r, gMin = data[1], gMax = gMin, g, bMin = data[2], bMax = bMin, b;
    // If we are not enhancing anything - don't do any computation
    const enhanceAmount = this.enhance();
    if (enhanceAmount === 0) {
        return;
    }
    // 1st Pass - find the min and max for each channel:
    for (let i = 0; i < nSubPixels; i += 4) {
        r = data[i + 0];
        if (r < rMin) {
            rMin = r;
        }
        else if (r > rMax) {
            rMax = r;
        }
        g = data[i + 1];
        if (g < gMin) {
            gMin = g;
        }
        else if (g > gMax) {
            gMax = g;
        }
        b = data[i + 2];
        if (b < bMin) {
            bMin = b;
        }
        else if (b > bMax) {
            bMax = b;
        }
        //a = data[i + 3];
        //if (a < aMin) { aMin = a; } else
        //if (a > aMax) { aMax = a; }
    }
    // If there is only 1 level - don't remap
    if (rMax === rMin) {
        rMax = 255;
        rMin = 0;
    }
    if (gMax === gMin) {
        gMax = 255;
        gMin = 0;
    }
    if (bMax === bMin) {
        bMax = 255;
        bMin = 0;
    }
    let rGoalMax, rGoalMin, gGoalMax, gGoalMin, bGoalMax, bGoalMin;
    // If the enhancement is positive - stretch the histogram
    if (enhanceAmount > 0) {
        rGoalMax = rMax + enhanceAmount * (255 - rMax);
        rGoalMin = rMin - enhanceAmount * (rMin - 0);
        gGoalMax = gMax + enhanceAmount * (255 - gMax);
        gGoalMin = gMin - enhanceAmount * (gMin - 0);
        bGoalMax = bMax + enhanceAmount * (255 - bMax);
        bGoalMin = bMin - enhanceAmount * (bMin - 0);
        // If the enhancement is negative -   compress the histogram
    }
    else {
        const rMid = (rMax + rMin) * 0.5;
        rGoalMax = rMax + enhanceAmount * (rMax - rMid);
        rGoalMin = rMin + enhanceAmount * (rMin - rMid);
        const gMid = (gMax + gMin) * 0.5;
        gGoalMax = gMax + enhanceAmount * (gMax - gMid);
        gGoalMin = gMin + enhanceAmount * (gMin - gMid);
        const bMid = (bMax + bMin) * 0.5;
        bGoalMax = bMax + enhanceAmount * (bMax - bMid);
        bGoalMin = bMin + enhanceAmount * (bMin - bMid);
    }
    // Pass 2 - remap everything, except the alpha
    for (let i = 0; i < nSubPixels; i += 4) {
        data[i + 0] = remap(data[i + 0], rMin, rMax, rGoalMin, rGoalMax);
        data[i + 1] = remap(data[i + 1], gMin, gMax, gGoalMin, gGoalMax);
        data[i + 2] = remap(data[i + 2], bMin, bMax, bGoalMin, bGoalMax);
        //data[i + 3] = remap(data[i + 3], aMin, aMax, aGoalMin, aGoalMax);
    }
};
/**
 * get/set enhance. Use with {@link Konva.Filters.Enhance} filter. -1 to 1 values
 * @name Konva.Node#enhance
 * @method
 * @param {Float} amount
 * @returns {Float}
 */
Factory.addGetterSetter(Node, 'enhance', 0, getNumberValidator(), Factory.afterSetFilter);

/**
 * Grayscale Filter
 * @function
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Grayscale]);
 */
const Grayscale = function (imageData) {
    const data = imageData.data, len = data.length;
    for (let i = 0; i < len; i += 4) {
        const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
        // red
        data[i] = brightness;
        // green
        data[i + 1] = brightness;
        // blue
        data[i + 2] = brightness;
    }
};

Factory.addGetterSetter(Node, 'hue', 0, getNumberValidator(), Factory.afterSetFilter);
/**
 * get/set hsv hue in degrees. Use with {@link Konva.Filters.HSV} or {@link Konva.Filters.HSL} filter.
 * @name Konva.Node#hue
 * @method
 * @param {Number} hue value between 0 and 359
 * @returns {Number}
 */
Factory.addGetterSetter(Node, 'saturation', 0, getNumberValidator(), Factory.afterSetFilter);
/**
 * get/set hsv saturation. Use with {@link Konva.Filters.HSV} or {@link Konva.Filters.HSL} filter.
 * @name Konva.Node#saturation
 * @method
 * @param {Number} saturation 0 is no change, -1.0 halves the saturation, 1.0 doubles, etc..
 * @returns {Number}
 */
Factory.addGetterSetter(Node, 'luminance', 0, getNumberValidator(), Factory.afterSetFilter);
/**
 * get/set hsl luminance. Use with {@link Konva.Filters.HSL} filter.
 * @name Konva.Node#luminance
 * @method
 * @param {Number} value from -1 to 1
 * @returns {Number}
 */
/**
 * HSL Filter. Adjusts the hue, saturation and luminance (or lightness)
 * @function
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @author ippo615
 * @example
 * image.filters([Konva.Filters.HSL]);
 * image.luminance(0.2);
 */
const HSL = function (imageData) {
    const data = imageData.data, nPixels = data.length, v = 1, s = Math.pow(2, this.saturation()), h = Math.abs(this.hue() + 360) % 360, l = this.luminance() * 127;
    // Basis for the technique used:
    // http://beesbuzz.biz/code/hsv_color_transforms.php
    // V is the value multiplier (1 for none, 2 for double, 0.5 for half)
    // S is the saturation multiplier (1 for none, 2 for double, 0.5 for half)
    // H is the hue shift in degrees (0 to 360)
    // vsu = V*S*cos(H*PI/180);
    // vsw = V*S*sin(H*PI/180);
    //[ .299V+.701vsu+.168vsw    .587V-.587vsu+.330vsw    .114V-.114vsu-.497vsw ] [R]
    //[ .299V-.299vsu-.328vsw    .587V+.413vsu+.035vsw    .114V-.114vsu+.292vsw ]*[G]
    //[ .299V-.300vsu+1.25vsw    .587V-.588vsu-1.05vsw    .114V+.886vsu-.203vsw ] [B]
    // Precompute the values in the matrix:
    const vsu = v * s * Math.cos((h * Math.PI) / 180), vsw = v * s * Math.sin((h * Math.PI) / 180);
    // (result spot)(source spot)
    const rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw, rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw, rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
    const gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw, gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw, gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
    const br = 0.299 * v - 0.3 * vsu + 1.25 * vsw, bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw, bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;
    let r, g, b, a;
    for (let i = 0; i < nPixels; i += 4) {
        r = data[i + 0];
        g = data[i + 1];
        b = data[i + 2];
        a = data[i + 3];
        data[i + 0] = rr * r + rg * g + rb * b + l;
        data[i + 1] = gr * r + gg * g + gb * b + l;
        data[i + 2] = br * r + bg * g + bb * b + l;
        data[i + 3] = a; // alpha
    }
};

/**
 * HSV Filter. Adjusts the hue, saturation and value
 * @function
 * @name HSV
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @author ippo615
 * @example
 * image.filters([Konva.Filters.HSV]);
 * image.value(200);
 */
const HSV = function (imageData) {
    const data = imageData.data, nPixels = data.length, v = Math.pow(2, this.value()), s = Math.pow(2, this.saturation()), h = Math.abs(this.hue() + 360) % 360;
    // Basis for the technique used:
    // http://beesbuzz.biz/code/hsv_color_transforms.php
    // V is the value multiplier (1 for none, 2 for double, 0.5 for half)
    // S is the saturation multiplier (1 for none, 2 for double, 0.5 for half)
    // H is the hue shift in degrees (0 to 360)
    // vsu = V*S*cos(H*PI/180);
    // vsw = V*S*sin(H*PI/180);
    //[ .299V+.701vsu+.168vsw    .587V-.587vsu+.330vsw    .114V-.114vsu-.497vsw ] [R]
    //[ .299V-.299vsu-.328vsw    .587V+.413vsu+.035vsw    .114V-.114vsu+.292vsw ]*[G]
    //[ .299V-.300vsu+1.25vsw    .587V-.588vsu-1.05vsw    .114V+.886vsu-.203vsw ] [B]
    // Precompute the values in the matrix:
    const vsu = v * s * Math.cos((h * Math.PI) / 180), vsw = v * s * Math.sin((h * Math.PI) / 180);
    // (result spot)(source spot)
    const rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw, rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw, rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
    const gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw, gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw, gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
    const br = 0.299 * v - 0.3 * vsu + 1.25 * vsw, bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw, bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;
    for (let i = 0; i < nPixels; i += 4) {
        const r = data[i + 0];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        data[i + 0] = rr * r + rg * g + rb * b;
        data[i + 1] = gr * r + gg * g + gb * b;
        data[i + 2] = br * r + bg * g + bb * b;
        data[i + 3] = a; // alpha
    }
};
Factory.addGetterSetter(Node, 'hue', 0, getNumberValidator(), Factory.afterSetFilter);
/**
 * get/set hsv hue in degrees. Use with {@link Konva.Filters.HSV} or {@link Konva.Filters.HSL} filter.
 * @name Konva.Node#hue
 * @method
 * @param {Number} hue value between 0 and 359
 * @returns {Number}
 */
Factory.addGetterSetter(Node, 'saturation', 0, getNumberValidator(), Factory.afterSetFilter);
/**
 * get/set hsv saturation. Use with {@link Konva.Filters.HSV} or {@link Konva.Filters.HSL} filter.
 * @name Konva.Node#saturation
 * @method
 * @param {Number} saturation 0 is no change, -1.0 halves the saturation, 1.0 doubles, etc..
 * @returns {Number}
 */
Factory.addGetterSetter(Node, 'value', 0, getNumberValidator(), Factory.afterSetFilter);
/**
 * get/set hsv value. Use with {@link Konva.Filters.HSV} filter.
 * @name Konva.Node#value
 * @method
 * @param {Number} value 0 is no change, -1.0 halves the value, 1.0 doubles, etc..
 * @returns {Number}
 */

/**
 * Invert Filter
 * @function
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Invert]);
 */
const Invert = function (imageData) {
    const data = imageData.data, len = data.length;
    for (let i = 0; i < len; i += 4) {
        // red
        data[i] = 255 - data[i];
        // green
        data[i + 1] = 255 - data[i + 1];
        // blue
        data[i + 2] = 255 - data[i + 2];
    }
};

function pixelAt(idata, x, y) {
    let idx = (y * idata.width + x) * 4;
    const d = [];
    d.push(idata.data[idx++], idata.data[idx++], idata.data[idx++], idata.data[idx++]);
    return d;
}
function rgbDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) +
        Math.pow(p1[1] - p2[1], 2) +
        Math.pow(p1[2] - p2[2], 2));
}
function rgbMean(pTab) {
    const m = [0, 0, 0];
    for (let i = 0; i < pTab.length; i++) {
        m[0] += pTab[i][0];
        m[1] += pTab[i][1];
        m[2] += pTab[i][2];
    }
    m[0] /= pTab.length;
    m[1] /= pTab.length;
    m[2] /= pTab.length;
    return m;
}
function backgroundMask(idata, threshold) {
    const rgbv_no = pixelAt(idata, 0, 0);
    const rgbv_ne = pixelAt(idata, idata.width - 1, 0);
    const rgbv_so = pixelAt(idata, 0, idata.height - 1);
    const rgbv_se = pixelAt(idata, idata.width - 1, idata.height - 1);
    const thres = threshold || 10;
    if (rgbDistance(rgbv_no, rgbv_ne) < thres &&
        rgbDistance(rgbv_ne, rgbv_se) < thres &&
        rgbDistance(rgbv_se, rgbv_so) < thres &&
        rgbDistance(rgbv_so, rgbv_no) < thres) {
        // Mean color
        const mean = rgbMean([rgbv_ne, rgbv_no, rgbv_se, rgbv_so]);
        // Mask based on color distance
        const mask = [];
        for (let i = 0; i < idata.width * idata.height; i++) {
            const d = rgbDistance(mean, [
                idata.data[i * 4],
                idata.data[i * 4 + 1],
                idata.data[i * 4 + 2],
            ]);
            mask[i] = d < thres ? 0 : 255;
        }
        return mask;
    }
}
function applyMask(idata, mask) {
    for (let i = 0; i < idata.width * idata.height; i++) {
        idata.data[4 * i + 3] = mask[i];
    }
}
function erodeMask(mask, sw, sh) {
    const weights = [1, 1, 1, 1, 0, 1, 1, 1, 1];
    const side = Math.round(Math.sqrt(weights.length));
    const halfSide = Math.floor(side / 2);
    const maskResult = [];
    for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
            const so = y * sw + x;
            let a = 0;
            for (let cy = 0; cy < side; cy++) {
                for (let cx = 0; cx < side; cx++) {
                    const scy = y + cy - halfSide;
                    const scx = x + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        const srcOff = scy * sw + scx;
                        const wt = weights[cy * side + cx];
                        a += mask[srcOff] * wt;
                    }
                }
            }
            maskResult[so] = a === 255 * 8 ? 255 : 0;
        }
    }
    return maskResult;
}
function dilateMask(mask, sw, sh) {
    const weights = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    const side = Math.round(Math.sqrt(weights.length));
    const halfSide = Math.floor(side / 2);
    const maskResult = [];
    for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
            const so = y * sw + x;
            let a = 0;
            for (let cy = 0; cy < side; cy++) {
                for (let cx = 0; cx < side; cx++) {
                    const scy = y + cy - halfSide;
                    const scx = x + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        const srcOff = scy * sw + scx;
                        const wt = weights[cy * side + cx];
                        a += mask[srcOff] * wt;
                    }
                }
            }
            maskResult[so] = a >= 255 * 4 ? 255 : 0;
        }
    }
    return maskResult;
}
function smoothEdgeMask(mask, sw, sh) {
    const weights = [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9];
    const side = Math.round(Math.sqrt(weights.length));
    const halfSide = Math.floor(side / 2);
    const maskResult = [];
    for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
            const so = y * sw + x;
            let a = 0;
            for (let cy = 0; cy < side; cy++) {
                for (let cx = 0; cx < side; cx++) {
                    const scy = y + cy - halfSide;
                    const scx = x + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        const srcOff = scy * sw + scx;
                        const wt = weights[cy * side + cx];
                        a += mask[srcOff] * wt;
                    }
                }
            }
            maskResult[so] = a;
        }
    }
    return maskResult;
}
/**
 * Mask Filter
 * @function
 * @name Mask
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Mask]);
 * node.threshold(200);
 */
const Mask = function (imageData) {
    // Detect pixels close to the background color
    const threshold = this.threshold();
    let mask = backgroundMask(imageData, threshold);
    if (mask) {
        // Erode
        mask = erodeMask(mask, imageData.width, imageData.height);
        // Dilate
        mask = dilateMask(mask, imageData.width, imageData.height);
        // Gradient
        mask = smoothEdgeMask(mask, imageData.width, imageData.height);
        // Apply mask
        applyMask(imageData, mask);
    }
    return imageData;
};
Factory.addGetterSetter(Node, 'threshold', 0, getNumberValidator(), Factory.afterSetFilter);

/**
 * Noise Filter. Randomly adds or substracts to the color channels
 * @function
 * @name Noise
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @author ippo615
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Noise]);
 * node.noise(0.8);
 */
const Noise = function (imageData) {
    const amount = this.noise() * 255, data = imageData.data, nPixels = data.length, half = amount / 2;
    for (let i = 0; i < nPixels; i += 4) {
        data[i + 0] += half - 2 * half * Math.random();
        data[i + 1] += half - 2 * half * Math.random();
        data[i + 2] += half - 2 * half * Math.random();
    }
};
Factory.addGetterSetter(Node, 'noise', 0.2, getNumberValidator(), Factory.afterSetFilter);
/**
 * get/set noise amount.  Must be a value between 0 and 1. Use with {@link Konva.Filters.Noise} filter.
 * @name Konva.Node#noise
 * @method
 * @param {Number} noise
 * @returns {Number}
 */

/**
 * Pixelate Filter. Averages groups of pixels and redraws
 *  them as larger pixels
 * @function
 * @name Pixelate
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @author ippo615
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Pixelate]);
 * node.pixelSize(10);
 */
const Pixelate = function (imageData) {
    let pixelSize = Math.ceil(this.pixelSize()), width = imageData.width, height = imageData.height, 
    //pixelsPerBin = pixelSize * pixelSize,
    nBinsX = Math.ceil(width / pixelSize), nBinsY = Math.ceil(height / pixelSize), data = imageData.data;
    if (pixelSize <= 0) {
        Util.error('pixelSize value can not be <= 0');
        return;
    }
    for (let xBin = 0; xBin < nBinsX; xBin += 1) {
        for (let yBin = 0; yBin < nBinsY; yBin += 1) {
            // Initialize the color accumlators to 0
            let red = 0;
            let green = 0;
            let blue = 0;
            let alpha = 0;
            // Determine which pixels are included in this bin
            const xBinStart = xBin * pixelSize;
            const xBinEnd = xBinStart + pixelSize;
            const yBinStart = yBin * pixelSize;
            const yBinEnd = yBinStart + pixelSize;
            // Add all of the pixels to this bin!
            let pixelsInBin = 0;
            for (let x = xBinStart; x < xBinEnd; x += 1) {
                if (x >= width) {
                    continue;
                }
                for (let y = yBinStart; y < yBinEnd; y += 1) {
                    if (y >= height) {
                        continue;
                    }
                    const i = (width * y + x) * 4;
                    red += data[i + 0];
                    green += data[i + 1];
                    blue += data[i + 2];
                    alpha += data[i + 3];
                    pixelsInBin += 1;
                }
            }
            // Make sure the channels are between 0-255
            red = red / pixelsInBin;
            green = green / pixelsInBin;
            blue = blue / pixelsInBin;
            alpha = alpha / pixelsInBin;
            // Draw this bin
            for (let x = xBinStart; x < xBinEnd; x += 1) {
                if (x >= width) {
                    continue;
                }
                for (let y = yBinStart; y < yBinEnd; y += 1) {
                    if (y >= height) {
                        continue;
                    }
                    const i = (width * y + x) * 4;
                    data[i + 0] = red;
                    data[i + 1] = green;
                    data[i + 2] = blue;
                    data[i + 3] = alpha;
                }
            }
        }
    }
};
Factory.addGetterSetter(Node, 'pixelSize', 8, getNumberValidator(), Factory.afterSetFilter);
/**
 * get/set pixel size. Use with {@link Konva.Filters.Pixelate} filter.
 * @name Konva.Node#pixelSize
 * @method
 * @param {Integer} pixelSize
 * @returns {Integer}
 */

/**
 * Posterize Filter. Adjusts the channels so that there are no more
 *  than n different values for that channel. This is also applied
 *  to the alpha channel.
 * @function
 * @name Posterize
 * @author ippo615
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Posterize]);
 * node.levels(0.8); // between 0 and 1
 */
const Posterize = function (imageData) {
    // level must be between 1 and 255
    const levels = Math.round(this.levels() * 254) + 1, data = imageData.data, len = data.length, scale = 255 / levels;
    for (let i = 0; i < len; i += 1) {
        data[i] = Math.floor(data[i] / scale) * scale;
    }
};
Factory.addGetterSetter(Node, 'levels', 0.5, getNumberValidator(), Factory.afterSetFilter);
/**
 * get/set levels.  Must be a number between 0 and 1.  Use with {@link Konva.Filters.Posterize} filter.
 * @name Konva.Node#levels
 * @method
 * @param {Number} level between 0 and 1
 * @returns {Number}
 */

/**
 * RGB Filter
 * @function
 * @name RGB
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @author ippo615
 * @example
 * node.cache();
 * node.filters([Konva.Filters.RGB]);
 * node.blue(120);
 * node.green(200);
 */
const RGB = function (imageData) {
    const data = imageData.data, nPixels = data.length, red = this.red(), green = this.green(), blue = this.blue();
    for (let i = 0; i < nPixels; i += 4) {
        const brightness = (0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]) / 255;
        data[i] = brightness * red; // r
        data[i + 1] = brightness * green; // g
        data[i + 2] = brightness * blue; // b
        data[i + 3] = data[i + 3]; // alpha
    }
};
Factory.addGetterSetter(Node, 'red', 0, function (val) {
    this._filterUpToDate = false;
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return Math.round(val);
    }
});
/**
 * get/set filter red value. Use with {@link Konva.Filters.RGB} filter.
 * @name red
 * @method
 * @memberof Konva.Node.prototype
 * @param {Integer} red value between 0 and 255
 * @returns {Integer}
 */
Factory.addGetterSetter(Node, 'green', 0, function (val) {
    this._filterUpToDate = false;
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return Math.round(val);
    }
});
/**
 * get/set filter green value. Use with {@link Konva.Filters.RGB} filter.
 * @name green
 * @method
 * @memberof Konva.Node.prototype
 * @param {Integer} green value between 0 and 255
 * @returns {Integer}
 */
Factory.addGetterSetter(Node, 'blue', 0, RGBComponent, Factory.afterSetFilter);
/**
 * get/set filter blue value. Use with {@link Konva.Filters.RGB} filter.
 * @name blue
 * @method
 * @memberof Konva.Node.prototype
 * @param {Integer} blue value between 0 and 255
 * @returns {Integer}
 */

/**
 * RGBA Filter
 * @function
 * @name RGBA
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @author codefo
 * @example
 * node.cache();
 * node.filters([Konva.Filters.RGBA]);
 * node.blue(120);
 * node.green(200);
 * node.alpha(0.3);
 */
const RGBA = function (imageData) {
    const data = imageData.data, nPixels = data.length, red = this.red(), green = this.green(), blue = this.blue(), alpha = this.alpha();
    for (let i = 0; i < nPixels; i += 4) {
        const ia = 1 - alpha;
        data[i] = red * alpha + data[i] * ia; // r
        data[i + 1] = green * alpha + data[i + 1] * ia; // g
        data[i + 2] = blue * alpha + data[i + 2] * ia; // b
    }
};
Factory.addGetterSetter(Node, 'red', 0, function (val) {
    this._filterUpToDate = false;
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return Math.round(val);
    }
});
/**
 * get/set filter red value. Use with {@link Konva.Filters.RGBA} filter.
 * @name red
 * @method
 * @memberof Konva.Node.prototype
 * @param {Integer} red value between 0 and 255
 * @returns {Integer}
 */
Factory.addGetterSetter(Node, 'green', 0, function (val) {
    this._filterUpToDate = false;
    if (val > 255) {
        return 255;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return Math.round(val);
    }
});
/**
 * get/set filter green value. Use with {@link Konva.Filters.RGBA} filter.
 * @name green
 * @method
 * @memberof Konva.Node.prototype
 * @param {Integer} green value between 0 and 255
 * @returns {Integer}
 */
Factory.addGetterSetter(Node, 'blue', 0, RGBComponent, Factory.afterSetFilter);
/**
 * get/set filter blue value. Use with {@link Konva.Filters.RGBA} filter.
 * @name blue
 * @method
 * @memberof Konva.Node.prototype
 * @param {Integer} blue value between 0 and 255
 * @returns {Integer}
 */
Factory.addGetterSetter(Node, 'alpha', 1, function (val) {
    this._filterUpToDate = false;
    if (val > 1) {
        return 1;
    }
    else if (val < 0) {
        return 0;
    }
    else {
        return val;
    }
});
/**
 * get/set filter alpha value. Use with {@link Konva.Filters.RGBA} filter.
 * @name alpha
 * @method
 * @memberof Konva.Node.prototype
 * @param {Float} alpha value between 0 and 1
 * @returns {Float}
 */

// based on https://stackoverflow.com/questions/1061093/how-is-a-sepia-tone-created
/**
 * @function
 * @name Sepia
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Sepia]);
 */
const Sepia = function (imageData) {
    const data = imageData.data, nPixels = data.length;
    for (let i = 0; i < nPixels; i += 4) {
        const r = data[i + 0];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i + 0] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
    }
};

/**
 * Solarize Filter
 * Pixastic Lib - Solarize filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 * @function
 * @name Solarize
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Solarize]);
 */
const Solarize = function (imageData) {
    const data = imageData.data, w = imageData.width, h = imageData.height, w4 = w * 4;
    let y = h;
    do {
        const offsetY = (y - 1) * w4;
        let x = w;
        do {
            const offset = offsetY + (x - 1) * 4;
            let r = data[offset];
            let g = data[offset + 1];
            let b = data[offset + 2];
            if (r > 127) {
                r = 255 - r;
            }
            if (g > 127) {
                g = 255 - g;
            }
            if (b > 127) {
                b = 255 - b;
            }
            data[offset] = r;
            data[offset + 1] = g;
            data[offset + 2] = b;
        } while (--x);
    } while (--y);
};

/**
 * Threshold Filter. Pushes any value above the mid point to
 *  the max and any value below the mid point to the min.
 *  This affects the alpha channel.
 * @function
 * @name Threshold
 * @memberof Konva.Filters
 * @param {Object} imageData
 * @author ippo615
 * @example
 * node.cache();
 * node.filters([Konva.Filters.Threshold]);
 * node.threshold(0.1);
 */
const Threshold = function (imageData) {
    const level = this.threshold() * 255, data = imageData.data, len = data.length;
    for (let i = 0; i < len; i += 1) {
        data[i] = data[i] < level ? 0 : 255;
    }
};
Factory.addGetterSetter(Node, 'threshold', 0.5, getNumberValidator(), Factory.afterSetFilter);
/**
 * get/set threshold.  Must be a value between 0 and 1. Use with {@link Konva.Filters.Threshold} or {@link Konva.Filters.Mask} filter.
 * @name threshold
 * @method
 * @memberof Konva.Node.prototype
 * @param {Number} threshold
 * @returns {Number}
 */

// we need to import core of the Konva and then extend it with all additional objects
const Konva = Konva$1.Util._assign(Konva$1, {
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

export { Konva as default };
