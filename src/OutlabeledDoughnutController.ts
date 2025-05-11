import { DoughnutController, UpdateMode } from "chart.js";

class OutlabeledDoughnutController extends DoughnutController {
    update(mode: UpdateMode) {
        super.update(mode);

        const meta = this.getMeta();
        this.updateElements(meta.data, 0, meta.data.length, mode);
    }
};
OutlabeledDoughnutController.id = 'outlabeledDoughnut';
OutlabeledDoughnutController.defaults = DoughnutController.defaults;

export default OutlabeledDoughnutController;