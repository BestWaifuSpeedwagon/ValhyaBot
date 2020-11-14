import { Client, Message } from "discord.js";
import { QueueConstruct, Song, searchQuery, playlistQuery } from '../../API/music.js';
import * as ytdl from 'ytdl-core';

export async function run(client: Client, message: Message, args: string[], [queue]: [ Map<string, QueueConstruct> ])
{
	try
	{
		let serverQueue: QueueConstruct;

		if(!queue.has(message.guild.id))
		{
			serverQueue = new QueueConstruct(1);
			queue.set(message.guild.id, serverQueue);
		}
		else serverQueue = queue.get(message.guild.id);
		
		let type: 'youtube' | 'playlist' | 'discord' | 'text';
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
		

		let push: Song;
		let arrayPush: Song[] = [];
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

export const help = 
{
	name: "add",
	description: "Ajoute une musique à la liste.",
	usage: "<URL Youtube | Playlist Youtube | Fichier | Texte>",
	args: 1,
	category: 'music'
}

export const information = ['music'];