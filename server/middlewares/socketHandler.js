const { getGameData } = require("../logic/gamesLogic");
const { getGameRanks } = require("../dao/ranksDao");
const usersIDSocketMap = require("../models/usersIDSocketMap");
const usersServerCache = require("../models/usersServerCache");

const initSocketIo = (server) =>{
    const socketIO = require('socket.io');
    
    const io = socketIO(server, {
        origins : ["https://gamerank.adarabadian.com", "http://gamerank.adarabadian.com"],
      cors: {
        origin: ["https://gamerank.adarabadian.com", "http://gamerank.adarabadian.com"],
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true
      }
    });


    registerSocketConnections(io);
}

const registerSocketConnections = (io) => {    
    io.on("connection", (socket) => {
        const token = socket.request._query['token'];

        if (usersServerCache.get(token) == undefined){
            return;
        }

        const userDetails = usersServerCache.get(token);
        usersIDSocketMap.set(userDetails.userId, socket);
        console.log("userId: " + userDetails.userId + " connected. Total clients: " + usersIDSocketMap.size);

        socket.on('updateGameReviews', async data =>{
            try{
                let gameResult = await getGameData(data.game.id);
                const reviews = await getGameRanks(data.game.id); 

                let gameCopy = Object.assign(gameResult, {reviews : { reviews : reviews}});
                const userName = userDetails.firstName + ' ' + userDetails.lastName;
                socket.broadcast.emit("updateGameReviews", {gameCopy, reviews, userName});
            }catch (err){
                console.log(err);
            } // io.emit("updateGameReviews", data);
        });

        socket.on('disconnect', () => {
            try{
                usersIDSocketMap.delete(userDetails.userId);
                console.log(userDetails.userId + " client has been disconnected. Total clients: " + usersIDSocketMap.size);
            }catch(err){
                console.log(err);
            }
        })
    });

    io.listen(3002, () => {
        console.log('socket listening on port 3002');
    })
}

module.exports = {
    initSocketIo
};