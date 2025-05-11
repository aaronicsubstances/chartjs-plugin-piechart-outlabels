import { ArcElement, CanvasFontSpec, ChartArea, Point, Scriptable, TRBL } from "chart.js";
import { resolve, toPadding } from "chart.js/helpers";

import defaults from "./defaults";
import {
    Center,
    FontOptions,
    OutLabelsContext,
    OutLabelsOptions,
    Rect,
    ResolvedOutLabelsOptions,
    Size
} from "./types";
import { drawRoundedRect, parseFont, textSize } from "./helpers";
import * as positioners from "./positioners";

const LABEL_KEY = defaults.LABEL_KEY;

export default class OutLabel {
    ctx: CanvasRenderingContext2D
    encodedText?: Scriptable<string, OutLabelsContext>
    text: string
    lines: RegExpMatchArray
    label: string
    value: number
    style: ResolvedOutLabelsOptions
    stretch: number
    size: Size
    offset: Point;
    textRect: Rect = { x: 0, y: 0, width: 0, height: 0 };
    labelRect: Rect = { x: 0, y: 0, width: 0, height: 0 };
    center: Center = {
        x: 0,
        y: 0,
        d: 0,
        arc: null as ArcElement,
        copy: null as Point,
        anchor: null as Point
    };

    constructor(
            el: ArcElement,
            index: number,
            ctx: CanvasRenderingContext2D,
            config: OutLabelsOptions,
            context: OutLabelsContext) {
        // Check whether the label should be displayed
		if (!resolve([config.display, true], context, index)) {
			throw new Error('Label display property is set to false.');
		}
		// Init text
		const value = context.dataset.data[index];
		const label = context.labels[index];
		let text = resolve([config.text, defaults.text], context, index) as string;

		/* Replace label marker */
		text = text.replace(/%l/gi, label);

		/* Replace value marker with possible precision value */
		(text.match(/%v\.?(\d*)/gi) || []).map(function(val) {
			const prec = val.replace(/%v\./gi, '');
			if (prec.length) {
				return +prec;
			} else {
				return config.valuePrecision || defaults.valuePrecision;
			}
		}).forEach(function(val) {
			text = text.replace(/%v\.?(\d*)/i, value.toFixed(val));
		});

		/* Replace percent marker with possible precision value */
		(text.match(/%p\.?(\d*)/gi) || []).map(function(val) {
			const prec = val.replace(/%p\./gi, '');
			if (prec.length) {
				return +prec;
			} else  {
				return config.percentPrecision || defaults.percentPrecision;
			}
		}).forEach(function(val) {
			text = text.replace(/%p\.?(\d*)/i, (context.percent * 100).toFixed(val) + '%');
		});

		// Count lines
		const lines = text.match(/[^\r\n]+/g);

		// If no lines => nothng to display
		if (!lines || !lines.length) {
			throw new Error('No text to show.');
		}

		// Remove unnecessary spaces
		for (let i = 0; i < lines.length; ++i) {
			lines[i] = lines[i].trim();
		}

        // If everything ok -> begin initializing
        this.encodedText = config.text;
        this.text = text;
        this.lines = lines;
        this.label = label;
        this.value = value;
        this.ctx = ctx;

        // Init style
        const style: ResolvedOutLabelsOptions = {
            backgroundColor: '',
            borderColor: '',
            borderRadius: 0,
            borderWidth: 0,
            lineWidth: 0,
            lineColor: '',
            color: '',
            font: null as CanvasFontSpec,
            padding: null as ChartArea,
            textAlign: 'left'
        }; 
        style.backgroundColor = resolve([config.backgroundColor, defaults.backgroundColor, 'black'], context, index) as any;
        style.borderColor = resolve([config.borderColor, defaults.borderColor, 'black'], context, index) as any;
        style.borderRadius = resolve([config.borderRadius, 0], context, index) as number;
        style.borderWidth = resolve([config.borderWidth, 0], context, index) as number;
        style.lineWidth = resolve([config.lineWidth, 2], context, index) as number;
        style.lineColor = resolve([config.lineColor, defaults.lineColor, 'black'], context, index) as any;
        style.color = resolve([config.color, 'white'], context, index) as any;
        style.font = parseFont(resolve([config.font, { resizable: true }]) as FontOptions,
            ctx.canvas.style.height.slice(0, -2));
        style.padding = toPadding(resolve([config.padding, 0], context, index) as number | TRBL);
        style.textAlign = resolve([config.textAlign, 'left'], context, index) as CanvasTextAlign;
        this.style = style;

        this.stretch = resolve([config.stretch, 40], context, index) as number;

        this.size = textSize(ctx, this.lines, this.style.font);


        this.offset = {
            x: 0,
            y: 0
        };

        const { startAngle, endAngle } = el.getProps([
            'startAngle',
            'endAngle',
        ], true);

        // Chart.js considers clockwise rotation as positive angles;
        // so negate bisecting angle to get it into high school math direction.
        // And then scale angle to between 0 and 2.
        // So 0 for East, 0.5 for North, 1 for West and 1.5 for South.
        const angle = -((startAngle + endAngle) / 2) / (Math.PI);

        if (angle >= -0.45 && angle <= 0.45) {
            this.offset.x = this.size.width / 2;
        }
        else if (angle >= -1.45 && angle <= -0.55) {
            this.offset.x = -this.size.width / 2;
        }
    }

