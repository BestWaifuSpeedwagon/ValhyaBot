const https = require('https');
const { Client, Message } = require('discord.js');
const config = require(`${__dirname}/config.json`);

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} name 
 */

function userRequest(client, message, name)
{
	let options =
	{
		hostname: 'api.twitch.tv',
		path: `/kraken/users?login=${name[0]}`,
		headers:
		{
			'Client-ID': config.twitchID,
			'Accept': 'application/vnd.twitchtv.v5+json'
		}
	};
	
	const id;
	
	let req = https.get(options,
		res =>
		{
			console.log(res.headers);

			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end',
				() =>
				{
					let parsedData = JSON.parse(rawData);
					
					console.log(parsedData);
					
					
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
	
	req.on('end',
		() =>
		{
			req = https.get(options,
				res =>
				{
					if (parsedData.stream == null) return message.channel.send("Valhyan n'est pas en ligne!");

					return message.channel.send("Valhyan est en ligne! Venez voir le roi du choo choo \nhttps://www.twitch.tv/Valhyan");
				}
			);

			req.on('error',
				e =>
				{
					console.log(`Error: ${e}`);
				}
			);
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
