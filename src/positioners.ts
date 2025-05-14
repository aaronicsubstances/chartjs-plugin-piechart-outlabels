'use strict';

import { ArcElement, Point } from "chart.js";
import { Center, Rect } from "./types";

export function	center(arc: ArcElement, largestCircleRadius: number, stretch: number): Center {
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

    const stretchedD = stretch + largestCircleRadius;
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

export function doesRectIntersectCircle(circleCenter: Point, circleRadius: number, r: Rect) {
    const l1: Point = {
        x: r.x,
        y: r.y
    };
    const r1: Point = {
        x: r.x + r.width,
        y: r.y + r.height
    };

    // first check for intersection with square for which
    // circle will be an inscribed circle.
    const l2: Point = {
        x: circleCenter.x- circleRadius,
        y: circleCenter.y - circleRadius
    };
    const r2: Point = {
        x: circleCenter.x + circleRadius,
        y: circleCenter.y + circleRadius
    };

    if (!doRectanglesIntersect(l1, r1, l2, r2)) {
        return false;
    }

    // next check for intersection with square for which
    // circle will be a circumscribed circle.
    const halfOfSmallerSquareSide = circleRadius / Math.SQRT2;
    const l3: Point = {
        x: circleCenter.x - halfOfSmallerSquareSide,
        y: circleCenter.y - halfOfSmallerSquareSide
    };
    const r3: Point = {
        x: circleCenter.x + halfOfSmallerSquareSide,
        y: circleCenter.y + halfOfSmallerSquareSide
    };

    if (doRectanglesIntersect(l1, r1, l3, r3)) {
        return true;
    }

    // lastly check for any two sides of rectangle
    // which do not intersect circle.

    // use the horizontal sides.
    let ptsOfIntercept1 = calcIntersectionOfHorizontalLineWithCircle(r.y, circleCenter, circleRadius);
    let ptsOfIntercept2 = calcIntersectionOfHorizontalLineWithCircle(r.y + r.height, circleCenter, circleRadius);
    return doRangesOverlap([r.x, r.x + r.width], ptsOfIntercept1) ||
            doRangesOverlap([r.x, r.x + r.width], ptsOfIntercept2);
}

function doRectanglesIntersect(topLeft1: Point, bottomRight1: Point,
        topLeft2: Point, bottomRight2: Point) {
    // If one rectangle is to the left or right of the other
    if (bottomRight1.x < topLeft2.x || topLeft1.x > bottomRight2.x)
        return false;

    // If one rectangle is above or below the other
    if (bottomRight1.y < topLeft2.y || topLeft1.y > bottomRight2.y)
        return false;

    return true;
}

function calcIntersectionOfHorizontalLineWithCircle(yIntercept: number,
        circleCenter: Point, circleRadius: number) {
    let determinant = circleRadius*circleRadius -  yIntercept*yIntercept;
    determinant += 2 * yIntercept * circleCenter.y - circleCenter.y * circleCenter.y;
    if (determinant < 0) {
        return undefined;
    }
    const sqrtOfDeterminant = Math.sqrt(determinant);
    return [circleCenter.x - sqrtOfDeterminant, circleCenter.x + sqrtOfDeterminant];
}

/*function calcIntersectionOfVerticalLineWithCircle(xIntercept: number,
        circleCenter: Point, circleRadius: number) {
    let determinant = circleRadius*circleRadius -  xIntercept*xIntercept;
    determinant += 2 * xIntercept * circleCenter.x - circleCenter.x * circleCenter.x;
    if (determinant < 0) {
        return undefined;
    }
    const sqrtOfDeterminant = Math.sqrt(determinant);
    return [circleCenter.y - sqrtOfDeterminant, circleCenter.y + sqrtOfDeterminant];
}*/

function doRangesOverlap(r1: number[], r2?: number[]) {
    if (!r2) {
        return false;
    }
    let noOverlap = r1[1] < r2[0] || r1[0] > r2[1];
    return !noOverlap;
}