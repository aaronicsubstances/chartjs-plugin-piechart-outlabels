'use strict';

import { ArcElement, Chart, ChartConfiguration, ChartDataset, ChartType, Plugin } from 'chart.js';
import defaults from './defaults';

import OutLabel from './OutLabel';
import { merge, resolve } from 'chart.js/helpers';
import { OutLabelsContext, OutLabelsOptions } from './types';

declare type OutLabelsPluginType = Plugin<'doughnut' | 'pie', OutLabelsOptions>;

declare module 'chart.js' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface PluginOptionsByType<TType extends ChartType> {
        outlabels?: OutLabelsOptions
    }
}

const LABEL_KEY = defaults.LABEL_KEY;

const symSizeChanged = Symbol("sizeChanged");

function configure(dataset: ChartDataset<'doughnut' | 'pie', number[]>, options?: OutLabelsOptions) {
	let override = (dataset as any).outlabels;
	let config = {};

	if (override === false) {
		return null;
	}
	if (override === true) {
		override = {};
	}

	return merge(config, [options, override]) as OutLabelsOptions;
}

function isPluginApplicableToDataset(
		chart: Chart<'doughnut' | 'pie', number[], unknown>,
		dataset?: ChartDataset<'doughnut' | 'pie', number[]>) {
	const datasetType = dataset?.type || (chart.config as ChartConfiguration)?.type;
	return ['pie', 'doughnut'].includes(datasetType);
}

const OutLabelsPlugin: OutLabelsPluginType = {
	id: 'outlabels',

	defaults: defaults,

	resize: function(chart) {
		chart[symSizeChanged] = true;
	},

	afterDatasetUpdate: function(chart, args, options) {
		if (!isPluginApplicableToDataset(chart, chart.data.datasets[args.index])) {
			return;
		}
		const labels = chart.config.data.labels as string[];
		const dataset = chart.data.datasets[args.index];
		const config = configure(dataset, options);
		const elements = (args.meta.data || []) as ArcElement[];
		const ctx = chart.ctx;

		ctx.save();
		const dataSum = dataset.data.reduce(function(acc, curr) { return acc + curr; }, 0);
		const elementsVisible = chart.isDatasetVisible(args.index);
		for (let i = 0; i < elements.length; i++) {
			const el = elements[i];
			const label = el[LABEL_KEY] as OutLabel | undefined;
			let newLabel: OutLabel | undefined;

			if (dataSum && elementsVisible && chart.getDataVisibility(i)) {
				const percent = dataSum ? 100 * dataset.data[i] / dataSum : 0;
				let context: OutLabelsContext = {
					chart: chart,
					dataIndex: i,
					dataset: dataset,
					labels: labels,
					datasetIndex: args.index,
					percent: percent
				};
				// Check whether the label should be displayed
				if (resolve([config && config.display, true], context, i)) {
					try {
						newLabel = new OutLabel(el, i, ctx, config, context);
					} catch(e) {
						console.log(e);
						newLabel = null;
					}
				}
			}

			if (
				label && 
				newLabel && 
				!chart[symSizeChanged] &&
				(label.label === newLabel.label) && 
				(label.encodedText === newLabel.encodedText)
			) {
				newLabel.offset = label.offset;
			}

			el[LABEL_KEY] = newLabel;
		}

		ctx.restore();
		chart[symSizeChanged] = false;
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