const { QueueConstruct } = require('API/music');
const { Client, Message } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 * @param {Map.<string, QueueConstruct} queue
 */
exports.run = function(client, message, args, queue)
{
	
}

exports.help = 
{
	name: "list",
	description: "Donne une liste des musiques qui vont jouer",
	usage: "",
	args: false
}

exports.information = "music";