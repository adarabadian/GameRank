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
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, './build')));

const portListened = app.listen(port, () => console.log("listening on port " + port));

socketHandler.initSocketIo(portListened);

corsController.handleCors(app);

app.use(express.static('./uploads'));
app.use(express.json());
app.use(loginFilter());

const corsOptions = {
	origin:["https://gamerank.onrender.com", 
			"http://gamerank.onrender.com", 
			'http://adar-projects-catalog.onrender.com',
			'https://adar-projects-catalog.onrender.com',
			'https://adar-projects-catalog.herokuapp.com', 
			'http://adar-projects-catalog.herokuapp.com'], 
	credentials: true,
	optionSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use("/users", usersController);
app.use("/games", gamesController);
app.use("/ranks", ranksController);
app.use("/deals", dealsController);
app.use(errorHandler);