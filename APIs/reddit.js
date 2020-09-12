const https = require('https');

function getSubData(sub)
{
	https.get(`https://www.reddit.com/r/${sub}/hot.json`,
		res =>
		{
			let rawData = "";
			
			res.on('data', chunk => rawData+=chunk);
			
			res.on('end',
				() =>
				{
					let parsedData = JSON.parse(rawData);
					console.log(parsedData.data.children[0]);
				}
			);
		}
	);
}

exports.getSubData = getSubData;