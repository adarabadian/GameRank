const errorHandler = (error, request, response, next) => {
    if (error.errorType !== undefined && error.errorType.isShowStackTrace){
        response.status(error.errorType.httpCode).send(error.errorType.message);
        return;
    }
    
    response.status(500).send(error.errorType.message);
}

module.exports = errorHandler;
