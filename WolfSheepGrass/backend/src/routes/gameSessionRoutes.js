const express = require("express");
const gameSessionController = require("../controllers/gameSessionController");
const simulationController = require("../controllers/simulationController");
const router = express.Router();

router.post("/", gameSessionController.createGameSession);
router.get("/:id", gameSessionController.getGameSessionById);
router.get("/", gameSessionController.getGameSessionsByUserId);
router.patch("/:id", gameSessionController.updateGameSession);
router.post("/:id/start", gameSessionController.startGameSession);
router.post("/:id/tick", simulationController.simulateDay);



module.exports = router;
