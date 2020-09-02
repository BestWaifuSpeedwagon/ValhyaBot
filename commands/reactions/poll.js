const { MessageEmbed, MessageAttachment, Client, Message } = require('discord.js');
const pollImage = new MessageAttachment('./assets/img/poll.png');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array.<string>} args 
 */

module.exports.run = (client, message, args) =>
{	
	if(args.length > 26) return message.channel.send("Il ne peut pas il y avoir plus de 26 arguments!");
	
	args = args.join(' ').split('\"');
	args = args.filter(v=>v!='');
	args = args.filter(v=>v!=' ');
	
	let regionalIndicators = 
	[
		"🇦",
		"🇧",
		"🇨",
		"🇩",
		"🇪",
		"🇫",
		"🇬",
		"🇭",
		"🇮",
		"🇯",
		"🇰",
		"🇱",
		"🇲",
		"🇳",
		"🇴",
		"🇵",
		"🇶",
		"🇷",
		"🇸",
		"🇹",
		"🇺",
		"🇻",
		"🇼",
		"🇽",
		"🇾",
		"🇿",
	]
	
	let embed = new MessageEmbed()
		.setColor("#d54e12")
		.setTitle(args[0])
		.attachFiles(pollImage)
		.setThumbnail('attachment://poll.png');
	
	args.shift();
	
	let index = 0;
	for(arg of args)
	{
		embed.addFields(
			{
				name: arg,
				value: regionalIndicators[index],
				inline: false
			}
		)
		
		index++;
	}
	
	message.channel.send(embed).then(
		msg =>
		{
			let index = 0;
			for(arg of args)
			{
				msg.react(regionalIndicators[index]);
				index++;
			}
		}
	);
	
	//Pour apprendre les collecteurs de reaction
	//Pourrait permettre de faire des jeux
	/*message.channel.send(args[0]).then(
		(msg) =>
		{
			msg.react('👍');
			msg.react('👎');
			
			const collector =
				[
					msg.createReactionCollector(
						(reaction) =>
						{
							return reaction.emoji.name === '👍';
						},
						{ time: 5000 } //Temps en miliseconde
					),
					msg.createReactionCollector(
						(reaction) =>
						{
							return reaction.emoji.name === '👎';
						},
						{ time: 5000 }
					)
				];

			let opinion;

			collector[0].on('end',
				collected =>
				{
					//Obtiens le nombres de 👍
					
					opinion = collected.array()[0].count;
				}
			);

			collector[1].on('end',
				collected =>
				{
					//Edit le message selon le nombre d'emojis obtenus
					if (collected.array()[0].count > opinion) return msg.edit(`${msg.content} \nL'opinion est 👎`);
					
					msg.edit(`${msg.content} \nL'opinion est 👍`);
				}
			);
		}
	)*/
}

module.exports.help = 
{
	name: "poll",
	description: "Créer un sondage selon les arguments donnés",
	args: true
}