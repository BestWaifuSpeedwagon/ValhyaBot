const { MessageEmbed, Client, Message } = require('discord.js');
const reddit = require('../../API/reddit.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 */

exports.run = async function(client, message, args)
{
	//Retourne si les arguments sont faux
	if(!['hot', 'new', 'rising'].includes(args[0])) return;
	
	//Obtiens les données de reddit
	let data = await reddit.getSubData('dankmemes', args[0]);
	
	//Récupère un meme aléatoire
	let meme = data.data.children[Math.floor(Math.random() * data.data.dist)];
	
	let embed = new MessageEmbed()
		.setAuthor(meme.data.author_fullname)
		.setTitle(meme.data.title)
		.setImage(meme.data.url)
		.addField("Score: ", meme.data.score)
		
	message.channel.send(embed);
}

exports.help = 
{
	name: "meme",
	description: "Renvoit les top post de r/dankmemes selon le type donné",
	args: true,
	usage: "<hot | new | rising>",
	category: null
}