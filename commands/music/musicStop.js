const { Client, Message } = require('discord.js');
const {QueueConstruct} = require('../../API/music.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 * @param {Map.<string, QueueConstruct>} queue
 */
exports.run = function(client, message, args, queue)
{
	if(!queue.has(message.guild.id)) return;
	
	let serverQueue = queue.get(message.guild.id);
	
	serverQueue.connection.disconnect();
	serverQueue.connection = null;
	serverQueue.voiceChannel = null;
	
	queue.set(message.guild.id, serverQueue);
}

exports.help = 
{
	name: "stop",
	description: "",
	usage: "",
	args: false
}

exports.information = "music";