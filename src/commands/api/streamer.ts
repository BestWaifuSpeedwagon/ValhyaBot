import { Client, Message, MessageEmbed, Guild, TextChannel } from "discord.js";
import { getUser } from '../../API/twitch';
import { Streamer } from '../../main';
import { Client as FaunaClient, query as q} from 'faunadb';

export async function run(client: Client, message: Message, args: string[], [streamers, faunaClient]: [ Streamer[], FaunaClient ])
{
	switch(args.shift())
	{
		case 'add':
			//Si pas assez d'arguments sont donnés
			if(args.length % 2 !== 0) return message.channel.send(`Le nombre d'éléments doit être paires : \`!streamer add <streamer> <salon> <streamer> <salon>...\``);
			
			for(let i = 0; i < args.length; i+=2)
			{
				let name = args[i];
				let channelName = args[i+1];
				
				try
				{
					//Si l'utilisateur existe déjà
					if(streamers.some(s => s.data.user.display_name === name)) throw `${name} est déjà dans la liste!`;
					
					//Obtenir l'id utilisateur twitch
					let user = await getUser(name);
					//Si l'utilisateur n'existe pas
					if(user === undefined) throw `${name} n'existe pas!`;

					//Obtiens le salon
					let channel = message.guild.channels.cache.find(c => c.name === channelName) as TextChannel;

					//Si le salon n'existe pas ou n'est pas textuel
					if(channel === undefined || channel.type !== 'text') throw `Salon textuel requis.`;
					
					//Créer le streamer
					let streamer: Streamer = await faunaClient.query(
						q.Create(
							q.Collection("streamers"),
							{
								data:
								{
									user: user,
									channelId: channel.id,
									streaming: false
								}
							}
						)
					);
					
					streamers.push(streamer);
					message.channel.send(`Ajouté **${name}** à la liste des streamers vérifiés, dans le salon **${message.guild.name}/${channelName}**`);
				}
				catch(err)
				{
					message.channel.send(err);
					continue;
				}
			}
			break;
		case 'remove':
			let removed = `Retiré`;
		
			//Vérifie pour chaque argument
			args.forEach(
				(a, i) =>
				{
					let _index = streamers.findIndex(s => s.data.user.display_name === a);
					if(_index === -1) return;
					
					removed += `${args.length > 1 ? ( i === args.length-1 ? ' et' : ',' ) : ''} ${a}`;
					
					faunaClient.query(
						q.Delete( streamers[_index].ref )
					);
					
					streamers.splice(_index, 1);
				}
			);
			message.channel.send(removed + '.');
			break;
		case 'list':
			let embed = new MessageEmbed()
				.setColor("#353535")
				.setTitle("Liste des streamers :");
			
			streamers.forEach(
				s =>
				{
					embed.addField(s.data.user.display_name, `${s.data.streaming ? "Est en ligne !": "N'est pas en ligne"}`, false);
				}
			);
			
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

export const information = ['streamers', 'faunaClient'];