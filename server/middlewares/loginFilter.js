const expressJwt = require("express-jwt");
const config = require("../config.json");

let { secret } = config;

function authenticationJwtRequestToken() {
    return expressJwt({ secret, algorithms: ["HS256"] }).unless({
        path: [
            "/users",
            "/users/isUserExists",
            "/users/login",
            "/users/logUserWithToken",
            "/users/checkVerCode",
            "/users/sendResetPassVerCode",
            "/users/resetPassword",

            "/games",
            
            "/ranks",
            
            "/deals",
            "/deals/getPlatforms",
            "/deals/getDealsByGameId"
        ]
    })
}
module.exports = authenticationJwtRequestToken;