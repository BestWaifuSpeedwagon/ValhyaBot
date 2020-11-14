import { Client, Message } from "discord.js";
import { QueueConstruct } from '../../API/music.js';

export function run(client: Client, message: Message, args: string[], [queue]: [Map<string, QueueConstruct>])
{
	if(!queue.has(message.guild.id)) return;
	if(args[0].startsWith('0')) message.channel.send('Ne peux pas retirer le premier élément!');
	
	let serverQueue = queue.get(message.guild.id);
	
	if(!/[0-9]+-[0-9]+/.test(args[0]))
	{
		serverQueue.songs.splice(parseInt(args[0])-1, 1);
	}
	else
	{
		let s: number[];
		
		args[0].split('-').forEach(arg => s.push(parseInt(arg)));
		
		serverQueue.songs.splice(s[0] - 1, s[1] - s[0] + 1);
	}
}

export const help = 
{
	name: "remove",
	description: "Retire le/les éléments donnés de la liste de musique",
	usage: "<nombre | nombre0-nombre1>",
	args: true,
	category: 'music'
}

export const information = ["music"];