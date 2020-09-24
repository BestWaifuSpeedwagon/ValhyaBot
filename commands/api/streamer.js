const { Client, Message, MessageEmbed, Guild } = require("discord.js");
const {Streamer, getUserId} = require('../../API/twitch.js');
const fs = require('fs');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 * @param {Streamer[]} streamers
 */
exports.run = async function(client, message, args, streamers)
{
	switch(args.shift())
	{
		case 'add':
			//Si pas assez d'arguments sont donnés
			if(args.length < 2) return message.channel.send(`Utilisation : \`!streamer add <streamer> <salon>\``);	
			//Si l'utilisateur existe déjà
			if(streamers.some(s => s.name === args[0])) return message.channel.send(`L'utilisateur existe déjà!`);
			
			//Obtenir l'id utilisateur twitch
			let user = await getUserId(args[0]);
			//Si l'utilisateur n'existe pas
			if(user._total === 0) return message.channel.send(`${args[0]} n'existe pas!`)
			
			//Obtiens le salon
			let channel = message.guild.channels.cache.find(c => c.name === args[1]);
			
			//Si le salon n'existe pas ou n'est pas textuel
			if(channel === undefined || channel.type !== 'text') return message.channel.send(`Salon textuel requis.`);
			
			//Ajoute le streamer
			streamers.push(new Streamer(args[0], channel, message.guild.id, message.guild.name, user.users[0]._id));
			message.channel.send(`Ajouté ${args[0]} à la liste des streamers vérifiés, dans le salon ${message.guild.name}/${args[1]}`);
			
			//Écris le au fichier
			fs.writeFile("./data/streamers.json", JSON.stringify(streamers, null, 4), e => { if(e) console.log(e); });
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