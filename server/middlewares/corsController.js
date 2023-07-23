const handleCors = (server) =>{
    server.get('/', (req,res) => {
        res.sendFile(path.join(__dirname, './build'));
    });
    
    server.get('/home', (req,res) => {
        res.redirect('https://gamerank.adarabadian.com/');
    });
    
    server.get('/gameboard', (req,res) => {
        res.redirect('https://gamerank.adarabadian.com/');
    });
    
    server.get('/login', (req,res) => {
        res.redirect('https://gamerank.adarabadian.com/');
    });
    
    server.get('/register', (req,res) => {
        res.redirect('https://gamerank.adarabadian.com/');
    });
    
    server.get('/game/:game', (req,res) => {
        res.redirect('https://gamerank.adarabadian.com/');
    });
    
    server.get('/rankgame', (req,res) => {
        res.redirect('https://gamerank.adarabadian.com/');
    });
    
    server.get('/emailvalidation', (req,res) => {
        res.redirect('https://gamerank.adarabadian.com/');
    });
    
    server.get('/checkout-complete', (req,res) => {
        res.redirect('https://gamerank.adarabadian.com/');
    });
    
    server.get('/resetpassword', (req,res) => {
        res.redirect('https://gamerank.adarabadian.com/');
    });
    
    server.get('/resetpasswordconfirmation', (req,res) => {
        res.redirect('https://gamerank.adarabadian.com/');
    });

    server.get('/Game/*', (req,res) => {
        res.redirect('https://gamerank.adarabadian.com/');
    });
}

module.exports = {
    handleCors
};