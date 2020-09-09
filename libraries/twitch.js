const https = require('https');
const { Message, TextChannel } = require('discord.js');
const config = require('../config.json');

/**
 * 
 * @param {TextChannel} channel
 * @param {string} name 
 */

function checkUserLive(channel, name)
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
					if(parsedData._total === 0) return channel.send(`${name} n'existe pas!`);
					
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

									if (parsedData.stream == null) return channel.send(`${name} n'est pas en ligne!`);

									return channel.send(`${name} est en ligne! Venez voir le roi du choo choo \nhttps://www.twitch.tv/${name}`);
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

exports.checkUserLive = checkUserLive;