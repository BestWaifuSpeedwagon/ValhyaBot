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
		if(!queue.has(message.guild.id)) throw `Il n'y a aucune musique dans la liste`;
		
		let serverQueue = queue.get(message.guild.id);
		
		if(serverQueue.dispatcher === null) 
			serverQueue.songs.shift();
		else
			serverQueue.dispatcher.emit('finish');
	}
	catch(err)
	{
		if(typeof err === 'string') message.channel.send(err);
		else console.error(err);
	}
}

exports.help = 
{
	name: "skip",
	description: "Passe à la prochaine musique dans la liste",
	usage: "skip",
	args: false
}

exports.information = "music";