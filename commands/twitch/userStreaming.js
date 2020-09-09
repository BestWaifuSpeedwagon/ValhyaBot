const http = require('https');
const { Client, Message } = require('discord.js');
const config = require('../../config.json');

const twitch = require('../../libraries/twitch.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args
 */

 
module.exports.run = function(client, message, args)
{
	let stream = twitch.getUserStream(args[0]);
	
	console.log(stream);
	
	if(stream === undefined)
	{
		message.channel.send(`${args[0]} n'existe pas!`)
	}
	else if(stream === null)
	{
		message.channel.send(`${args[0]} n'est pas en ligne!`);
	}
	else
	{
		message.channel.send(`${args[0]} est en ligne et joue à ${stream.game}! ${stream.preview.large}\nVenez voir le roi du choo choo \nhttps://www.twitch.tv/${args[0]}`);
	}
}

module.exports.help = 
{
	name: "twitch",
	description: "Vérifie si un streamer est en ligne",
	args: true
}