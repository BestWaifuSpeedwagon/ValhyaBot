const fs = require('fs');

module.exports.run = (client, message, args) =>
{
	fs.writeFile(__dirname + "save.txt", "Ecris!", 'utf8',
		err =>
		{
			if(err){throw err};

			message.channel.send('Ecris!');
		}
	);
	
	if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send("Vous n'êtes pas administrateur!");
	
	switch(args[0])
	{
		case 'setStatus':
			let str = "";
			for(i = 1; i < args.length; i++)
			{
				str += args[i] + " ";
			}	
			
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
	description: "Fait des console.log()",
	usage: "<argument>",
	args: true
}