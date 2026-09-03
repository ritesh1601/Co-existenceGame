const express = require("express");
const gameEntityController = require("../controllers/gameEntityController");

const router = express.Router();

router.post(
    "/:id/entities",
    gameEntityController.createGameEntity
);

router.get(
    "/:id/entities",
    gameEntityController.getGameEntities
);

module.exports = router;