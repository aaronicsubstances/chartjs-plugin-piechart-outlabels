'use strict';

import { CanvasFontSpec } from 'chart.js';
import { toFont, toLineHeight } from 'chart.js/helpers';
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

export function parseFont(value: FontOptions, height: string | number): CanvasFontSpec {
    const font = toFont(value);
    if (value.resizable) {
        font.size = adaptTextSizeToHeight(height, value.minSize, value.maxSize);
        font.lineHeight = toLineHeight(value.lineHeight, font.size);
    }
    return font;
}

function adaptTextSizeToHeight(height: string | number, minSize?: number, maxSize?: number): number {
    const size = (Number(height) / 100) * 2.5;
    if (minSize && size < minSize) {
        return minSize;
    }
    else if (maxSize && size > maxSize) {
        return maxSize;
    }
    return size;
}
