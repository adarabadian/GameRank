const express = require("express");
const router = express.Router();
const usersLogic = require("../logic/usersLogic");

router.post("/login", async(request, response, next) => {
    let userData = request.body;
    userData.email = userData.userName;
    try{
        // callback for userLogic > login function
        let successfullLoginData = await usersLogic.login(userData);

        // return successfullLoginData
        response.json(successfullLoginData);
    }
    catch(error){
        next(error);
    }
});

router.post("/", async(request, response, next) => {
    const userData = request.body;
    
    try{
        // callback for userLogic > register function
        let successfullLoginData = await usersLogic.register(userData);

        // return successfullLoginData
        response.json(successfullLoginData);
    }
    catch(error){
        next(error);
    }
});


router.post("/isUserExists", async(request, response, next) => {
    const userDetails= request.body;
    
    try{
        // callback for userLogic > check if username already taken function
        let result = await usersLogic.isUserExists(userDetails);

        // return result gotted from userslogic
        response.json(result);
    }
    catch(error){
        next(error);
    }
});

router.post("/logOutUser", async(request, response, next) => {
    try{
        // callback for userLogic > log out user
        await usersLogic.logOutUser(request);

        // return 
        response.json();
    }
    catch(error){
        next(error);
    }
});

router.post("/logUserWithToken", async(request, response, next) => {
    try{
        // callback for userLogic > log user in with token
        let successfullLoginData = await usersLogic.loginWithToken(request);
     
        // return successfullLoginData
        response.json(successfullLoginData);
    }
    catch(error){
        next(error);
    }
});

router.post("/checkVerCode", async(request, response, next) => {
    try{
        // callback for userLogic > checkVerCode
        let result = await usersLogic.checkVerCode(request);
        
        // return user's address
        response.json(result);
    }
    catch(error){
        next(error);
    }
});

router.post("/sendResetPassVerCode", async(request, response, next) => {
    try{
        // callback for userLogic > login function
        await usersLogic.sendResetPassVerCode(request.body.email);
        response.json();
    }
    catch(error){
        next(error);
    }
});

router.post("/resetPassword", async(request, response, next) => {
    try{
        // callback for userLogic > resetPassword function
        await usersLogic.resetPassword(request);
        response.json();
    }
    catch(error){
        next(error);
    }
});

module.exports = router;
