const { Client, Message } = require("discord.js");
const {QueueConstruct, Song} = require('../../API/music.js');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');
const {OpusEncoder} = require('@discordjs/opus');

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
			throw `Il n'y a pas de musiques!`;
		else
			serverQueue = queue.get(message.guild.id);
			
		const voiceChannel = message.member.voice.channel;

		if(!voiceChannel) throw `Il faut une être dans un salon vocal pour cette commande @${message.author.username}.`;

		const permissions = voiceChannel.permissionsFor(message.client.user);
		if(!permissions.has('CONNECT') || !permissions.has('SPEAK')) throw `J'ai besoin de la permission de rejoindre et parler dans le salon vocal!`;
		
		serverQueue.voiceChannel = voiceChannel;
		serverQueue.connection = await voiceChannel.join();
		
		/**
		 * @param {Song} song 
		 */
		function play(song)
		{
			console.log(song);
			
			if(!song)
			{
				serverQueue.connection.disconnect();
				queue.delete(message.guild.id);
				return;
			}
			
			try
			{
				serverQueue.dispatcher = serverQueue.connection
					.play(ytdl(song.url, {filter: 'audioonly'}))
					.on('finish',
						() =>
						{
							serverQueue.songs.shift();
							play(serverQueue.songs[0]);
						}
					)
					.on('error', console.error);
				serverQueue.dispatcher.setVolume(serverQueue.volume);
				
				message.channel.send(`Commence à jouer **${song.title}**`);
			}
			catch(err)
			{
				console.log(err);
			}
		}
		
		play(serverQueue.songs[0]);
	}
	catch(err)
	{
		if(typeof err === 'string') message.channel.send(err);
		else console.error(err);
	}
}

exports.help = 
{
	name: "play",
	description: "Joue les musiques stockées dans le salon de l'utilisateur.",
	args: false,
	usage: ""
}

exports.information = 'music';