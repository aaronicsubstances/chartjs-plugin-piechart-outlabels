/**
 * @module Options
 */

'use strict';

import { OutLabelsContext, OutLabelsOptions } from "./types";

const defaults: OutLabelsOptions = {

	/**
	 * The color used to draw the background of the label rect.
	 * @member {String|Array|Function|null}
	 * @default null (adaptive background)
	 */
	backgroundColor: function(context: OutLabelsContext) {
		return context.dataset.backgroundColor as string | undefined;
	},

	/**
	 * The color used to draw the border of the label rect.
	 * @member {String|Array|Function|null}
	 * @default null (adaptive border color)
	 */
	borderColor: function(context: OutLabelsContext) {
		return context.dataset.backgroundColor as string | undefined;
	},

	/**
	 * The color used to draw the line between label and arc of the chart.
	 * @member {String|Array|Function|null}
	 * @default null (adaptive line color)
	 */
	lineColor: function(context: OutLabelsContext) {
		return context.dataset.backgroundColor as string | undefined;
	},

	/**
	 * The border radius used to add rounded corners to the label rect.
	 * @member {Number|Array|Function}
	 * @default 0 (not rounded)
	 */
	borderRadius: 0,

	/**
	 * The border width of the surrounding frame.
	 * @member {Number|Array|Function}
	 * @default 0 (no border)
	 */
	borderWidth: 0,

	/**
	 * The width (thickness) of the line between label and chart arc.
	 * @member {Number|Array|Function}
	 * @default 2 
	 */
	lineWidth: 2,

	/**
	 * The color used to draw the label text.
	 * @member {String|Array|Function}
	 * @default white
	 */
	color: 'white',

	/**
	 * Whether to display labels global (boolean) or per data (function)
	 * @member {Boolean|Array|Function}
	 * @default true
	 */
	display: true,

	/**
	 * The font options used to draw the label text.
	 * @member {Object|Array|Function}
	 * @prop {Boolean} font.family - defaults to Chart.defaults.font.family
	 * @prop {Boolean} font.size - defaults to Chart.defaults.font.size
	 * @prop {Boolean} font.style - defaults to Chart.defaults.font.style
	 * @prop {Boolean} font.weight - defaults to 'normal'
	 * @prop {Boolean} font.maxSize - defaults to undefined (unlimited)
	 * @prop {Boolean} font.minSize - defaults to undefined (unlimited)
	 * @prop {Boolean} font.resizable - defaults to true
	 * @default Chart.defaults.font.*
	 */
	font: {
		family: undefined,
		size: undefined,
		style: undefined,
		weight: null,
		maxSize: null,
		minSize: null,
		resizable: true,
        lineHeight: 1.2
	},


	/**
	 * The padding (in pixels) to apply between the text and the surrounding frame.
	 * @member {Number|Object|Array|Function}
	 * @prop {Number} padding.top - Space above the text.
	 * @prop {Number} padding.right - Space on the right of the text.
	 * @prop {Number} padding.bottom - Space below the text.
	 * @prop {Number} padding.left - Space on the left of the text.
	 * @default 4 (all values)
	 */
	padding: {
		top: 4,
		right: 4,
		bottom: 4,
		left: 4
	},

	/**
	 * Text alignment for multi-lines labels ('left'|'right'|'start'|'center'|'end').
	 * @member {String|Array|Function}
	 * @default 'center'
	 */
	textAlign: 'center',

	/**
	 * The length of the line between label and chart arc.
	 * @member {Number|Array|Function|undefined}
	 * @default 40
	 */
	stickLength: 40,

	/**
	 * The text of the label.
	 * @member {String}
	 * @default '%l %p' (label name and value percentage)
	 */
	text: '%l %p',

	/**
	 * The count of numbers after the point separator for float values of percent property
	 * @member {Number}
	 * @default 1
	 */
	percentPrecision: 1,
	
	/**
	 * The count of numbers after the point separator for float values of value property
	 * @member {Number}
	 * @default 3
	 */
	valuePrecision: 3
};

export default defaults;