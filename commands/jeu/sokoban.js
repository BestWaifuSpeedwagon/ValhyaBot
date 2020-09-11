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
	await grid.react('❌');
	
	const filter = function(reaction, user)
	{
		return ['⬅️', '➡️', '⬆️', '⬇️', '❌'].includes(reaction._emoji.name) && user.id === message.author.id;
	}
	
	while(true)
	{
		let emoji = await grid.awaitReactions(filter, {time: 2500});
		
		let reaction = grid.reactions.cache.filter(r => r.emoji.name !== '❌' ).filter(r => r.count > 1);
		reaction.forEach(
			r =>
			{
				r.remove();
				grid.react(r.emoji.name);
			}
		)

		emoji.forEach(
			e =>
			{
				if(e.emoji.name === '❌')
				{
					
					grid.channel.send("Sokoban arrêté.");
					return;
				}
				
				switch(e.emoji.name)
				{
					case '⬅️':
						position.y--;
						break;
					case '➡️':
						position.y++;
						break;
					case '⬆️':
						position.x--;
						break;
					case '⬇️':
						position.x++;
						break;
				}

				if(position.x > 9)
					position.x = 0;
				if(position.x < 0)
					position.x = 9;

				if(position.y > 9)
					position.y = 0;
				if(position.y < 0)
					position.y = 9;
			}
		);
		
		grid.edit(renderGrid(position));
	}
}

exports.help = 
{
	name: "sokoban",
	description: "Créer une partie de sokoban",
	args: false
}