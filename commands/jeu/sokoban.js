const { Client, Message } = require("discord.js");

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

exports.run = async function(client, message)
{
	class Vector
	{
		constructor(x, y)
		{
			this.x = x;
			this.y = y;
		}
	}
	
	function renderGrid(position)
	{
		let str = "";

		for(i = 0; i < 10; i++)
		{
			for(j = 0; j < 10; j++)
			{
				if(position.x === i && position.y === j) str += "🟩";
				else str += "🔲";
			}
			str += "\n"
		}
		return str;
	}
	
	let position = new Vector(4, 4);
	
	let grid = await message.channel.send(renderGrid(position));

	await grid.react('⬅️');
	await grid.react('➡️');
	await grid.react('⬆️');
	await grid.react('⬇️');
	
	
	const filter = function(reaction, user)
	{
		return ['⬅️', '➡️', '⬆️', '⬇️'].includes(reaction.emoji.name) && user.id === message.author.id;
	}
	
	//grid.awaitReactions()
}

exports.help = 
{
	name: "sokoban",
	description: "Créer une partie de sokoban",
	args: false
}