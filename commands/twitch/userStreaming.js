const { Client, Message } = require('discord.js');

const twitch = require('../../libraries/twitch.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args
 */

 
module.exports.run = async function(client, message, args)
{
	let stream = (await twitch.getUserStream(args[0])).stream;
	
	switch(stream)
	{
		case undefined:
			message.channel.send(`${args[0]} n'existe pas!`);
			break;
		case null:
			message.channel.send(`${args[0]} n'est pas en ligne!`);
			break;
		default:
			message.channel.send(twitch.twitchEmbed(args[0], stream));
			break;
	}
}

module.exports.help = 
{
	name: "twitch",
	description: "Vérifie si un streamer est en ligne",
	args: true
}