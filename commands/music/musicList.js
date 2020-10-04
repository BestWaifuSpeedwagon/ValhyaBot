const { QueueConstruct } = require('../../API/music');
const { Client, Message, MessageEmbed } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 * @param {Map.<string, QueueConstruct} queue
 */
exports.run = function(client, message, args, queue)
{
	try
	{
		if(!queue.has(message.guild.id)) throw `Aucune musique n'est dans la liste.`;

		let string = `**Liste de musiques** :\n`;

		queue.get(message.guild.id).songs.forEach(
			(s, index) =>
			{
				string += `**${index+1}** - ${s.title}\n`;
			}
		);

		message.channel.send(string);
	}
	catch(err)
	{
		if(typeof err === 'string') message.channel.send(err);
		else console.error(err);
	}
	
}

exports.help = 
{
	name: "list",
	description: "Donne une liste des musiques qui vont jouer",
	usage: "",
	args: false,
	category: 'music'
}

exports.information = "music";