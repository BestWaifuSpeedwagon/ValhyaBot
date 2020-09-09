const http = require('https');
const { Client, Message } = require('discord.js');
const config = require('../../config.json');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

 
module.exports.run = function(client, message)
{
	//
	let options =
	{
		hostname: 'api.twitch.tv',
		path: '/kraken/streams/45788228',
		headers:
		{
			'Client-ID': config.twitchID,
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
					let parsedData = JSON.parse(rawData);
					
					console.log(parsedData);
					
					if(parsedData.stream == null) return message.channel.send("Valhyan n'est pas en ligne!");
					
					return message.channel.send("Valhyan est en ligne! Venez voir le roi du choo choo \nhttps://www.twitch.tv/Valhyan");
					client.user.setActivity(`${client.user.presence.activities[0].name}`, { type: "STREAMING", url: "https://www.twitch.tv/Valhyan" });
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
