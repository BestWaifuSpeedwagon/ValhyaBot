import { Client, Message } from "discord.js";
import { QueueConstruct, Song } from '../../API/music.js';

import * as ytdl from 'ytdl-core';

export async function run(client: Client, message: Message, args: string[], queue: Map<string, QueueConstruct>)
{
	try
	{
		let serverQueue: QueueConstruct;
		
		if(!queue.has(message.guild.id))
			throw `Il n'y a pas de musiques!`;
		else
			serverQueue = queue.get(message.guild.id);
		
		const voiceChannel = message.member.voice.channel;

		if(!voiceChannel) throw `Il faut une être dans un salon vocal pour cette commande <@${message.author.id}>.`;

		const permissions = voiceChannel.permissionsFor(message.client.user);
		if(!permissions.has('CONNECT') || !permissions.has('SPEAK')) throw `J'ai besoin de la permission de rejoindre et parler dans le salon vocal!`;
		
		serverQueue.voiceChannel = voiceChannel;
		serverQueue.connection = await voiceChannel.join();
		
		function play(song: Song)
		{
			if(!song)
			{
				serverQueue.connection.disconnect();
				queue.delete(message.guild.id);
				return;
			}
			
			try
			{
				serverQueue.dispatcher = serverQueue.connection
					.play(song.type === 'youtube' ? ytdl(song.url, {
						filter: 'audioonly',
						quality: 'highestaudio',
						highWaterMark: 1 << 25
					}) : song.url)
					.on('finish',
						() =>
						{
							serverQueue.songs.shift();
							play(serverQueue.songs[0]);
						}
					)
					.on('error', console.error);
				serverQueue.dispatcher.setVolumeLogarithmic(serverQueue.volume);
				
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

export const help = 
{
	name: "play",
	description: "Joue les musiques stockées dans le salon de l'utilisateur.",
	args: false,
	usage: "",
	category: 'music'
}

export const information = 'music';