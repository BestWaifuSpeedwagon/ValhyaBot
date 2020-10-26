import * as dotenv from "dotenv";
dotenv.config();

const config = 
{
	TOKEN: process.env.TOKEN,
	PREFIX: process.env.PREFIX,
	TWITCH_ID: process.env.TWITCH_ID,
	FAUNA_SECRET: process.env.FAUNA_SECRET,
	FAUNA_KEY: process.env.FAUNA_KEY
}

import { Client, ClientOptions, Collection, Message, TextChannel } from 'discord.js';
import {readdirSync, writeFile, readFileSync} from 'fs';

//#region Commandes

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

loadCommands();

//#endregion

//#region Chargement / Informations

//Charge les libraries
import { getUser, twitchEmbed, getStream, getGame } from './API/twitch.js';
import { QueueConstruct } from './API/music';

import * as faunadb from 'faunadb';

//FaunaDB

const faunaClient = new faunadb.Client({ secret: config.FAUNA_SECRET })

const q = faunadb.query;

interface UserLevel
{
	ref: unknown, //Ne sais pas comment exprimer `Ref(Collection(x), y)`
	ts: number,
	data: 
	{
		id: string;
		xp: number;
		level: number;
		requiredXp: number;
		notification: boolean;
	}
}

let db:{ [key: string]: UserLevel } = {};

//Get database
faunaClient.query(
	q.Map(
		q.Paginate(q.Documents(q.Collection('levels'))),
		q.Lambda(x => q.Get(x))
	)
).then(
	(data: {data: UserLevel[]}) =>
	{
		data.data.forEach(
			d =>
			{
				db[d.data.id] = d;
			}
		);
	}
);

//Musique
const queue: Map<string, QueueConstruct> = new Map();

//Exportation
export { CustomClient, Command, UserLevel };


//#endregion

//#region Functions

//#endregion

client.on('message',
	async message => 
	{
		if(message.author.bot) return;
		
		//#region Niveau / xp
		
		if(!db[message.author.id])
		{
			db[message.author.id] = await faunaClient.query(
				q.Create(
					q.Collection('levels'),
					{
						data:
						{
							id: message.author.id,
							level: 0,
							xp: 0,
							requiredXp: 5,
							notification: false
						}
					}
				)
			)
		}
		
		let userlevel = db[message.author.id];
		
		userlevel.data.xp += message.content.length / 3;

		if(userlevel.data.xp >= userlevel.data.requiredXp)
		{
			while(userlevel.data.xp >= userlevel.data.requiredXp)
			{
				userlevel.data.level++;
				userlevel.data.xp = userlevel.data.xp - userlevel.data.requiredXp;
			}

			//Redéfini le niveau d'xp requis
			userlevel.data.requiredXp = userlevel.data.level * 5 + Math.pow(1.005, userlevel.data.level);

			if(userlevel.data.notification)
			{
				message.author.send(`Bravo ${message.author}, tu es passé au niveau ${userlevel.data.level} !\nCeci est envoyé automatiquement, pour désactiver les notification, fait \`!vbot notification\``);
			}
		}
		
		faunaClient.query(
			q.Update(
				userlevel.ref,
				{ data: userlevel.data }
			)
		)
		
		//#endregion
		//#region Controle de la commande
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