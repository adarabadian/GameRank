const errorHandler = (error, request, response, next) => {
    if (error.errorType !== undefined && error.errorType.isShowStackTrace){
        response.status(error.errorType.httpCode).json({message: error.errorType.message});
        return;
    }
    
    response.status(500).json({message: 'GENERAL ERROR OCCURED'});
}

module.exports = errorHandler;
