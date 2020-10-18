const config =
{
	TOKEN: process.env.TOKEN,
	PREFIX: process.env.PREFIX,
	twitchID: process.env.twitchID
}

import { get } from 'https';
import { MessageEmbed, MessageAttachment, TextChannel, Guild } from 'discord.js';

//#region Definitions

export interface TwitchUser
{
	_id: string;
	bio: string;
	created_at: string;
	display_name: string;
	logo: string;
	name: string;
	type: string;
	updated_at: string;
}

export interface twitchUserResponse
{
	_total: number;
	users: TwitchUser[];
}

export interface TwitchChannel
{
	_id: number;
	broadcaster_language: string;
	created_at: string;
	display_name: string;
	followers: number;
	game: string;
	language: string;
	logo: string;
	mature: boolean;
	name: string;
	partner: boolean;
	profile_banner: string;
	profile_banner_background_color: null;
	status: string;
	updated_at: string;
	url: string;
	video_banner: string;
	views: number;
}

export interface TwitchStream
{
	_id: number;
	average_fps: number;
	created_at: string;
	delay: number;
	game: string;
	is_playlist: boolean;
	video_height: number;
	viewers: number;
	preview: {
		small: string;
		medium: string;
		large: string;
		template: string;
	};
	channel: TwitchChannel;
}

//#endregion

export function getUserId(name: string): Promise<twitchUserResponse>
{
	let options =
	{
		hostname: 'api.twitch.tv',
		path: `/kraken/users?login=${name}`,
		headers:
		{
			'Client-ID': config.twitchID,
			'Accept': 'application/vnd.twitchtv.v5+json'
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
							let parsedData: twitchUserResponse = JSON.parse(rawData);
						
							resolve(parsedData);
						}
					);
					res.on('error', reject);
				}
			).on('error', reject);
		}
	)
}

export function getUserStream(id: string): Promise<TwitchStream>
{
	let options =
	{
		hostname: 'api.twitch.tv',
		path: `/kraken/streams/${id}`,
		headers:
		{
			'Client-ID': config.twitchID,
			'Accept': 'application/vnd.twitchtv.v5+json'
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
							let parsedData: {stream: TwitchStream | null} = JSON.parse(rawData);
							
							//Donne directement le stream
							resolve(parsedData.stream);
						}
					);
				}
			).on('error', e => reject(e));
		}
	);
}

export function twitchEmbed(stream: TwitchStream): MessageEmbed
{
	let embed = new MessageEmbed()
		.setColor("#d54e12")
		.setTitle(`${stream.channel.name} joue à ${stream.game}!`)
		.setThumbnail(stream.channel.logo)
		.setImage(stream.preview.large)
		.setURL(stream.channel.url);
	
	return embed;
}

export class Streamer
{
	name: string;
	id: string;
	channel: TextChannel;
	guildId: string;
	guild: string;
	online: boolean;
	
	/**
	 * 
	 * @param {string} name 
	 * @param {TextChannel} channel
	 * @param {string} guildId
	 * @param {string} guild
	 * @param {string} id
	 */
	
	constructor(name: string, channel: TextChannel, guildId: string, guild: string, id: string)
	{
		this.name = name;
		this.channel = channel;
		this.guildId = guildId;
		this.guild = guild;
		this.id = id;

		this.online = true;
	}
}