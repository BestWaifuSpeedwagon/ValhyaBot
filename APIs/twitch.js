const config =
{
	TOKEN: process.env.TOKEN,
	PREFIX: process.env.PREFIX,
	twitchID: process.env.twitchID
}

const https = require('https');
const { MessageEmbed, MessageAttachment } = require('discord.js');

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
 * @param {string} name 
 * @param {object} stream 
 */

function twitchEmbed(name, message, stream)
{
	let embed = new MessageEmbed()
		.setColor("#d54e12")
		.setTitle(`${name} est en stream!`)
		.setImage(stream.preview.template)
	
	embed.addField('Jeu: ', stream.game, false);
	embed.addField(message, `https://www.twitch.tv/${name}`, false);
	
	return embed;
}

exports.getUserId = getUserId;
exports.getUserStream = getUserStream;
exports.twitchEmbed = twitchEmbed;