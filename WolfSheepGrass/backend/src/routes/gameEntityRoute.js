const express = require("express");
const gameEntityController = require("../controllers/gameEntityController");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

router.post(
    "/:id/entities",
    authenticateToken,
    gameEntityController.createGameEntity
);

router.get(
    "/:id/entities",
    authenticateToken,
    gameEntityController.getGameEntities
);

module.exports = router;