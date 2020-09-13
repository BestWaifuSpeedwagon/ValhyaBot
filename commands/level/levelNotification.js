const { Client, Message } = require("discord.js");
const fs = require('fs');

/**
 * @typedef {Object} UserLevel
 * @property {number} xp
 * @property {number} level
 * @property {number} requiredXp
 * @property {boolean} notification
 */

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 * @param {Object.<string, UserLevel>} database
 */
exports.run = function(client, message, args, database)
{
	database[message.author.tag].notification = !database[message.author.tag].notification;
	
	message.channel.send('Vos notifications ont étés désactivées!');
	
	fs.writeFile("./data/database.json", JSON.stringify(database, null, 4), e => { if(e) console.log(e) });
}

exports.help = 
{
	name: "notification",
	description: "Active/désactive les notifications de niveau pour l'utilisateur.",
	args: false,
	usage: ""
}

exports.information = "database"