const https = require('https');

function getFreeGames()
{
    return new Promise(
        (resolve, reject) =>
        {
            https.get('https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=fr-FR&country=IN&allowCountries=IN',
                res =>
                {
                    let rawData = "";

                    res.on('data', chunk => rawData += chunk);

                    res.on('end',
                        () =>
                        {
                            let parsedData = JSON.parse(rawData);
                            resolve(parsedData);
                        }
                    );
                })
        }
    )
}

exports.getFreeGames = getFreeGames;