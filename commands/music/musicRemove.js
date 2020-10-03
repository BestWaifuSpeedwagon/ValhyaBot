const { Client, Message } = require("discord.js");
const {QueueConstruct} = require('../../API/music.js');

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 * @param {Map.<string, QueueConstruct>} queue
 */
exports.run = function(client, message, args, queue)
{
	if(!queue.has(message.guild.id)) return;
	if(args[0].startsWith('0')) message.channel.send('Ne peux pas retirer le premier élément!');
	
	let serverQueue = queue.get(message.guild.id);
	
	if(!/[0-9]+-[0-9]+/.test(args[0]))
	{
		serverQueue.songs.splice(parseInt(args[0])-1, 1);
	}
	else
	{
		let s = args[0].split('-');
		serverQueue.songs.splice(parseInt(s[0])-1, s[1]-s[0]+1);
	}
}

exports.help = 
{
	name: "remove",
	description: "Retire le/les éléments donnés de la liste de musique",
	usage: "<nombre | nombre0-nombre1>",
	args: true
}

exports.information = "music";