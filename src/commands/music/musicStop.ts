import { Client, Message } from 'discord.js';
import { QueueConstruct } from '../../API/music.js';

export function run(client: Client, message: Message, args: string[], queue: Map<string, QueueConstruct>)
{
	if(!queue.has(message.guild.id)) return;
	
	let serverQueue = queue.get(message.guild.id);
	if(!serverQueue.connection) return;
	
	serverQueue.connection.disconnect();
	serverQueue.connection = null;
	serverQueue.dispatcher = null;
	serverQueue.voiceChannel = null;
}

export const help = 
{
	name: "stop",
	description: "Déconnecte le bot du salon vocal.",
	usage: "",
	args: false,
	category: 'music'
}

export const information = "music";