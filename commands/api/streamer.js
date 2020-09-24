const { Client, Message, MessageEmbed, Guild } = require("discord.js");
const {Streamer} = require('../../API/twitch.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 * @param {Streamer[]} streamers
 */
exports.run = function(client, message, args, streamers)
{
	switch(args.shift())
	{
		case 'add':
			break;
		case 'remove':
			break;
		case 'list':
			let embed = new MessageEmbed()
				.setColor("#d54e12")
				.setTitle("Liste des streamers :");
			
			streamers.forEach(
				s =>
				{
					embed.addField(s.name, `${s.guild}/${s.channel.name}`, false);
				}
			)
			
			message.channel.send(embed);
			break;
		default:
			message.channel.send('Commandes disponibles :\n\`streamer add <streamer> <salon>\nstreamer remove <streamer 1> <streamer 2> <etc...>\nstreamer list\`')
			break;
	}
}

exports.help = 
{
	name: "streamer",
	description: "Ajoute/retire le streamer donné à la vérification régulière",
	args: 1,
	usage: "streamer <add | remove | list>"
}

exports.information = 'streamers';