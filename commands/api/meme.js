const { MessageEmbed, Client, Message } = require('discord.js');
const reddit = require('../../APIs/reddit.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 */

exports.run = async function(client, message, args)
{
	let data = await reddit.getSubData('dankmemes');
	
	let amount = parseInt(args[0]);
	
	for(i = 0; i < amount; i++)
	{
		let meme = data.data.children[i];
		
		let embed = new MessageEmbed()
			.setAuthor(meme.data.author_fullname)
			.setTitle(meme.data.title)
			.setImage(meme.data.url)
			
		message.channel.send(embed);
	}
	
	console.log(data.data.children[0]);
}

exports.help = 
{
	name: "meme",
	description: "Renvoit les top post de r/dankmemes selon le nombre donné",
	args: true,
	usage: "Nombre"
}