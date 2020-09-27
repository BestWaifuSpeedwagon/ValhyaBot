const { MessageEmbed, MessageAttachment, Client, Message } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 */
 
exports.run = (client, message) =>
{
	let embed = new MessageEmbed()
		.setColor("#d54e12")
		.setTitle("Liste des commandes :");
	
	
	for(c of client.commands)
	{
		embed.addField(`!vbot ${c[1].help.name}`, `* ${c[1].help.description}`, false);
	}
	
	message.channel.send(embed);
}

exports.help = 
{
	name: "help",
	description: "Donne une liste de toutes les commandes",
	args: false
}