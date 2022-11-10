const errorHandler = (error, request, response, next) => {
    console.log(error);
    if (error.errorType !== undefined && error.errorType.isShowStackTrace){
        console.log('aaa');
        response.json('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        return;
    }

    response.json(error);
}

module.exports = errorHandler;
