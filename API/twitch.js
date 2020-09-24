const config =
{
	TOKEN: process.env.TOKEN,
	PREFIX: process.env.PREFIX,
	twitchID: process.env.twitchID
}

const https = require('https');
const { MessageEmbed, MessageAttachment, TextChannel, Guild } = require('discord.js');

/**
 * 
 * @param {string} name Twitch username
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
							let parsedData = JSON.parse(rawData);


							if (parsedData._total === 0) return undefined;
						
							resolve(parsedData.users[0]._id);
						}
					);
				}
			).on('error', reject);
		}
	);
}

/**
 * 
 * @param {string} id User id
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
			).on('error', reject);
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

		this.online = false;
	}
}

exports.getUserId = getUserId;
exports.getUserStream = getUserStream;
exports.twitchEmbed = twitchEmbed;
exports.Streamer = Streamer;