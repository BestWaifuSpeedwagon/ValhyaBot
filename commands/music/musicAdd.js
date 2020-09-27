const { Client, Message } = require("discord.js");
const {QueueConstruct, Song} = require('../../API/music.js');
const ytdl = require('ytdl-core');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 * @param {Map.<string, QueueConstruct>} queue
 */
exports.run = async function(client, message, args, queue)
{
	try
	{
		if(!/https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9-_]{11}/.test(args[0])) throw 'URL youtube non valide!';
		
		/** @type {QueueConstruct} */
		let serverQueue;
		
		if(!queue.has(message.guild.id))
			serverQueue = new QueueConstruct(1);
		else
			serverQueue = queue.get(message.guild.id);
		
		const video = await ytdl.getInfo(args[0]);
		
		serverQueue.songs.push(new Song(video.videoDetails.title, video.videoDetails.video_url));
		message.channel.send(`Ajouté ${video.videoDetails.title} à la liste.`);
		
		queue.set(message.guild.id, serverQueue);
	}
	catch(err)
	{
		if(typeof err === 'string') message.channel.send(err);
		else console.log(err);
	}
}

exports.help = 
{
	name: "music",
	description: "Joue la vidéo donnée dans le salon de l'utilisateur.",
	usage: "<url youtube>",
	args: true
}

exports.information = 'music';