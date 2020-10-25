const config =
{
	TWITCH_ID: process.env.TWITCH_ID,
	TWITCH_OAUTH: process.env.TWITCH_OAUTH
}

import { get, RequestOptions } from 'https';
import { MessageEmbed, MessageAttachment, TextChannel, Guild } from 'discord.js';

//#region Definitions

export interface TwitchUser
{
	id: string;
	login: string;
	display_name: string;
	type: string;
	broadcaster_type: string;
	description: string;
	profile_image_url: string;
	offline_image_url: string;
	view_count: number;
	email: string;
}

export interface TwitchUserResponse
{
	data: TwitchUser[];
	pagination:
	{
		cursor: string;
	}
}

export interface TwitchStream
{
	id: string;
	user_id: string;
	user_name: string;
	game_id: string;
	type: string;
	title: string;
	viewer_count: number;
	started_at: Date;
	language: string;
	thumbnail_url: string;
}

export interface TwitchStreamResponse
{
	data: TwitchStream[];
	pagination:
	{
		cursor: string;
	}
}

export interface TwitchGame
{
	box_art_url: string;
	id: string;
	name: string;
}

export interface TwitchGameResponse
{
	data: TwitchGame[];
	pagination: 
	{
		cursor: string;
	}
}

//#endregion

export function getUser(name: string): Promise<TwitchUser>
{
	let options: RequestOptions = 
	{
		hostname: 'api.twitch.tv',
		path: `/helix/users?login=${name}`,
		headers:
		{
			'client-id': config.TWITCH_ID,
			'Authorization': `Bearer ${config.TWITCH_OAUTH}`
		}
	}
	
	return new Promise(
		(resolve, reject) =>
		{
			get(options,
				res =>
				{
					res.setEncoding('utf8');
					
					let rawData = '';
					res.on('data', (chunk) => { rawData += chunk });
					res.on('end',
						() =>
						{
							let parsedData: TwitchUserResponse = JSON.parse(rawData);
							
							resolve(parsedData.data[0]);
						}
					);
					
					res.on('error', reject);
				}
			).on('error', reject)
		}
	);
}

export function getGame(id: string): Promise<TwitchGame>
{
	let options: RequestOptions =
	{
		hostname: 'api.twitch.tv',
		path: `/helix/games?id=${id}`,
		headers:
		{
			'client-id': config.TWITCH_ID,
			'Authorization': `Bearer ${config.TWITCH_OAUTH}`
		}
	}
	
	return new Promise(
		(resolve, reject) =>
		{
			get(options,
				res =>
				{
					res.setEncoding('utf8');

					let rawData = '';
					res.on('data', (chunk) => { rawData += chunk; });
					res.on('end',
						() =>
						{
							let parsedData: TwitchGameResponse = JSON.parse(rawData);

							resolve(parsedData.data[0]);
						}
					);

					res.on('error', reject);
				}	
			).on('error', reject)
		}
	)
}

export function getStream(id: string): Promise<TwitchStream>
{
	let options: RequestOptions =
	{
		hostname: 'api.twitch.tv',
		path: `/helix/streams?user_id=${id}`,
		headers:
		{
			'client-id': config.TWITCH_ID,
			'Authorization': `Bearer ${config.TWITCH_OAUTH}`
		}
	};

	return new Promise(
		(resolve, reject) =>
		{
			get(options,
				res =>
				{
					res.setEncoding('utf8');

					let rawData = '';
					res.on('data', (chunk) => { rawData += chunk; });
					res.on('end',
						() =>
						{
							let parsedData: TwitchStreamResponse = JSON.parse(rawData);

							resolve(parsedData.data[0]);
						}
					);

					res.on('error', reject);
				}
			).on('error', reject);
		}
	);
}

export async function twitchEmbed(stream: TwitchStream, user: TwitchUser): Promise<MessageEmbed>
{
	let game = await getGame(stream.game_id);
	
	let embed = new MessageEmbed()
		.setColor("#d54e12")
		.setAuthor(stream.user_name)
		.setTitle(stream.title)
		.setThumbnail(user.profile_image_url)
		.setImage(stream.thumbnail_url + '?' + Math.round(Math.random()*1000).toString())
		.setURL(`https://www.twitch.tv/${stream.user_name}`)
		.addField('Jeu', game.name, true)
		.addField('Viewers', stream.viewer_count)
	
	return embed;
}