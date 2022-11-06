const errorHandler = (error, request, response, next) => {
    console.log(error);
    if (error.errorType !== undefined && error.errorType.isShowStackTrace){
        response.status(error.errorType.httpCode).send(error.errorType.message);
        return;
    }

    response.status(700).json({error:"A general error has occured!"});
}

module.exports = errorHandler;
