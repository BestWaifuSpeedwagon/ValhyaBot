const { Client, Message } = require("discord.js")

/**
 * 
 * @param {number} n 
 */

function isPrime(n)
{
	let nSqr = Math.sqrt(n);

	for (i = 2; i < nSqr; i++)
	{
		if(n % i == 0) return false;
	}
	return true;
}

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 */

module.exports.run = (client, message, args) =>
{
	let n = parseFloat(args[0]);
	
	if(isPrime(n))
		message.channel.send(n + " est un nombre primare!");
	else
		message.channel.send(n + " n'est pas un nombre primare!");
}

module.exports.help = 
{
	name: "prime",
	description: "Check if a number is prime",
	args: true
}