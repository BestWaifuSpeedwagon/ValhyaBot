const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports.run = (client, message) =>
{
	let embed = new MessageEmbed()
		.setColor("#d54e12")
		.setTitle("Liste des commandes :");
	
	
		
	for(c of client.commands)
	{
		embed.addFields(
			{
				name: `!vbot ${c[1].help.name}`,
				value: c[1].help.description,
				inline: false
			}
		);
	}
	
	message.channel.send(embed);
}

module.exports.help = 
{
	name: "help",
	description: "Donne une liste de toutes les commandes",
	args: false
}