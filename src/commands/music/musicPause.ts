import { QueueConstruct } from '../../API/music';
import { Client, Message } from 'discord.js';

export function run(client: Client, message: Message, args: string[], queue: Map<string, QueueConstruct>)
{
	try
	{
		if(!queue.has(message.guild.id)) return;
		
		let serverQueue = queue.get(message.guild.id);
		
		if(!serverQueue.dispatcher) return;
		
		if(!serverQueue.dispatcher.paused)
		{
			serverQueue.dispatcher.pause();
			message.channel.send(`Pausé **${serverQueue.songs[0].title}**`);
		}
		else serverQueue.dispatcher.resume();
	}
	catch(err)
	{
		if(typeof err === 'string') message.channel.send(err);
		else console.log(err);
	}
}

export const help = 
{
	name: "pause",
	description: "Pause ou recommence la musique en cours",
	usage: "",
	args: false,
	category: 'music'
}

export const information = "music";