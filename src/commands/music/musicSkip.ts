import { QueueConstruct } from '../../API/music';
import { Client, Message } from 'discord.js';

export function run(client: Client, message: Message, args: string[], [queue]: [Map<string, QueueConstruct>])
{
	try
	{
		if(!queue.has(message.guild.id)) throw `Il n'y a aucune musique dans la liste`;
		
		let serverQueue = queue.get(message.guild.id);
		
		if(args)
		{
			serverQueue.songs.splice(0, parseInt(args[0])-2);
			
		}
		
		if(!serverQueue.dispatcher)
		{
			serverQueue.songs.shift();
			
			let str = '';
			if(serverQueue.songs.length > 0) str = `Passé à **${serverQueue.songs[0].title}**`;
			else
			{
				str = `Passé toutes les musiques.`;
				queue.delete(message.guild.id);
			}

			message.channel.send(str);
		}
		else
		{
			let str = '';
			if(serverQueue.songs.length > 1) str = `Passé à **${serverQueue.songs[1].title}**`;
			else str = `Passé toutes les musiques.`;
			
			message.channel.send(str);
			serverQueue.dispatcher.emit('finish');
		}
	}
	catch(err)
	{
		if(typeof err === 'string') message.channel.send(err);
		else console.log(err);
	}
}

export const help = 
{
	name: "skip",
	description: "Passe à la prochaine musique dans la liste",
	usage: "<numéro de la musique>",
	args: 1,
	category: 'music'
}

export const information = ["music"];