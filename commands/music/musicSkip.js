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
		
		if(args)
		{
			serverQueue.songs.splice(0, parseInt(args[0])-2);
			
		}
		
		if(!serverQueue.dispatcher)
		{
			serverQueue.songs.shift();
			
			let str = '';
			if(serverQueue.songs) str = `Passé à **${serverQueue.songs[0].title}**`;
			else str = `Passé toutes les musiques.`;
			
			message.channel.send(str);
		}
		else
		{
			let str = '';
			if(serverQueue.songs.length > 1) str = `Passé à **${serverQueue.songs[1].title}**`;
			else str = `Passé toutes les musiques.`;
			
			message.channel.send(str);
			serverQueue.dispatcher.emit('finish');
		}
	}
	catch(err)
	{
		if(typeof err === 'string') message.channel.send(err);
		else console.log(err);
	}
}

exports.help = 
{
	name: "skip",
	description: "Passe à la prochaine musique dans la liste",
	usage: "<numéro de la musique>",
	args: 1
}

exports.information = "music";