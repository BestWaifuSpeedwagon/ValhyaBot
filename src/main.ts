import * as dotenv from "dotenv";
dotenv.config();

const config = 
{
	TOKEN: process.env.TOKEN,
	PREFIX: process.env.PREFIX,
	TWITCH_ID: process.env.TWITCH_ID
}

import { Client, ClientOptions, Collection, Message, TextChannel } from 'discord.js';
import {readdirSync, writeFile, readFileSync} from 'fs';

interface Command
{
	run: {(client: Client, message: Message, args: string[], information?: any): void};
	help: {
		name: string;
		description: string;
		args: boolean;
		usage: string;
		category: string | null;
	},
	information?: string;
}

class CustomClient extends Client
{
	commands: Collection<string, Command>;
	categories: string[];
	
	constructor(options?: ClientOptions)
	{
		super(options);
		
		this.commands = new Collection();
		this.categories = [];
	}
}

let client = new CustomClient();

//#region Functions

function loadCommands(dir = __dirname + "/commands/"): void
{
	readdirSync(dir).forEach(
		dirs =>
		{
			const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
			
			commands.forEach(
				async file =>
				{
					const getFileName: Command = await import(`${dir}/${dirs}/${file}`);
					
					let name = "";
					if(getFileName.help.category)
					{
						client.categories.push(getFileName.help.category);
						name = getFileName.help.category + getFileName.help.name;
					}
					else name = getFileName.help.name;
					
					console.log(`Chargé la commande ${name} avec succès!`);
					
					client.commands.set(name, getFileName);
				}
			)
		}
	)
}

//#endregion

//#region Chargement / Informations

//Charge les commandes
loadCommands();

//Charge l'api twitch
import { getUser, twitchEmbed, getStream, getGame } from './API/twitch.js';

//Définis la base de données
interface UserLevel
{
	xp: number;
	level: number;
	requiredXp: number;
	notification: boolean;
}

let db: { [key: string]: UserLevel; };

export { CustomClient, Command, UserLevel };
import { QueueConstruct } from './API/music';

const queue: Map<string, QueueConstruct> = new Map();

//#endregion

client.on('message',
	message => 
	{
		//#region Niveau / xp

		if(message.author.bot) return;
		if(!db[message.author.tag]) 
		{
			db[message.author.tag] =
			{
				"xp": 0,
				"level": 1,
				"requiredXp": 5,
				"notification": false
			};
		}

		let userlevel = db[message.author.tag];

		userlevel.xp += message.content.length / 3;

		if(userlevel.xp >= userlevel.requiredXp)
		{
			while(userlevel.xp >= userlevel.requiredXp)
			{
				userlevel.level++;
				userlevel.xp = userlevel.xp - userlevel.requiredXp;
			}

			//Redéfini le niveau d'xp requis
			userlevel.requiredXp = userlevel.level * 5 + Math.pow(1.005, userlevel.level);

			if(userlevel.notification)
			{
				message.author.send(`Bravo ${message.author}, tu es passé au niveau ${userlevel.level} !\nCeci est envoyé automatiquement, pour désactiver les notification, fait \`!vbot notification\``);
			}
		}
		

		//#endregion
		//#region Test de la commande
		//Est-ce que le message commence par le préfixe voulu?
		if(!message.content.startsWith(config.PREFIX)) return;


		const args = message.content.slice(config.PREFIX.length).split(/ +/);

		const category = args.shift().toLowerCase();
		let commandName = '';

		if(client.categories.includes(category)) commandName = category + args.shift().toLowerCase();
		else commandName = category; //Si aucune catégorie n'est donnée, la première élément est la commande

		if(!client.commands.has(commandName)) return;

		const command = client.commands.get(commandName);

		//Vérifie si la fonction demande des arguments et si il y en a
		if(command.help.args === true && !args.length)
		{
			let noArgsReply = `Il faut des arguments pour cette commande, ${message.author}`;

			if(command.help.usage)
			{
				noArgsReply += `\nVoici comment utiliser cette commande: \`${config.PREFIX}${command.help.name} ${command.help.usage}\``;
			}
			return message.channel.send(noArgsReply);
		}
		//#endregion

		//Vérifie si la fonction à besoin de plus d'arguments
		if(command.information)
		{
			let info: any;
			switch(command.information)
			{
				case 'database':
					info = db;
					break;
				case 'music':
					info = queue;
					break;
				default:
					console.log(`Information ${command.information} n'existe pas.`);
					break;
			}

			//Lance la fonction avec les arguments en plus
			command.run(client, message, args, info);
		}
		else command.run(client, message, args); //Sinon lancer la fonction normalement
	}
);

client.on('ready',
	async () =>
	{
		//Met l'activité
		console.log(`Logged in as ${client.user.username} !`);

		client.user.setStatus("online");
		client.user.setActivity("!vbot", { type: "LISTENING" });
	}
);

client.login(config.TOKEN).catch(console.log);