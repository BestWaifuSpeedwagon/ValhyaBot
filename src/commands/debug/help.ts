import { CustomClient, Command } from "../../main";

import { MessageEmbed, MessageAttachment, Client, Message } from 'discord.js';
 
export function run(client: CustomClient, message: Message, args: string[])
{
	//'📁' '💿'
	let categories: {[key: string]: Command[]} = {};
	
	client.commands.forEach(
		c =>
		{
			if(!categories[c.help.category])
			{
				categories[c.help.category] = [c];
				return;
			}
			
			categories[c.help.category].push(c);
		}
	)
	
	let embed = new MessageEmbed()
		.setColor("#d54e12")
		.setTitle("Liste des commandes :");
	
	
	for(let category in categories)
	{
		let str = "";
		categories[category].forEach(
			c =>
			{
				let extra = '';
				if(args.length > 0)
				{
					switch(args[0].toLowerCase())
					{
						case 'description':
							extra = `| |-${c.help.description}\n`;
							break;
					}
				}
				
				let usage = c.help.usage ? c.help.usage : '';
				str += `|-💿 !vbot ${category != 'null' ? category + ' ' : ''}${c.help.name} ${usage}\n${extra}`;
			}
		);
		embed.addField(`📁 ${category != 'null' ? category : 'misc'}`, str, false);
	}
	
	message.channel.send(embed);
}

export const help = 
{
	name: "help",
	description: "Donne une liste de toutes les commandes",
	usage: "<Rien | description>",
	args: false,
	category: null
}

export const information = [];