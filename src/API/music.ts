import * as ytdl from 'ytdl-core';

import { VoiceChannel, VoiceConnection, StreamDispatcher } from 'discord.js';

type SongType = 'youtube' | 'discord';

class Song
{
	type: SongType;
	title: string;
	url: string;
	
	constructor(type: SongType, title: string, url: string)
	{
		this.type = type;
		this.title = title;
		this.url = url;
	}
}

class QueueConstruct
{
	volume: number;
	voiceChannel: null | VoiceChannel;
	connection: null | VoiceConnection;
	songs: Song[];
	dispatcher: null | StreamDispatcher
	
	constructor(volume: number)
	{
		this.volume = volume;

		this.voiceChannel = null;
		this.connection = null;
		this.songs = [];
		this.dispatcher = null;
	}
}

import * as https from 'https';
const googleID = process.env.googleID;

interface ItemResponse
{
	kind: string;
	etag: string;
	id: {
		kind: string;
		videoId: string;
	};
	snippet: {
		publishedAt: string;
		channelId: string;
		title: string;
		description: string;
		thumbnails: {
			default: {
				url: string;
				width: number;
				height: number;
			};
			medium: {
				url: string;
				width: number;
				height: number;
			};
			high: {
				url: string;
				width: number;
				height: number;
			};
		};
		channelTitle: string;
		liveBroadcastContent: string;
		publishTime: string;
	};
}

interface QueryResponse
{
	kind: string;
	etag: string;
	nextPageToken: string;
	regionCode: string;
	pageInfo:
	{
		totalResults: number;
		resultsPerPage: number;
	};
	items: ItemResponse[];
}

function searchQuery(search: string): Promise<QueryResponse>
{
	//curl \
	//  'https://www.googleapis.com/youtube/v3/search?maxResults=1&q=my%20salsa&key=[YOUR_API_KEY]' \
	//  --header 'Accept: application/json' \
	//  --compressed
	search = encodeURI(search);
	return new Promise(
		(resolve, reject) =>
		{
			https.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${search}&key=${googleID}`,
				res =>
				{
					let rawData = "";
					res.on('data', chunk => { rawData+=chunk });
					res.on('end',
						() =>
						{
							let parsedData: QueryResponse = JSON.parse(rawData);
							
							resolve(parsedData);
						}
					);
					res.on('error', console.log)
				}
			).on('error', console.log);
		}
	)
}


function playlistQuery(listId: string): Promise<QueryResponse>
{
	//curl \
	//  'https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Csnippet&playlistId=PL7bbiJ1WK8wRUJjxx5OfTpS9BKc2Fg0ky&key=[YOUR_API_KEY]' \
	//  --header 'Accept: application/json' \
	//  --compressed
	
	return new Promise(
		(resolve, reject) =>
		{
			https.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Csnippet&maxResults=20&playlistId=${listId}&key=${googleID}`,
				res =>
				{
					let rawData = "";
					res.on('data', chunk => { rawData+=chunk });
					res.on('end',
						() =>
						{
							let parsedData: QueryResponse = JSON.parse(rawData);
							
							resolve(parsedData);
						}
					);
					res.on('error', console.log);
				}
			).on('error', console.log);
		}
	);
}

export {QueueConstruct, Song, searchQuery, playlistQuery}