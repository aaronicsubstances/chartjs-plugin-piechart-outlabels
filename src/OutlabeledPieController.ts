import { PieController, UpdateMode } from "chart.js";

class OutlabeledPieController extends PieController {
    update(mode: UpdateMode) {
        super.update(mode);

        const meta = this.getMeta();
        this.updateElements(meta.data, 0, meta.data.length, mode);
    }
}
OutlabeledPieController.id = 'outlabeledPie';
OutlabeledPieController.defaults = PieController.defaults;

export default OutlabeledPieController;