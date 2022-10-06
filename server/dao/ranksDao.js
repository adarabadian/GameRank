const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");

const getGameRanks = async (gameId) =>{
    const SQL = `SELECT ranks.Title as title,
                     ranks.Description AS description,
                     ranks.Score AS score,
                     ranks.Date AS date,
                     CONCAT(users.First_Name,' ',users.Last_Name) AS reviewer,
                     users.ID AS reviewerId
                 FROM ranks 
                 
                 LEFT JOIN users 
                 ON ranks.User_Id = users.ID
                 
                 WHERE ranks.Game_Id = (?);`;

    const parameters = [
        gameId
    ];

    try {
        let result = await connection.executeWithParameters(SQL, parameters);
        return result;
    } catch(error){
        throw new error;
    }
}

const getUserRank = async (userId, gameId) =>{
    const SQL = `SELECT Title as title,
                        Description AS description,
                        Score AS score
                FROM ranks 
                WHERE User_Id = (?) 
                        AND
                        Game_Id = (?);`;

    let parameters = [
        userId,
        gameId
    ];

    try {
        let result = await connection.executeWithParameters(SQL, parameters);
        return result;
    } catch(error){
        throw new error;
    }
}

const addRank = async (rank, userId, date) =>{
    const SQL = "INSERT into ranks (Title, Description, Score, Date, User_Id, Game_Id) VALUES ( ?, ?, ?, ?, ?, ?);";

    const parameters = [
        rank.title,
        rank.description,
        rank.score,
        date,
        userId,
        rank.gameId
    ];
    
    try {
        let executionResult = await connection.executeWithParameters(SQL, parameters);
        return(executionResult);
    }  catch(error){
        throw new error;
    }
}

const updateRank = async (rank, date, userId) =>{
    const SQL = `UPDATE ranks
                 SET Title = ?, Description = ?, Score = ?, Date = ?
                 WHERE User_Id = ? AND Game_Id = ?;`;

    const parameters = [
        rank.title,
        rank.description,
        rank.score,
        date,
        userId,
        rank.gameId
    ];
    
    try {
        let executionResult = await connection.executeWithParameters(SQL, parameters);
        return(executionResult);
    }

    catch(error){
        throw new error;
    }
}

module.exports = {
    getUserRank,
    addRank,
    updateRank,
    getGameRanks,
};