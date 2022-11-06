const express = require("express");
const errorHandler = require("./errors/errorHandler");
const usersController = require("./controllers/usersController");
const gamesController = require("./controllers/gamesController");
const ranksController = require("./controllers/ranksController");
const dealsController = require("./controllers/dealsController");
const corsController = require("./middlewares/corsController");
const socketHandler = require("./middlewares/socketHandler");
const loginFilter = require("./middlewares/loginFilter");
const cors = require("cors");
const server = express();
const path = require('path');

const port = process.env.PORT || 3000;

server.use(express.static(path.join(__dirname, './build')));

const portListened = server.listen(port, () => console.log("listening on port " + port));

socketHandler.initSocketIo(portListened);

corsController.handleCors(server);

server.use(express.static('./uploads'));
server.use(express.json());
server.use(loginFilter());

const corsOptions = {
	// origin: ["https://gamerank.onrender.com", "http://gamerank.onrender.com", 
	// 	'https://adar-projects-catalog.onrender.com', 'http://adar-projects-catalog.onrender.com',
	// 	'https://adar-projects-catalog.herokuapp.com', 'http://adar-projects-catalog.herokuapp.com'],
	origin: '*',
	credentials: true,            //access-control-allow-credentials:true
	optionSuccessStatus: 200,
}

server.use('/', router);
server.use(cors(corsOptions));

server.use("/users", usersController);
server.use("/games", gamesController);
server.use("/ranks", ranksController);
server.use("/deals", dealsController);
server.use(errorHandler);
