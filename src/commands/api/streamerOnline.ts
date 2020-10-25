import { Client, Message } from 'discord.js';

import {getStream, getUser, twitchEmbed} from '../../API/twitch';

export async function run(client: Client, message: Message, args: string[])
{
	let user = await getUser(args[0]);
	
	let stream = await getStream(user.id);
	
	switch(stream)
	{
		case undefined:
			message.channel.send(`${args[0]} n'existe pas!`);
			break;
		case null:
			message.channel.send(`${args[0]} n'est pas en ligne!`);
			break;
		default:
			message.channel.send(await twitchEmbed(stream, user));
			break;
	}
}

export const help = 
{
	name: "online",
	description: "Vérifie si un streamer est en ligne",
	args: true,
	usage: "<nom>",
	category: 'twitch',
}