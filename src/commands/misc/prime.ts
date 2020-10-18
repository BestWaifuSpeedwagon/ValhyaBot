import { Client, Message } from "discord.js";

export function run(client: Client, message: Message, args: string[])
{
	let n = parseFloat(args[0]);
	
	let nSqr = Math.sqrt(n);

	for (let i = 2; i <= nSqr; i++)
	{
		if (n % i == 0) return message.channel.send(`${n} n'est pas un nombre primaire !`);
	}

	message.channel.send(`${n} est un nombre primaire !`);
}

export const help = 
{
	name: "prime",
	description: "Voit si un nombre est primaire",
	usage: "<nombre>",
	args: true,
	category: null
}