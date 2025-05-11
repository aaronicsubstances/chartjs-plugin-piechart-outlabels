'use strict';

import { ArcElement, ChartDataset, ChartType, Plugin } from 'chart.js';
import defaults from './defaults';

import OutLabel from './OutLabel';
import { merge } from 'chart.js/helpers';
import { OutLabelsContext, OutLabelsOptions } from './types';

declare type OutLabelsPluginType = Plugin<'doughnut' | 'pie', OutLabelsOptions>;

declare module 'chart.js' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface PluginOptionsByType<TType extends ChartType> {
        outlabels?: OutLabelsOptions
    }
}

const LABEL_KEY = defaults.LABEL_KEY;

function configure(dataset: ChartDataset<'doughnut' | 'pie', number[]>, options?: OutLabelsOptions) {
	let override = (dataset as any).outlabels;
	let config = {} as OutLabelsOptions;

	if (override === false) {
		return null;
	}
	if (override === true) {
		override = {};
	}

	merge(config, [options, override]);
    return config;
}

const OutLabelsPlugin: OutLabelsPluginType = {
	id: 'outlabels',

	defaults: defaults,

	resize: function(chart) {
		(chart as any).sizeChanged = true;
	},

	afterDatasetUpdate: function(chart, args, options) {
		const labels = chart.config.data.labels as string[];
		const dataset = chart.data.datasets[args.index];
		const config = configure(dataset, options);
		const display = config && config.display;
		const elements = (args.meta.data || []) as ArcElement[];
		const ctx = chart.ctx;

		ctx.save();

		for (let i = 0; i < elements.length; i++) {
			const el = elements[i];
			const label = el[LABEL_KEY] as OutLabel | undefined;
			const percent = dataset.data[i] / (args.meta as any).total;
			let newLabel: OutLabel | undefined;

			if (display && el && !(el as any).hidden) {
				try {
					let context: OutLabelsContext = {
						chart: chart,
						dataIndex: i,
						dataset: dataset,
						labels: labels,
						datasetIndex: args.index,
						percent: percent
					};
					newLabel = new OutLabel(el, i, ctx, config, context);
				} catch(e) {
					console.log(e);
					newLabel = null;
				}
			}

			if (
				label && 
				newLabel && 
				!(chart as any).sizeChanged &&
				(label.label === newLabel.label) && 
				(label.encodedText === newLabel.encodedText)
			) {
				newLabel.offset = label.offset;
			}

			el[LABEL_KEY] = newLabel;
		}

		ctx.restore();
		(chart as any).sizeChanged = false;
	},
	afterDatasetDraw: function(_, args) {
		const elements = (args.meta.data || []) as Array<ArcElement>;

		for (let i = 0; i < 2 * elements.length; ++i) {
			const index = i < elements.length ? i : i - elements.length;

			const el = elements[index];
			const label = el[LABEL_KEY] as OutLabel | undefined;
			if (!label) {
				continue;
			}

			if (i < elements.length) {
				label.update(el, elements, i);
				label.drawLine();
			} else {
				label.draw();
			}
		}
	}
};

export default OutLabelsPlugin;