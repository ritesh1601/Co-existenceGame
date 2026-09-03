const express = require("express");
const gameSessionController = require("../controllers/gameSessionController");
const simulationController = require("../controllers/simulationController");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");


router.post("/", authenticateToken,gameSessionController.createGameSession);
router.get("/:id", authenticateToken,gameSessionController.getGameSessionById);
router.get("/", authenticateToken,gameSessionController.getGameSessionsByUserId);
router.patch("/:id", authenticateToken,gameSessionController.updateGameSession);
router.post("/:id/start", authenticateToken,gameSessionController.startGameSession);
router.post("/:id/tick", authenticateToken,simulationController.simulateDay);



module.exports = router;
