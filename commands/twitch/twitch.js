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
		path: '/helix/streams?users?login=valhyan',
		headers:
		{
			'Client-ID': config.twitchID
		}
	};
	
	let req = http.get(options, 
		res =>
		{
			console.log(res.headers);
			
			//console.log(res);
		}
	);
	
	req.on('error', 
		e =>
		{
			console.log(`Error: ${e}`);
		}
	);
	
	req.on('response',
		res =>
		{
			console.log(res);
		}
	)
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
