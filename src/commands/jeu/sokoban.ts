import { Client, Message, MessageReaction, User } from "discord.js";

export async function run(client: Client, message: Message)
{
	class Vector
	{
		x: number;
		y: number;
		
		constructor(x: number, y: number)
		{
			this.x = x;
			this.y = y;
		}
		
		set(x: number, y: number): void
		{
			this.x = x;
			this.y = y;
		}
	}
	
	function renderGrid(position: Vector, goal: Vector, score: number)
	{
		let str = `Score : ${score}\n`;

		for(let i = 0; i < 10; i++)
		{
			for(let j = 0; j < 10; j++)
			{
				if(position.x === i && position.y === j) str += "🟩";
				else if(goal.x === i && goal.y === j) str += "🟨";
				else str += "🔲";
			}
			str += "\n";
		}
		return str;
	}
	
	let position = new Vector(4, 4);
	let goal = new Vector(Math.round(Math.random() * 9), Math.round(Math.random() * 9));
	let score = 0;
	
	let grid = await message.channel.send(renderGrid(position, goal, score));
	
	await grid.react('⬅️');
	await grid.react('➡️');
	await grid.react('⬆️');
	await grid.react('⬇️');
	await grid.react('❌');
	
	const filter = function(reaction: MessageReaction, user: User)
	{
		return ['⬅️', '➡️', '⬆️', '⬇️', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
	}
	
	while(true)
	{
		let emoji = await grid.awaitReactions(filter, {time: 2000});
		
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

				
				
			}
		);
		
		if(position.x > 9)
			position.x = 0;
		if(position.x < 0)
			position.x = 9;

		if(position.y > 9)
			position.y = 0;
		if(position.y < 0)
			position.y = 9;
		
		if(goal.x === position.x && goal.y === position.y)
		{
			score++;
			goal.set(Math.round(Math.random() * 9), Math.round(Math.random() * 9));
		}
		
		grid.edit(renderGrid(position, goal, score));
	}
}

export const help = 
{
	name: "sokoban",
	description: "Créer une partie de sokoban",
	usage: "",
	args: false,
	category: 'game'
}