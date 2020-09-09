const http = require('https');
const { Client, Message } = require('discord.js');
const config = require('../../config.json');

const twitch = require('../../libraries/twitch.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args
 */

 
module.exports.run = function(client, message, args)
{
	twitch.checkUserLive(message.channel, args[0]);
}

module.exports.help = 
{
	name: "twitch",
	description: "Vérifie si un streamer est en ligne",
	args: true
}