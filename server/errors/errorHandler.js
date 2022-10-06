const errorHandler = (error, request, response, next) => {
    if (error.errorType !== undefined && error.errorType.isShowStackTrace){
        console.log(error.errorType.message);
        response.status(error.errorType.httpCode).json({error: error.errorType.message});
        return;
    }

    response.status(700).json({error:"A general error has occured!"});
}

module.exports = errorHandler;
