const express = require("express");
const router = express.Router();
const ranksLogic = require("../logic/ranksLogic");

router.post("/", async(request, response, next) => {
    try{
        // callback for ranksLogic > addReview function
        await ranksLogic.addReview(request);

        response.json('');
    }
    catch(error){
        next(error);
    }
});

router.get("/", async(request, response, next) => {
    try{
        const result = await ranksLogic.getGameRanks(request.query.gameId);
        response.json(result);
    }
    catch(error){
        next(error);
    }
});



router.get("/getUserRank/:gameId", async(request, response, next) => {
    try{
        // callback for ranksLogic > getUserRank function
        const result = await ranksLogic.getUserRank(request);
        response.json(result);
    }
    catch(error){
        next(error);
    }
});

module.exports = router;
