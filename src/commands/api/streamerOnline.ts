import { Client, Message } from 'discord.js';

import {getUserId, getUserStream, twitchEmbed} from '../../API/twitch';

export async function run(client: Client, message: Message, args: string[])
{
	let _id = await getUserId(args[0]);
	
	let stream = await getUserStream(_id.users[0]._id);
	
	switch(stream)
	{
		case undefined:
			message.channel.send(`${args[0]} n'existe pas!`);
			break;
		case null:
			message.channel.send(`${args[0]} n'est pas en ligne!`);
			break;
		default:
			message.channel.send(twitchEmbed(stream));
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