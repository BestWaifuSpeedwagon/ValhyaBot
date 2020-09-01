const { MessageEmbed, MessageAttachment } = require('discord.js');
const pollImage = new MessageAttachment('./assets/img/poll.png');

module.exports.run = (client, message, args) =>
{
	if(args.length > 26) return message.channel.send("Il ne peut pas il y avoir plus de 26 arguments!");
	
	let embed = new MessageEmbed()
		.setColor("#d54e12")
		.setTitle("Sondage")
		.attachFiles(pollImage)
		.setThumbnail('attachment://poll.png');
	
	let index = 0;
	for(arg of args)
	{
		let emoji = `:regional_indicator_${String.fromCharCode(97+index)}:`;
		embed.addFields(
			{
				name: arg,
				description: emoji,
				inline: false
			}
		)
		
		index++;
	}
	
	message.channel.send(embed).then(
		msg =>
		{
			msg.react(":regional_indicator_a:");
			/*index = 0;
			for(arg of args)
			{
				let emoji = `:regional_indicator_${String.fromCharCode(97 + index)}:`;
				
				
				
				index++;
			}*/
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