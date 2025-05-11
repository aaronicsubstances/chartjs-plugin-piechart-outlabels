import { Chart } from 'chart.js';
import OutlabeledDoughnutController from './OutlabeledDoughnutController';
import OutlabeledPieController from './OutlabeledPieController';
import OutLabelsPlugin from './plugin';

Chart.register(OutlabeledDoughnutController);
Chart.register(OutlabeledPieController);
Chart.register(OutLabelsPlugin);