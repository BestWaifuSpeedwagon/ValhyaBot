const { QueueConstruct } = require('../../API/music');
const { Client, Message } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 * @param {Map.<string, QueueConstruct>} queue
 */
exports.run = function(client, message, args, queue)
{
	try
	{
		if(!queue.has(message.guild.id)) return;
		
		let serverQueue = queue.get(message.guild.id);
		
		if(!serverQueue.dispatcher) return;
		
		if(!serverQueue.dispatcher.paused) serverQueue.dispatcher.pause();
		else serverQueue.dispatcher.resume();
	}
	catch(err)
	{
		if(typeof err === 'string') message.channel.send(err);
		else console.log(err);
	}
}

exports.help = 
{
	name: "pause",
	description: "Pause ou recommence la musique en cours",
	usage: "",
	args: false
}

exports.information = "music";