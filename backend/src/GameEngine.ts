import BattleController from './BattleController.js';
import Model from './model/BattleModel.js';

async function main() {
    const model = new Model();
    const controller = new BattleController(model);
    await controller.go();
    process.exit(0);
}

main()