    computeLabelRect(): Rect {
        let width = this.textRect.width + 2 * this.style.borderWidth;
        let height = this.textRect.height + 2 * this.style.borderWidth;

        const x = this.textRect.x - this.style.padding.left - this.style.borderWidth;
        const y = this.textRect.y - this.style.padding.top - this.style.borderWidth;

        width += this.style.padding.width;
        height += this.style.padding.height;

        return {
            x: x,
            y: y,
            width: width,
            height: height
        };
    }
    
    computeTextRect(): Rect {
        return {
            x: this.center.x - (this.size.width / 2),
            y: this.center.y - (this.size.height / 2),
            width: this.size.width,
            height: this.size.height
        };
    }

    getPoints(): Point[] {
        return [
            {
                x: this.labelRect.x,
                y: this.labelRect.y
            },
            {
                x: this.labelRect.x + this.labelRect.width,
                y: this.labelRect.y
            },
            {
                x: this.labelRect.x + this.labelRect.width,
                y: this.labelRect.y + this.labelRect.height
            },
            {
                x: this.labelRect.x,
                y: this.labelRect.y + this.labelRect.height
            }
        ];
    }

    containsPoint(point: Point, offset?: number): boolean {
        if (!offset) {
            offset = 5;
        }

        return this.labelRect.x - offset <= point.x &&
            point.x <= this.labelRect.x + this.labelRect.width + offset &&
            this.labelRect.y - offset <= point.y &&
            point.y <= this.labelRect.y + this.labelRect.height + offset;
    }

    update(arc: ArcElement, elements: ArcElement[], max: number) {
        this.center = positioners.center(arc, this.stretch);

        this.center.x += this.offset.x;
        this.center.y += this.offset.y;

        let valid = false;

        while (!valid) {
            this.textRect = this.computeTextRect();
            this.labelRect = this.computeLabelRect();
            const rectPoints = this.getPoints();

            valid = !positioners.doesRectIntersectCircle(arc, this.labelRect);

            for (let e = 0; valid && e < max; e++) {
                const element = elements[e][LABEL_KEY] as OutLabel | undefined;
                if (!element) {
                    continue;
                }

                const elPoints = element.getPoints();

                for (let p = 0; p < rectPoints.length; p++) {
                    if (element.containsPoint(rectPoints[p])) {
                        valid = false;
                        break;
                    }

                    if (this.containsPoint(elPoints[p])) {
                        valid = false;
                        break;
                    }
                }
            }

            if (!valid) {
                this.center = positioners.moveFromAnchor(this.center, 1);
                this.center.x += this.offset.x;
                this.center.y += this.offset.y;
            }
        }
    }
    
    /* ======================= DRAWING ======================= */
    // Draw label text
    drawText() {
        const align = this.style.textAlign;
        const font = this.style.font;
        const lh = Number(font.lineHeight);
        const color = this.style.color;
        const ilen = this.lines.length;

        if (!ilen || !color) {
            return;
        }

        let x = this.textRect.x;
        let y = this.textRect.y + lh / 2;

        if (align === 'center') {
            x += this.textRect.width / 2;
        }
        else if (align === 'end' || align === 'right') {
            x += this.textRect.width;
        }

        this.ctx.font = this.style.font.string;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'middle';

        for (let idx = 0; idx < ilen; idx++) {
            this.ctx.fillText(
                this.lines[idx],
                Math.round(x),
                Math.round(y),
                Math.round(this.textRect.width)
            );

            y += lh;
        }
    }
    
    // Draw label box
    drawLabel() {
        this.ctx.beginPath();
        drawRoundedRect(
            this.ctx,
            Math.round(this.labelRect.x),
            Math.round(this.labelRect.y),
            Math.round(this.labelRect.width),
            Math.round(this.labelRect.height),
            this.style.borderRadius
        );
        this.ctx.closePath();

        if (this.style.backgroundColor) {
            this.ctx.fillStyle = this.style.backgroundColor || 'black';
            this.ctx.fill();
        }

        if (this.style.borderColor && this.style.borderWidth) {
            this.ctx.strokeStyle = this.style.borderColor;
            this.ctx.lineWidth = this.style.borderWidth;
            this.ctx.lineJoin = 'miter';
            this.ctx.stroke();
        }
    }
    
    drawLine() {
        this.ctx.save();

        this.ctx.strokeStyle = this.style.lineColor;
        this.ctx.lineWidth = this.style.lineWidth;
        this.ctx.lineJoin = 'miter';
        this.ctx.beginPath();
        this.ctx.moveTo(this.center.anchor.x, this.center.anchor.y);
        this.ctx.lineTo(this.center.copy.x, this.center.copy.y);
        this.ctx.stroke();

        this.ctx.restore();
    }

    draw() {
        this.drawLabel();
        this.drawText();
    }
}