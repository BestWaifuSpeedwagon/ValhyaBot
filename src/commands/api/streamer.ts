import { Client, Message, MessageEmbed, Guild, TextChannel } from "discord.js";
import { Streamer, getUserId } from '../../API/twitch.js';
import {writeFile} from 'fs';

export async function run(client: Client, message: Message, args: string[], streamers: Streamer[])
{
	switch(args.shift())
	{
		case 'add':
			//Si pas assez d'arguments sont donnés
			if(args.length % 2 !== 0) return message.channel.send(`Le nombre d'éléments doit être paires : \`!streamer add <streamer> <salon> ...\``);
			
			for(let i = 0; i < args.length; i+=2)
			{
				let name = args[i];
				let channelName = args[i+1];
				
				try
				{
					//Si l'utilisateur existe déjà
					if(streamers.some(s => s.name === name)) throw `${name} est déjà dans la liste!`;

					//Obtenir l'id utilisateur twitch
					let user = await getUserId(name);
					//Si l'utilisateur n'existe pas
					if(user._total === 0) throw `${name} n'existe pas!`;

					//Obtiens le salon
					let channel = message.guild.channels.cache.find(c => c.name === channelName) as TextChannel;

					//Si le salon n'existe pas ou n'est pas textuel
					if(channel === undefined || channel.type !== 'text') throw `Salon textuel requis.`;
					
					//Ajoute le streamer
					streamers.push(new Streamer(name, channel, message.guild.id, message.guild.name, user.users[0]._id));
					message.channel.send(`Ajouté ${name} à la liste des streamers vérifiés, dans le salon ${message.guild.name}/${channelName}`);
				}
				catch(err)
				{
					message.channel.send(err);
					
					continue;
				}
				

			}
			
			//Écris le au fichier
			writeFile("dist/data/streamers.json", JSON.stringify(streamers, null, 4), e => { if(e) console.log(e); });
			break;
		case 'remove':
			let removed = `Retiré`;
		
			//Vérifie pour chaque argument
			args.forEach(
				(a, i) =>
				{
					let _index = streamers.findIndex(s => s.name === a);
					if(_index === -1) return;
					
					removed += `${i === args.length-1 && args.length > 1 ? ' et' : ','} ${streamers.splice(_index, 1)[0].name}`;
				}
			);
			message.channel.send(removed + '.');
			//Écris le nouvelle array au fichier
			writeFile("dist/data/streamers.json", JSON.stringify(streamers, null, 4), e => { if(e) console.log(e); });
			break;
		case 'list':
			let embed = new MessageEmbed()
				.setColor("#d54e12")
				.setTitle("Liste des streamers :");
			
			streamers.forEach(
				s =>
				{
					embed.addField(s.name, `**${s.guild}/${s.channel.name}**\nEn ligne : ${s.online}`, false);
				}
			)
			
			message.channel.send(embed);
			break;
		default:
			message.channel.send('Commandes disponibles :\n\`streamer add <streamer> <salon> <...>\nstreamer remove <streamer 1> <streamer 2> <etc...>\nstreamer list\`')
			break;
	}
}

export const help = 
{
	name: "streamer",
	description: "Ajoute/retire le streamer donné à la vérification régulière",
	args: 1,
	usage: "<add | remove | list>",
	category: 'twitch'
}

export const information = 'streamers';