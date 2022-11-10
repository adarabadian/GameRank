const errorHandler = (error, request, response, next) => {
    console.log(error);
    if (error.errorType !== undefined && error.errorType.isShowStackTrace){
        response.status(error.errorType.httpCode).json({error});
        response.send(error.errorType.message);
        return;
    }
    
    response.status(700);
    response.send('GENERAL ERROR OCCURED');
}

module.exports = errorHandler;
