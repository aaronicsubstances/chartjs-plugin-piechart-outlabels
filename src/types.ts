import {
    ArcElement,
    CanvasFontSpec,
    Chart,
    ChartArea,
    ChartDataset,
    FontSpec,
    Point,
    Scriptable,
    ScriptableAndScriptableOptions,
    ScriptableChartContext
} from "chart.js";

export type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type Size = {
    width: number;
    height: number;
}

export type Center = {
    x: number;
    y: number;
    d: number;
    arc: ArcElement;
    anchor: Point;
    copy: Point;
}

export type FontOptions = FontSpec & {
    resizable?: boolean;
    minSize?: number;
    maxSize?: number;
}

export type TRBL = {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export type OutLabelsContext = {
    chart: Chart<'doughnut' | 'pie'>;
    dataIndex: number;
    dataset: ChartDataset<'doughnut' | 'pie'>;
    labels: string[];
    datasetIndex: number;
    percent: number;
}

export type OutLabelsOptions = {
    display?: Scriptable<boolean, OutLabelsContext>;
    text?: Scriptable<string, OutLabelsContext>;

    textAlign?: string;
    color?: string;
    borderRadius?: number;
    borderWidth?: number;
    lineWidth?: number;
    stretch?: number;
    percentPrecision?: number;
    valuePrecision?: number;

    padding?: number | TRBL;

    font?: ScriptableAndScriptableOptions<Partial<FontOptions>, ScriptableChartContext>;

    backgroundColor?: Scriptable<string, OutLabelsContext>;
    borderColor?: Scriptable<string, OutLabelsContext>;
    lineColor?: Scriptable<string, OutLabelsContext>;
}

export type ResolvedOutLabelsOptions = {
    textAlign: CanvasTextAlign;
    color: string | CanvasGradient | CanvasPattern;
    borderRadius: number;
    borderWidth: number;
    lineWidth: number;

    padding: ChartArea;

    font: CanvasFontSpec;

    backgroundColor: string | CanvasGradient | CanvasPattern;
    borderColor: string | CanvasGradient | CanvasPattern;
    lineColor: string | CanvasGradient | CanvasPattern;
}