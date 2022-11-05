const gamesDao = require("../dao/gamesDao");
const userUtils = require('../utilities/userUtils');

// get games function
const getGames = async (request) =>{
    let userId;
    try{
        userId = await userUtils.getUserId(request);
    } catch {
        userId = null;
    }

    let games = await gamesDao.getGames(userId);

    for (let game of games) {
        game = setGameData(game);
    }

    return games;
}

const setGameData = (game) =>{
    game.picture = setGamePicture(game.picture);
    game.scoreSummary = parseInt(game.scoreSummary);
    return game;
}

const getGameData = async (gameId) =>{
    return await gamesDao.getGameData(gameId);
}

// need to attach for each pic the url
const setGamePicture = (picture) =>{
    const hostUrl = "https://gamerank.onrender.com/";
    return hostUrl + picture;
}

module.exports = {
    getGames,
    getGameData
}