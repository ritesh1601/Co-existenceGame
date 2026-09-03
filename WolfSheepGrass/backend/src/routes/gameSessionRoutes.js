const express = require("express");
const gameSessionController = require("../controllers/gameSessionController");

const router = express.Router();

router.post("/", gameSessionController.createGameSession);
router.get("/:id", gameSessionController.getGameSessionById);
router.get("/", gameSessionController.getGameSessionsByUserId);
router.patch("/:id", gameSessionController.updateGameSession);



module.exports = router;
