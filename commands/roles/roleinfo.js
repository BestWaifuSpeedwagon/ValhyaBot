const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports.run = (client, message, args) =>
{
	const role_mention = message.mentions.roles.first();

	const members = role_mention.members.map(m => m.user);

	/*let embed = new MessageEmbed()
		.setColor("#d54e12")
		.setTitle("Role")*/

	members.forEach(
		m =>
		{
			/*embed.addField(
				{
					name: m.username,
					value: m.avatarURL(),
					inline: false
				}
			)*/

			message.channel.send(m.username, { files: [m.avatarURL()] });
		}
	);

		//message.channel.send(embed);
}

module.exports.help =
{
	name: "roleinfo",
	description: "Renvoie les infos d'un role.",
	usage: "<role>",
	args: true
}