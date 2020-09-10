const { MessageEmbed, MessageAttachment, Client, Message } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 */

module.exports.run = (client, message, args) =>
{
	const role_mention = message.guild.roles.cache.find(role => role.name === args[0].toString());

	const members = role_mention.members.map(m => m.user);

	let embed = new MessageEmbed()
		.setColor("#d54e12")
		.setTitle("Information de rôle")
	
	members.forEach(
		m =>
		{
			embed.addField(m.username, m.avatarURL());
		}
	);
	
	message.channel.send(embed);
}

module.exports.help =
{
	name: "roleinfo",
	description: "Renvoie les infos d'un role.",
	usage: "<role>",
	args: true
}