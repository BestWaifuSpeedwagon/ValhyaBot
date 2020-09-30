const config =
{
	TOKEN: process.env.TOKEN,
	PREFIX: process.env.PREFIX,
	twitchID: process.env.twitchID
}

const https = require('https');
const { MessageEmbed, MessageAttachment, TextChannel, Guild } = require('discord.js');

//#region Definitions

/** @typedef {Object} twitchUser
* @property {String} _id
* @property {String} bio
* @property {String} created_at
* @property {String} display_name
* @property {String} logo
* @property {String} name
* @property {String} type
* @property {String} updated_at
*/
 
/** @typedef {Object} twitchUserResponse
* @property {Number} _total
* @property {twitchUser[]} users
*/

/** @typedef {Object} twitchChannel
* @property {Number} _id
* @property {String} broadcaster_language
* @property {String} created_at
* @property {String} display_name
* @property {Number} followers
* @property {String} game
* @property {String} language
* @property {String} logo
* @property {Boolean} mature
* @property {String} name
* @property {Boolean} partner
* @property {String} profile_banner
* @property {Null} profile_banner_background_color
* @property {String} status
* @property {String} updated_at
* @property {String} url
* @property {String} video_banner
* @property {Number} views
*/

/** @typedef {Object} twitchStream
* @property {Number} _id
* @property {Number} average_fps
* @property {String} created_at
* @property {Number} delay
* @property {String} game
* @property {Boolean} is_playlist
* @property {Number} video_height
* @property {Number} viewers
* @property {{small: string, medium: string, large: string, template: string}} preview
* @property {twitchChannel} channel
*/

//#endregion

/**
 * @param {string} name Twitch username
 * @returns {Promise<twitchUserResponse>}
 */

function getUserId(name)
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
			https.get(options,
				res =>
				{
					res.setEncoding('utf8');
					let rawData = '';
					res.on('data', (chunk) => { rawData += chunk; });
					res.on('end',
						() =>
						{
							/** @type {twitchUserResponse} */
							let parsedData = JSON.parse(rawData);
						
							resolve(parsedData);
						}
					);
					res.on('error', reject);
				}
			).on('error', reject);
		}
	)
}

/**
 * 
 * @param {string} id User id
 * @returns {Promise<twitchStream>}
 */

function getUserStream(id)
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
			https.get(options,
				res =>
				{
					res.setEncoding('utf8');

					let rawData = '';
					res.on('data', (chunk) => { rawData += chunk; });

					res.on('end',
						() =>
						{
							parsedData = JSON.parse(rawData);
							
							//Donne directement le stream
							resolve(parsedData.stream);
						}
					);
				}
			).on('error', e => reject(e));
		}
	);
}

/**
 * 
 * @param {object} stream 
 */

function twitchEmbed(stream)
{
	let embed = new MessageEmbed()
		.setColor("#d54e12")
		.setTitle(`${stream.channel.name} joue à ${stream.game}!`)
		.setThumbnail(stream.channel.logo)
		.setImage(stream.preview.large)
		.setURL(stream.channel.url);
	
	return embed;
}

class Streamer
{
	/**
	 * @property {string} name
	 * @property {string} id
	 * @property {TextChannel} channel
	 * @property {string} guildId
	 * @property {string} guild
	 * @property {boolean} online
	 */
	
	/**
	 * 
	 * @param {string} name 
	 * @param {TextChannel} channel
	 * @param {string} guildId
	 * @param {string} guild
	 * @param {string} id
	 */
	
	constructor(name, channel, guildId, guild, id)
	{
		this.name = name;
		this.channel = channel;
		this.guildId = guildId;
		this.guild = guild;
		this.id = id;

		this.online = true;
	}
}

exports.getUserId = getUserId;
exports.getUserStream = getUserStream;
exports.twitchEmbed = twitchEmbed;
exports.Streamer = Streamer;