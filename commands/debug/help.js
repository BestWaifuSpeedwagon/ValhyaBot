const { MessageEmbed, MessageAttachment, Client, Message } = require('discord.js');
const {CustomClient} = require('../../main.js');

/**
 * @param {CustomClient} client
 * @param {Message} message
 */
 
exports.run = (client, message) =>
{
	//let embed = new MessageEmbed()
	//	.setColor("#d54e12")
	//	.setTitle("Liste des commandes :");
	
	
	//for(c of client.commands)
	//{
	//	embed.addField(`!vbot ${c[1].help.name}`, `* ${c[1].help.description}`, false);
	//}
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
	
	let str = "";
	for(let category in categories)
	{
		str += `📁 ${category != 'null' ? category : 'misc'}\n`;
		categories[category].forEach(
			c =>
			{
				str += `    💿 !vbot ${category != 'null' ? category+' ' : ''}${c.help.name} ${c.help.usage}\n`;
			}
		)
	}
	
	message.channel.send(str);
}

exports.help = 
{
	name: "help",
	description: "Donne une liste de toutes les commandes",
	usage: "",
	args: false,
	category: null
}