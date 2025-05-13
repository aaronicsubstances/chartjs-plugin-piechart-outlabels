'use strict';

import { CanvasFontSpec } from 'chart.js';
import * as helpers from 'chart.js/helpers';
import { FontOptions, Size } from './types';

export function textSize(ctx: CanvasRenderingContext2D, lines: RegExpMatchArray, font: CanvasFontSpec): Size {
    const items = [].concat(lines);
    const ilen = items.length;
    const prev = ctx.font;
    let width = 0;

    ctx.font = font.string;

    for (let i = 0; i < ilen; i++) {
        width = Math.max(ctx.measureText(items[i]).width, width);
    }

    ctx.font = prev;

    return {
        height: ilen * (font.lineHeight as number),
        width: width
    };
}

export function parseFont(value: FontOptions, height: number): CanvasFontSpec {
    const font = helpers.toFont(value);
    if (value.resizable) {
        font.size = adaptTextSizeToHeight(height, value.minSize, value.maxSize);
        font.lineHeight = helpers.toLineHeight(value.lineHeight, font.size);
    }
    return font;
}

function adaptTextSizeToHeight(height: number, minSize?: number, maxSize?: number): number {
    const size = (height / 100) * 2.5;
    if (minSize && size < minSize) {
        return minSize;
    }
    else if (maxSize && size > maxSize) {
        return maxSize;
    }
    return size;
}

export function drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number
): void {
    if (helpers["addRoundedRectPath"]) {
        helpers["addRoundedRectPath"](
            ctx, {
                x, y, w, h,
                radius: {
                    topLeft: radius,
                    bottomLeft: radius,
                    topRight: radius,
                    bottomRight: radius,
                }
            }
        );
        return;
    }

    const HALF_PI = Math.PI / 2;

    if (radius) {
        // copied and adapted from https://github.com/chartjs/Chart.js/blob/master/src/helpers/helpers.canvas.ts

        // top left arc
        ctx.arc(x + radius, y + radius, radius, 1.5 * Math.PI, Math.PI, true);

        // line from top left to bottom left
        ctx.lineTo(x, y + h - radius);

        // bottom left arc
        ctx.arc(x + radius, y + h - radius, radius, Math.PI, HALF_PI, true);

        // line from bottom left to bottom right
        ctx.lineTo(x + w - radius, y + h);

        // bottom right arc
        ctx.arc(x + w - radius, y + h - radius, radius, HALF_PI, 0, true);

        // line from bottom right to top right
        ctx.lineTo(x + w, y + radius);

        // top right arc
        ctx.arc(x + w - radius, y + radius, radius, 0, -HALF_PI, true);

        // line from top right to top left
        ctx.lineTo(x + radius, y);
    } else {
        ctx.rect(x, y, w, h)
    }
}