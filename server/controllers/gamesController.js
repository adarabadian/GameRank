const express = require("express");
const router = express.Router();
const gamesLogic = require("../logic/gamesLogic");

router.get("/", async(request, response, next) => {
    try{
        // callback for gamesLogic > getGames
        const games = await gamesLogic.getGames(request);

        // return games
        response.json(games);
    }
    catch(error){
        next(error);
    }
});

module.exports = router;
