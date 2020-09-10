const config =
{
	TOKEN: process.env.TOKEN,
	PREFIX: process.env.PREFIX,
	twitchID: process.env.twitchID
}

const https = require('https');
const { MessageEmbed } = require('discord.js');

/**
 * 
 * @param {string} name 
 */

function getUserStream(name)
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

							const id = parsedData.users[0]._id;

							options.path = `/kraken/streams/${id}`;

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

											resolve(parsedData);
										}
									);
								}
							).on('error', reject);
						}
					);
				}
			).on('error', reject);
		}
	)
}

/**
 * 
 * @param {string} name 
 * @param {object} stream 
 */

function twitchEmbed(name, stream)
{
	//.game, stream.preview.large
	let embed = new MessageEmbed()
		.setColor("#d54e12")
		.setTitle(`${name} est en stream!`)
		.setImage(stream.preview.large)

	embed.addField('Jeu: ', stream.game);
	embed.addField(name.toLowerCase() === 'valhyan' ? 'Venez voir le roi du choo choo' : 'Lien du stream', `https://www.twitch.tv/${name}`);
	
	return embed;
}


exports.getUserStream = getUserStream;
exports.twitchEmbed = twitchEmbed;