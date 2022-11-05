const express = require("express");
const router = express.Router();
const dealsLogic = require("../logic/dealsLogic");

router.get("/", async(request, response, next) => {
    try{
        const deals = await dealsLogic.getGameDeals(request);

        response.json(deals);
    }
    catch(error){
        next(error);
    }
});

router.get("/getPlatforms", async(request, response, next) => {
    try{
        const result = await dealsLogic.getPlatforms(request);

        response.json(result);
    }
    catch(error){
        next(error);
    }
});

router.get("/getDealsByGameId", async(request, response, next) => {
        const gameId = request.query.gameId;
        const platform = request.query.platform;

        const result = await dealsLogic.getDealsByGameId(gameId, platform);

        response.json(result);
});

module.exports = router;
