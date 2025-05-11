'use strict';

import { ArcElement, Point } from "chart.js";
import { Center, Rect } from "./types";

export function	center(arc: ArcElement, stretch: number): Center {
    const { x, y, startAngle, endAngle, outerRadius: d } = arc.getProps([
        "x",
        "y",
        "startAngle",
        "endAngle",
        "outerRadius"
    ], true);
    const angle = (startAngle + endAngle) / 2;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const stretchedD = d + stretch;
    return {
        x: x + cosA * stretchedD,
        y: y + sinA * stretchedD,
        d: stretchedD,
        arc: arc,
        anchor: {
            x: x + cosA * d,
            y: y + sinA * d,
        },
        copy: {
            x: x + cosA * stretchedD,
            y: y + sinA * stretchedD
        }
    };
}

export function moveFromAnchor(center: Center, dist: number): Center {
    const arc = center.arc;
    let d = center.d;
    const { x, y, startAngle, endAngle } = arc.getProps([
        "x",
        "y",
        "startAngle",
        "endAngle"
    ], true);
    const angle = (startAngle + endAngle) / 2;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    d += dist;

    return {
        x: x + cosA * d,
        y: y + sinA * d,
        d: d,
        arc: arc,
        anchor: center.anchor,
        copy: {
            x: x + cosA * d,
            y: y + sinA * d
        }
    };
}

export function doesRectIntersectEnclosingRectOfCircle(arc: ArcElement, r: Rect) {
    const { x: circleCenterX, y: circleCenterY, outerRadius: circleRadius } = arc.getProps([
        "x",
        "y",
        "outerRadius"
    ], true);
    const l1: Point = {
        x: r.x,
        y: r.y
    };
    const r1: Point = {
        x: r.x + r.width,
        y: r.y + r.height
    };
    const l2: Point = {
        x: circleCenterX - circleRadius,
        y: circleCenterY - circleRadius
    };
    const r2: Point = {
        x: circleCenterX + circleRadius,
        y: circleCenterY + circleRadius
    };

    // If one rectangle is to the left or right of the other
    if (r1.x < l2.x || l1.x > r2.x)
        return false;

    // If one rectangle is above or below the other
    if (r1.y < l2.y || l1.y > r2.y)
        return false;

    return true;
}