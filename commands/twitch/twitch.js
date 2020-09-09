const http = require('http');
const { Client, Message } = require('discord.js');
const config = require('../../config.json');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

 
module.exports.run = function(client, message)
{
	let options =
	{
		hostname: 'api.twitch.tv',
		path: '/kraken/users?login=Valhyan',
		headers:
		{
			'Client-ID': 'ztougvca0l7zhxzq0wae55s3an0ljk',
			'Accept': 'application/vnd.twitchtv.v5+json'
		}
	};

	let req = http.get(options,
		res =>
		{
			console.log(res.headers);

			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end',
				() =>
				{
					try
					{
						const parsedData = JSON.parse(rawData);
						console.log(parsedData);
					}
					catch (e)
					{
						console.error(e.message);
					}
				}
			);
		}
	);
	
	req.on('error', 
		e =>
		{
			console.log(`Error: ${e}`);
		}
	);
}



module.exports.help = 
{
	name: "twitch",
	description: "Get twitch streams",
	args: false
}

function newFunction(options)
{
	Object.assign(options, { path: '' });
}
