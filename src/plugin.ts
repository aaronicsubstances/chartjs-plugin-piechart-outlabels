'use strict';

import {
	ArcElement,
	Chart,
	ChartConfiguration,
	ChartDataset,
	ChartType,
	Plugin
} from 'chart.js';
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

const LABEL_KEY = OutLabel.LABEL_KEY;

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

		// The code in the loops below deals with visibility of annular sectors in three aspects
		// 1. visibility of all annular sectors in a dataset. Determined by chart.isDatasetVisible(args.index),
		//    and can be changed with chart.show(args.index) and chart.hide(args.index)
		//   This is handled by the Chart.js library itself, in which invisible datasets are not shown at all,
		//   and so do not need to be explicitly handled by plugins.
		// 2. visibility of all annular sectors across multiple datasets which have the same index i. Determined by
		//    chart.getDataVisibility(i), and can be changed with chart.toggleDataVisibility(i) followed by chart.update()
		// 3. visibility of a particular annular sector at index i in a particular dataset. Determined by
		//    chart.getDatasetMeta(args.index).data[i].hidden, which is equivalent in this plugin hook
		//    to args.meta.data[i].hidden,
		//    and can be changed with chart.show(args.index, i) and chart.hide(args.index, i)
		//
		// So this plugin checks that each annular sector is visible in all 3 aspects, before labelling it.

		let dataSum = 0;
		for (let i = 0; i < dataset.data.length; i++) {
			if (chart.getDataVisibility(i) && !(elements[i] as any).hidden) {
				dataSum += dataset.data[i];
			}
		}
		for (let i = 0; i < elements.length; i++) {
			const el = elements[i];
			const label = el[LABEL_KEY] as OutLabel | undefined;
			let newLabel: OutLabel | undefined;

			if (dataSum && chart.getDataVisibility(i) && !(el as any).hidden) {
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

	afterDatasetDraw: function(chart, args) {
		const elements = (args.meta.data || []) as Array<ArcElement>;

		for (let i = 0; i < 2 * elements.length; ++i) {
			const index = i < elements.length ? i : i - elements.length;

			const el = elements[index];
			const label = el[LABEL_KEY] as OutLabel | undefined;
			if (!label) {
				continue;
			}

			if (i < elements.length) {
				label.update(chart, el, args.index, index);
				label.drawLine();
			} else {
				label.draw();
			}
		}
	}
};

export default OutLabelsPlugin;