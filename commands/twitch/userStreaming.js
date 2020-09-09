const config =
{
	TOKEN: process.env.TOKEN,
	PREFIX: process.env.PREFIX,
	twitchID: process.env.twitchID
}

const http = require('https');

const { Client, Message, MessageEmbed } = require('discord.js');

const twitch = require('../../libraries/twitch.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args
 */

 
module.exports.run = async function(client, message, args)
{
	let stream = (await twitch.getUserStream(args[0])).stream;
	
	switch(stream)
	{
		case undefined:
			message.channel.send(`${args[0]} n'existe pas!`);
			break;
		case null:
			message.channel.send(`${args[0]} n'est pas en ligne!`);
			break;
		default:
			let embed = new MessageEmbed()
				.setColor("#d54e12")
				.setTitle(`${args[0]} est en stream!`)
				.setImage(stream.preview.large)
			
			embed.addField('Jeu: ', stream.game);
			embed.addField(args[0].toLowerCase() === 'valhyan' ? 'Venez voir le roi du choo choo' : 'Lien du stream', `https://www.twitch.tv/${args[0]}`);
			
			message.channel.send(embed);
			break;
	}
}

module.exports.help = 
{
	name: "twitch",
	description: "Vérifie si un streamer est en ligne",
	args: true
}