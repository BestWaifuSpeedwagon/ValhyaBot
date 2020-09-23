const { Client, Message } = require("discord.js");

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 * @param {}
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
				
			break;
		default:
			message.channel.send('Commandes disponibles :\n\`streamer add <streamer> <channel>\nstreamer remove <streamer 1> <streamer 2> <etc...>\nstreamer list\`')
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