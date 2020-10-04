const { Client, Message } = require("discord.js")

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 */

exports.run = (client, message, args) =>
{
	let n = parseFloat(args[0]);
	
	let nSqr = Math.sqrt(n);

	for (i = 2; i <= nSqr; i++)
	{
		if (n % i == 0) return message.channel.send(`${n} n'est pas un nombre primaire !`);
	}

	message.channel.send(`${n} est un nombre primaire !`);
}

exports.help = 
{
	name: "prime",
	description: "Voit si un nombre est primaire",
	usage: "",
	args: true,
	category: null
}