import { Client, Message } from 'discord.js';

export function run(client: Client, message: Message, args: string[])
{
	if(!message.member.permissions.has('ADMINISTRATOR') || message.author.username !== 'davawen') return message.channel.send("Vous n'avez pas la permission!");
	
	switch(args[0])
	{
		default:
			message.channel.send("Aucune commande disponible pour l'instant");
			break;
	}
}

export const help = 
{
	name: "debug",
	description: "Change l'état du bot",
	usage: "<commande>",
	args: false,
	category: null
}