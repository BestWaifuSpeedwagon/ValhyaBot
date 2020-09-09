const https = require('https');
const config = require('../config.json');

/**
 * 
 * @param {string} name 
 */

function getUserStream(name)
{
	let options =
	{
		hostname: 'api.twitch.tv',
		path: `/kraken/users?login=${name}`,
		headers:
		{
			'Client-ID': config.twitchID,
			'Accept': 'application/vnd.twitchtv.v5+json'
		}
	};
	
	let req = https.get(options,
		res =>
		{
			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end',
				() =>
				{
					let parsedData = JSON.parse(rawData);
					
					
					if(parsedData._total === 0) return undefined;
					
					const id = parsedData.users[0]._id;
					
					options.path = `/kraken/streams/${id}`;

					https.get(options,
						res =>
						{
							res.setEncoding('utf8');

							let rawData = '';
							res.on('data', (chunk) => { rawData += chunk; });

							res.on('end',
								() =>
								{
									parsedData = JSON.parse(rawData);
									
									console.log(parsedData);
									
									return parsedData;
								}
							);
						}
					).on('error', console.log);
				}
			);
		}
	).on('error', console.log);
	
	req.on('finished',
		() =>
		{
			

			newReq.on('error',
				e =>
				{
					console.log(`Error: ${e}`);
				}
			);
		}
	);
}

exports.getUserStream = getUserStream;