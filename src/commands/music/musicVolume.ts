import { QueueConstruct } from '../../API/music.js';
import { Client, Message } from 'discord.js';

export function run(client: Client, message: Message, args: string[], [queue]: [Map<string, QueueConstruct>])
{
	try
	{
		if(!queue.has(message.guild.id)) throw new Error('Guild not assigned');
		
		let serverQueue = queue.get(message.guild.id);
		
		serverQueue.volume = Math.min(1, parseInt(args[0])/100);
		
		if(serverQueue.dispatcher) serverQueue.dispatcher.setVolumeLogarithmic(serverQueue.volume);
	}
	catch(err)
	{
		if(typeof err === 'string') message.channel.send(err);
		else console.log(err);
	}
}

export const help = 
{
	name: "volume",
	description: "Change le volume de la musique, de 0 à 100",
	usage: "<volume>",
	args: true,
	category: 'music'
}

export const information = ["music"];