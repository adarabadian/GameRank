const usersServerCache = require("../models/usersServerCache");

// get user token from request headers and remove bearer 
const getUserId = async (request) =>{
    let token = await getUserToken(request);
    let userId = await getUserIdFromToken(token);
    return userId;
}

const getUserToken = async (request) => {
    const authorizationString = request.headers["authorization"];
    const token = authorizationString.substring("Bearer ".length);
    return token;
}

// get user id from token
const getUserIdFromToken = (token) =>{
    let userDetails = usersServerCache.get(token);
    return userDetails.userId;
}

// get user type from token
// const validateIfAdmin = async (request) => {
//     let token = await getUserToken(request);
//     let userDetails = usersServerCache.get(token);

//     if (userDetails.userType != 'ADMIN'){
//         throw new ServerError(ErrorType.INSUFFICIENT_PRIVILEGES, SQL, error);
//     };
// };

module.exports = {
    getUserId,
    // validateIfAdmin
}