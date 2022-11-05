const ranksDao = require("../dao/ranksDao");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");
const userUtils = require('../utilities/userUtils');

const addReview = async (request) =>{
    const rank = request.body;
    validateParameters(rank);
    
    const userId = await userUtils.getUserId(request);
    const date = getDate();
    const getUserRank = await ranksDao.getUserRank(userId, rank.gameId);

    if (getUserRank[0] !== undefined){
        updateRank(rank, date, userId);
        return;
    } 

    await ranksDao.addRank(rank, userId, date);
}

const updateRank = async (rank, date, userId) =>{
    validateParameters(rank);
    await ranksDao.updateRank(rank, date, userId);
}

const validateParameters = (rank) =>{
    if (rank.title.length < 3 || rank.title.length > 50 || rank.description.length > 300 || rank.score > 10 || rank.score < 0){
        throw new ServerError(ErrorType.WRONG_FIELD_LENGTHS);
    }
}

const getUserRank = async (request) =>{
    const userId = await userUtils.getUserId(request);
    const gameId = request.params.gameId;
    return await ranksDao.getUserRank(userId, gameId);
}

const getGameRanks = async (gameId) =>{
    return await ranksDao.getGameRanks(gameId);
} 

const getDate = () =>{
    const date = new Date();

    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

module.exports = {
    addReview,
    getUserRank,
    getGameRanks
}