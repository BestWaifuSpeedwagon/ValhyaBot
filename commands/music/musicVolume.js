const {QueueConstruct} = require('../../API/music.js');
const {Client, Message} = require('discord.js');

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
		if(!queue.has(message.guild.id)) throw new Error('Guild not assigned');
		
		let serverQueue = queue.get(message.guild.id);
		
		serverQueue.volume = Math.min(1, parseInt(args[0])/100);
		
		if(serverQueue.dispatcher) serverQueue.dispatcher.setVolume(serverQueue.volume);
	}
	catch(err)
	{
		if(typeof err === 'string') message.channel.send(err);
		else console.log(err);
	}
}

exports.help = 
{
	name: "volume",
	description: "Change le volume de la musique, de 0 à 100",
	usage: "<volume>",
	args: true,
	category: 'music'
}

exports.information = "music";