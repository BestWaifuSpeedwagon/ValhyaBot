const { MessageEmbed, MessageAttachment, Client, Message } = require('discord.js');
const {CustomClient} = require('../../main.js');

/**
 * @param {CustomClient} client
 * @param {Message} message
 * @param {string[]} args
 */
 
exports.run = (client, message, args) =>
{
	
	//'📁' '💿'
	/** @type {Object.<string, import('main').command[]>} */
	let categories = {};
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

exports.help = 
{
	name: "help",
	description: "Donne une liste de toutes les commandes",
	usage: "<Rien | description>",
	args: false,
	category: null
}