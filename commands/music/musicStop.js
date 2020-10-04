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
	if(!serverQueue.connection) return;
	
	serverQueue.connection.disconnect();
	serverQueue.connection = null;
	serverQueue.dispatcher = null;
	serverQueue.voiceChannel = null;
}

exports.help = 
{
	name: "stop",
	description: "Déconnecte le bot du salon vocal.",
	usage: "",
	args: false,
	category: 'music'
}

exports.information = "music";