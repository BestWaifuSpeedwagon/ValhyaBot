const https = require('https');

function getSubData(sub, mode)
{
	return new Promise(
		(resolve, reject) =>
		{
			https.get(`https://www.reddit.com/r/${sub}/${mode}.json`,
				res =>
				{
					let rawData = "";
					
					res.on('data', chunk => rawData+=chunk);
					
					res.on('end',
						() =>
						{
							let parsedData = JSON.parse(rawData);
							resolve(parsedData);
						}
					);
				}
			);
		}
	);
}

exports.getSubData = getSubData;