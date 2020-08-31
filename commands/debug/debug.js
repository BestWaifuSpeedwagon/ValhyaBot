const fs = require('fs');
let config = require('./../../config.json');

module.exports.run = (client, message, args) =>
{
	if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send("Vous n'êtes pas administrateur!");
	
	switch(args[0])
	{
		case 'setStatus':
			let str = "";
			for(i = 1; i < args.length; i++)
			{
				str += args[i] + " ";
			}	
			
			console.log(config);
			
			config = Object.assign(config, { "status": str });
			
			console.log(config);
			
			/*fs.writeFile(__dirname + "../../../config.json", "{baka: hey}",
				err =>
				{
					if (err) { console.log(err) };
				}
			);*/
			
			client.user.setActivity(`${str}`, {type: "PLAYING"});
			message.channel.send(`Changé l'état à ${str} !`);
			break;
		case 'setStream':
			
			client.user.setActivity(`${client.user.presence.activities[0].name}`, { type: "STREAMING", url: args[1] });
			break;
	}
}

module.exports.help = 
{
	name: "debug",
	description: "Changer l'état du bot",
	usage: "<argument>",
	args: true
}