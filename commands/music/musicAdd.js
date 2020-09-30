const { Client, Message } = require("discord.js");
const {QueueConstruct, Song, searchQuery, playlistQuery} = require('../../API/music.js');
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
		/** @type {QueueConstruct} */
		let serverQueue;

		if(!queue.has(message.guild.id))
		{
			serverQueue = new QueueConstruct(1);
			queue.set(message.guild.id, serverQueue);
		}
		else serverQueue = queue.get(message.guild.id);
		
		/** @type {('youtube'|'playlist'|'discord')} */
		let type;
		let s = args.join(' ');
		
		if(/((youtube\.com)|(youtu\.be))\//.test(s))
		{
			if(/&list/.test(s)) type = 'playlist';
			else type = 'youtube'
		}
		else if(message.attachments.size > 0) ///cdn\.discordapp\.com\/attachments\//.test(s)
			type = 'discord';
		else
			type = 'text';
		
		/** @type {Song} */
		let push;
		/** @type {Song[]} */
		let arrayPush = [];
		let videoTitle = '';
		switch(type)
		{
			case 'youtube':
			{
				const video = await ytdl.getInfo(s);
				push = new Song('youtube', video.videoDetails.title, video.videoDetails.video_url);
				videoTitle = video.videoDetails.title;
				break;
			}
			case 'discord':
			{
				const video = message.attachments.first()
				push = new Song('discord', video.name, video.url);
				videoTitle = video.name;
				break;
			}
			case 'playlist':
				const playlist = await playlistQuery(s.match(/&list=(.*)?/)[1]);
				videoTitle = `Playlist: ${playlist.items[0].snippet.title}...`;
				
				playlist.items.forEach(
					item =>
					{
						arrayPush.push(new Song('youtube', item.snippet.title, item.id.videoId));
					}
				);
				break;
			default: //Plain text || youtube search
			{
				const video = (await searchQuery(s)).items[0];
				push = new Song('youtube', decodeURI(video.snippet.title), video.id.videoId);
				videoTitle = video.snippet.title;
				break;
			}
		}
		
		if(push) serverQueue.songs = [...serverQueue.songs, push];
		if(arrayPush) serverQueue.songs = [...serverQueue.songs, ...arrayPush];
		message.channel.send(`Ajouté **${videoTitle}** à la liste.`);
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
	usage: "<Youtube URL | Youtube playlist | text>",
	args: 1
}

exports.information = 'music';