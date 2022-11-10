const errorHandler = (error, request, response, next) => {
    console.log(error);
    if (error.errorType !== undefined && error.errorType.isShowStackTrace){
        console.log('aaa');
        response.status(error.errorType.httpCode).json({error});
        return;
    }

    response.status(700).json({error});
}

module.exports = errorHandler;
