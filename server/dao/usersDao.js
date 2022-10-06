const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");

// function that checks if username already exists
let isUserExists = async (userName, email) => {
    const SQL = `SELECT Username AS userName, Email AS email FROM users WHERE Username =? OR Email =?;`;

    let parameters = [
        userName,
        email
    ];

    try {
        return await connection.executeWithParameters(SQL, parameters);
    }
    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}


// login function
let login = async (usernameORemail, hashedPassword) => {
    
    const SQL = `SELECT 
        ID AS id,
        First_Name AS firstName,
        Last_Name AS lastName,
        Email AS email, 
        Verification_Code AS verCode
        FROM users 
        WHERE (Email=? OR Username =?) AND Password=?;`;

    let parameters = [
        usernameORemail,
        usernameORemail,
        hashedPassword
    ];
    
    try {
        let userLoginResult = await connection.executeWithParameters(SQL, parameters);
        return userLoginResult[0];
    }

    catch(error){
        throw new error;
    }
}


const register = async (userData) => {
    const SQL = "INSERT into users (Username, Email, Password, First_Name, Last_Name, Verification_Code) VALUES ( ?, ?, ?, ?, ?, ?);" ;
    const parameters = [
        userData.userName,
        userData.email,
        userData.password,
        userData.firstName,
        userData.lastName,
        userData.verCode
    ];
    
    try {
        let executionResult = await connection.executeWithParameters(SQL, parameters);
        return(executionResult);
    }

    catch(error){
        throw new error;
    }
}


let getUserCodeFromDb = async (email) => {
    let SQL = "SELECT Verification_Code FROM users WHERE Email = ? OR Username = ?;" 
    
    let parameters = [
        email,
        email
    ];
    
    try {
        let executionResult = await connection.executeWithParameters(SQL, parameters);
        return(executionResult);
    }

    catch(error){
        throw new error;
    }
}

const insertVerCode = async (verCode, email) =>{
    let SQL = "UPDATE users SET Verification_Code = ? WHERE Email = ? OR UserName = ?;";
    
    let parameters = [
        verCode,
        email,
        email
    ];
    
    try {
        let executionResult = await connection.executeWithParameters(SQL, parameters);
        return(executionResult);
    }

    catch(error){
        throw new error;
    }
}


const isUserValidated = async (email) =>{
    const SQL = `SELECT Verification_Code AS verCode
        FROM users 
        WHERE Email=?;`;

    let parameters = [
        email
    ];
    
    try {
        let verCode = await connection.executeWithParameters(SQL, parameters);
        return (verCode[0] == undefined);
    }

    catch(error){
        throw new error;
    }
}

const updatePassword = async (email, password) =>{
    let SQL = "UPDATE users SET Verification_Code = null, password = ? WHERE Email = ?;";
    
    let parameters = [
        password,
        email
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
    login,
    register,
    isUserExists,
    getUserCodeFromDb,
    insertVerCode,
    isUserValidated,
    updatePassword,

};