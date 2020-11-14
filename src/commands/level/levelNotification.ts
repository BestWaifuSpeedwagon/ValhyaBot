import { Client, Message } from "discord.js";
import { Client as FaunaClient, query as q } from 'faunadb';
import { Database } from '../../main';

export function run(client: Client, message: Message, args: string[], [database, faunaClient]: [ Database, FaunaClient ])
{
	let notif = !database[message.author.id].data.notification;
	
	database[message.author.id].data.notification = notif;
	
	message.channel.send(`Vos notifications ont étés ${notif ? 'activées' : 'désactivées'}!`);
	
	faunaClient.query(
		q.Update(
			database[message.author.id].ref,
			{ data: { notification: notif } }
		)
	);
}

export const help = 
{
	name: "notification",
	description: "Active/désactive les notifications de niveau pour l'utilisateur.",
	usage: "",
	args: false,
	category: 'level'
};

export const information = ["database", "faunaClient"];