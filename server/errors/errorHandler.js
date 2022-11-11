const errorHandler = (error, request, response, next) => {
    console.log(error);
    if (error.errorType !== undefined && error.errorType.isShowStackTrace){
        response.status(501).json({message: 'TESTTESTTEST'});
        return;
    }
    
    response.status(700).json({message: 'GENERAL ERROR OCCURED'});
}

module.exports = errorHandler;
