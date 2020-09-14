const fs = require('fs');

exports.run = (client, message, args) =>
{
	switch(args[0])
	{
		case 'setStatus':
			let str = "";
			for(i = 2; i < args.length; i++)
			{
				str += args[i] + " ";
			}	
			str = str.substr(0, str.length-1);
			
			client.user.setActivity(`${str}`);
			message.channel.send(`Changé l'état à ${str} !`, {type: args[1]});
			break;
		default:
			message.channel.send("Liste de commandes disponibles: \n- \`setStatus <PLAYING | LISTENING> <status>\`");
			break;
	}
}

exports.help = 
{
	name: "debug",
	description: "Change l'état du bot",
	usage: "",
	args: 1
}