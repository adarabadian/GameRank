const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");

const getGames = async (userId) => {
    const SQL = `SELECT 
            games.ID as id,
            games.Name as name,
            games.Developer as developer,
            games.Picture as picture,
            games.Release_Date as releaseDate,
            games.Description as description, 
            games.Is_Pc as isPc,
            games.Is_Xbox as isXbox,
            games.Is_Ps as isPs,

            COUNT(ranks1.Score) as reviewsCount,
            SUM(ranks1.Score) as scoreSummary,

            ranks0.score as userScore
        FROM games

        LEFT JOIN ranks ranks0
            ON games.ID = ranks0.Game_Id AND ranks0.User_Id = (?)
                
        LEFT JOIN ranks ranks1
            ON games.ID = ranks1.Game_Id
            GROUP BY games.ID;`;

    const parameters = [
        userId
    ];
    
    try {
        return await connection.executeWithParameters(SQL, parameters);
    }

    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}

const getGameData = async (gameId) =>{
    const SQL = `SELECT 
        games.ID as id,
        games.Name as name,
        games.Developer as developer,
        games.Picture as picture,
        games.Release_Date as releaseDate,
        games.Description as description, 
        games.Is_Pc as isPc,
        games.Is_Xbox as isXbox,
        games.Is_Ps as isPs,

        AVG(ranks1.Score) as score,
        COUNT(ranks1.Score) as reviewsCount,
        SUM(ranks1.Score) as scoreSummary
    FROM games 

    LEFT JOIN ranks ranks1
        ON games.ID = ranks1.Game_Id

    WHERE games.ID = (?)

    GROUP BY games.ID;`;

    const parameters = [
        gameId
    ];

    try {
        return await connection.executeWithParameters(SQL, parameters);
    }

    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}

const getGamesName = async () =>{
    let SQL = `SELECT games.Name as name,
                      games.ID as id
                FROM Games;`;
    
    try {
        let executionResult = await connection.execute(SQL);
        return executionResult;
    }

    catch(error){
        throw new error;
    }
}

module.exports = {
    getGames,
    getGamesName,
    getGameData
};