import { Controller } from "./controllers/gameController.js";
import { Model } from "./model/gameModel.js";
import { View } from "./view/gamePageView.js";

export const wordle = new Controller(new Model(), new View()
);

wordle.loadWordleData();
//wordle.overallUiGeneration(); 