import { QueueConstruct } from '../../API/music';
import { Client, Message, MessageEmbed } from 'discord.js';

export function run(client: Client, message: Message, args: string[], queue: Map<string, QueueConstruct>)
{
	try
	{
		if(!queue.has(message.guild.id)) throw `Aucune musique n'est dans la liste.`;

		let string = `**Liste de musiques** :\n`;

		queue.get(message.guild.id).songs.forEach(
			(s, index) =>
			{
				string += `**${index+1}** - ${s.title}\n`;
			}
		);

		message.channel.send(string);
	}
	catch(err)
	{
		if(typeof err === 'string') message.channel.send(err);
		else console.error(err);
	}
	
}

export const help = 
{
	name: "list",
	description: "Donne la liste des musiques qui vont jouer",
	usage: "",
	args: false,
	category: 'music'
}

export const information = "music";