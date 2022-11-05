const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const usersDao = require("../dao/usersDao");
const usersServerCache = require("../models/usersServerCache");
const config = require ("../config.json");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");
const userUtils = require("../utilities/userUtils");
const emailUtils = require("../utilities/emailUtils");


const login = async(userData) =>  {
    // hash the password
    userData.password = createHashPassword(userData.password);

    // callback to dao login function
    let successfullLoginData = await usersDao.login(userData.email, userData.password);

    if (successfullLoginData == undefined){
        next(new ServerError(ErrorType.WRONG_EMAIL_OR_PASSWORD));
    }

    checkIfUserValidated(successfullLoginData.verCode, successfullLoginData.email);
    
    // if usersDao succeeded then start creating token for the user
    const saltedEmail = "gb$tb$!e" + successfullLoginData.email + "#7!7D4@p";

    // creating token from salted username
    const token = jwt.sign({sub:saltedEmail}, config.secret);

    // create user cache to save on server cache
    const userCachedData = {
        email       : userData.email,
        userId      : successfullLoginData.id,
        firstName   : successfullLoginData.firstName,
        lastName    : successfullLoginData.lastName,
        userName    : successfullLoginData.userName,
        token       : token
    }
    
    // save the user's token and data at server's cache to reach it faster than from DB
    usersServerCache.set(token, userCachedData);

    // create login response to send to the client
    const successfullLoginResponse = {
        token       : token,
        userId      : successfullLoginData.id,
        firstName   : successfullLoginData.firstName,
        lastName    : successfullLoginData.lastName,
        email       : successfullLoginData.email,
        userName    : successfullLoginData.userName
    }
    
    // return successfull login response to usersController
    return successfullLoginResponse;
};


const register = async (userData) => {
    validateUserParmLengths(userData, true);

    // if ID / Email exists return
    let isExist = await usersDao.isUserExists(userData.userName, userData.email);
    if (isExist.length !== 0){
        throw new ServerError(ErrorType.USER_ALREADY_EXISTS);
    }

    let hashedPassword = createHashPassword(userData.password);

    // replace user's password with hashed password
    userData.password = hashedPassword;

    userData.verCode = createVerCode() * 10;

    // callback to usersDao register function and wait for response
    await emailUtils.sendVerificationEmail(userData.email, userData.verCode);
    await usersDao.register(userData);
    return;
}

// Create verCode 5 digits
const createVerCode = () =>{
    return Math.floor(10000 + Math.random() * 90000)
}

// hashing password
const createHashPassword = (password) => {
    let saltedPassword = "a3#&&&2!0loaj" + password + "(%%ge#!fg543f%";
    let hashedPassword = crypto.createHash("md5").update(saltedPassword).digest("hex");

    return hashedPassword;
}

const validateUserParmLengths = (user, isRegister) =>{
    // in any case check password
    if (!isUserPasswordValid(user.password)){
        throw new ServerError(ErrorType.WRONG_FIELD_LENGTHS);
    }
    
    // if register
    if (isRegister){
        if (!isUserEmailValid(user.email)    || 
            user.userName.trim().length > 12 || user.userName.trim().length < 3 ||
            user.firstName.trim().length < 3 || user.firstName.trim().length > 12 ||
            user.lastName.trim().length < 3  || user.lastName.trim().length > 12){
            throw new ServerError(ErrorType.WRONG_FIELD_LENGTHS);
        }
    }
}

// validates email pattern
const isUserEmailValid = (email) =>{
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// validates password pattern
const isUserPasswordValid = (password) =>{
    return  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(password);
}

const isUserExists = async (userDetails) =>{
    let id = userDetails.id;
    let email = userDetails.email;

    // if ID / Email exists return
    let isExist = await usersDao.isUserExists(id, email);

    if (isExist.length !== 0){
        throw new ServerError(ErrorType.USER_ALREADY_EXISTS);
    }
    return;
}


const logOutUser = async (request) =>{
    // log out user by deleting its token from server's cache
    const authorizationString = request.headers["authorization"];
    const token = authorizationString.substring("Bearer ".length);

    usersServerCache.delete(token);
}


const loginWithToken = async (request) =>{
    const authorizationString = request.headers["authorization"];
    const token = authorizationString.substring("Bearer ".length);
    
    const successfullLoginResponse = usersServerCache.get(token);

    if (successfullLoginResponse == undefined){
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }

    return successfullLoginResponse;
}

const checkVerCode = async (request) =>{
    const verCodeToCheck = request.body.verCode;

    if (verCodeToCheck < 10000 || verCodeToCheck > 999999){
        throw new ServerError(ErrorType.INCORRECT_CODE);
    }

    const email = request.body.email;

    let codeFromDb = await usersDao.getUserCodeFromDb(email);
    codeFromDb = codeFromDb[0].Verification_Code;
    
    if (codeFromDb == verCodeToCheck){
        usersDao.insertVerCode(null, email);
        return;
    } else{
        const newVerCode = 10 * createVerCode(); 
        await usersDao.insertVerCode(newVerCode, email);
        emailUtils.sendVerificationEmail(email, newVerCode);

        throw new ServerError(ErrorType.INCORRECT_CODE);
    }
}

const checkIfUserValidated = (verCode, email) =>{
    if (verCode < 1000000 && verCode > 99999){
        emailUtils.sendVerificationEmail(email, verCode);
        throw new ServerError(ErrorType.USER_NOT_VALIDATED);
    }
    if (verCode != undefined){
        usersDao.insertVerCode(verCode, email);
    }
}

const sendResetPassVerCode = async (email) =>{
    if (!isUserEmailValid(email)){
        throw new ServerError(ErrorType.WRONG_FIELD_LENGTHS);
    }

    if (!usersDao.isUserValidated(email)){
        throw new ServerError(ErrorType.USER_NOT_VALIDATED);
    };

    const newVerCode = createVerCode(); 
    await usersDao.insertVerCode(newVerCode, email);
    await emailUtils.sendVerificationEmail(email, newVerCode);
}

const resetPassword = async (request) =>{
    await checkVerCode(request);

    const hashedPassword = createHashPassword(request.body.password);

    usersDao.updatePassword(request.body.email, hashedPassword);
}

module.exports = {
    login, 
    register,
    logOutUser,
    loginWithToken,
    isUserExists,
    checkVerCode,
    sendResetPassVerCode,
    resetPassword
};
