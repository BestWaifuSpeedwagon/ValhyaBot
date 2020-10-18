import { Client, Message } from "discord.js";
import {UserLevel} from '../../main';
import { writeFile } from 'fs';

export function run(client: Client, message: Message, args: string[], database: { [s: string]: UserLevel; })
{
	database[message.author.tag].notification = !database[message.author.tag].notification;
	
	message.channel.send(`Vos notifications ont étés ${database[message.author.tag].notification ? 'activées' : 'désactivées'}!`);
	
	writeFile("dist/data/level.json", JSON.stringify(database, null, 4), e => { if(e) console.log(e) });
}

export const help = 
{
	name: "notification",
	description: "Active/désactive les notifications de niveau pour l'utilisateur.",
	usage: "",
	args: false,
	category: 'level'
};

export const information = "database";