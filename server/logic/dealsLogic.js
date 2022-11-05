const cheerio = require("cheerio");
const axios = require("axios").default;

const getGameDeals = async (request) =>{
    if (request.query.platform == 'ps'){
        request.query.platform += '5';
    }
    return await scrapeGame(request.query.game, request.query.platform);
}

const scrapeGame = async (gameName, platform) =>{
    const game = gameName + ' ' + platform;
    let url = "https://www.allkeyshop.com/blog/catalogue/search-" + game.replace(/ /g, "+") + "/";
    let html = await fetchHtml(url);
    let $ = cheerio.load(html);

    url = $('html').find('.search-results-row-link')[0].attribs.href;
    let gameId = await getGameId(url);
    
    return await getDealsByGameId(gameId, platform, game);
}

const getPlatforms = async (request) =>{
    const gameName = request.query.gameName;
    let url = "https://www.allkeyshop.com/blog/catalogue/search-" + gameName.replace(/ /g, "+") + "/";
    let html = await fetchHtml(url);
    let $ = cheerio.load(html);

    url = $('html').find('.search-results-row-link')[0].attribs.href;
    let gameFound = $('html').find('.search-results-row-game-title')[0].children[0].data;
    html = await fetchHtml(url);
    $ = cheerio.load(html);
    return getPlatformsAfterSearch($, gameFound);
}

const getPlatformsAfterSearch = async ($, gameFound) =>{
    let platforms = $('html').find('.platforms-link-image');
    let platformsArray = [];

    for (const platform of platforms) {
        let result = {platform : '', gameId : ''};
        result.platform = platform.parent.attribs.title.replace(gameFound + ' ', '');
        result.gameId = await getGameId(platform.parent.attribs.href);
        if (result.gameId != null){
            platformsArray.push(result);
        }
    }
    
    return {platformsArray : platformsArray, gameFound : gameFound};
}

const getGameId = async(url) =>{
    try {
        let html = await fetchHtml(url);
        let $ = cheerio.load(html);
        return $('html').find('.aks-follow-btn-score')[0].attribs['data-product-id'];
    } catch (error) {
        return null;
    }
} 

const getDealsByGameId = async(gameId, platform, gameFound)=>{
    const deals = [];
    let searchUrl = 'https://www.allkeyshop.com/blog/wp-admin/admin-ajax.php?action=get_offers&product=' + gameId + '&currency=eur&region=&edition=&moreq=&use_beta_offers_display=1'; 
    let response = await fetchHtml(searchUrl);
    
    for (const offer of response.offers){
        let deal = {price : '', store : '', link : '', edition : '', platform: ''};

        offer.price.eur.priceWithoutCoupon ? deal.price = offer.price.eur.priceWithoutCoupon : deal.price = offer.price.eur.price;
        deal.store      =   response.merchants[offer.merchant].name;
        deal.link       =   offer.affiliateUrl;
        deal.edition    =   response.editions[offer.edition].name;
        deal.platform   =   platform;
        deal.link       =   deal.link.replace('allkeyshop', '');

        deals.push(deal);
    }
    
    return {deals : deals, gameFound : gameFound};
}

const fetchHtml = async url => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch {
        console.error(
            `ERROR: An error occurred while trying to fetch the URL: ${url}`
        );
    }
};

module.exports = {
    getGameDeals,
    scrapeGame,
    getPlatforms,
    getDealsByGameId
}