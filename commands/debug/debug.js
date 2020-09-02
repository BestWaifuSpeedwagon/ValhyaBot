const fs = require('fs');

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
			str = str.substr(0, str.length-1);
			
			client.user.setActivity(`${str}`);
			message.channel.send(`Changé l'état à ${str} !`);
			break;
		case 'setStream':
			client.user.setActivity(`${client.user.presence.activities[0].name}`, { type: "STREAMING", url: args[1] });
			break;
		default:
			message.channel.send("Liste de commandes disponibles: \n- \`setStatus\` \n- \`setStream\`");
			break;
	}
}

module.exports.help = 
{
	name: "debug",
	description: "Change l'état du bot",
	usage: "<argument>",
	args: true
}