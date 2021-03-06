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

type CommandInformation = "database" | "music" | "faunaClient" | "streamers";

interface Command
{
	run: { ( client: Client, message: Message, args: string[], information?: any[] ): void };
	help: {
		name: string;
		description: string;
		args: boolean;
		usage: string;
		category: string | null;
	},
	information: CommandInformation[];
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
//FaunaDB
import faunadb from 'faunadb';

const faunaClient = new faunadb.Client({ secret: config.FAUNA_SECRET })

const q = faunadb.query;

interface UserLevel
{
	ref: faunadb.ExprArg; //Ne sais pas comment exprimer `Ref(Collection(x), y)`
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

interface Database
{
	[key: string]: UserLevel;
}

let db: Database = {};

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

//Streamers
import { TwitchUser, getUser, twitchEmbed, getStream, getGame } from './API/twitch.js';

interface Streamer
{
	ref: faunadb.ExprArg;
	ts: number;
	data:
	{
		user: TwitchUser;
		streaming: boolean;
		channelId: string;
	};
}

let streamers: Streamer[] = [];

faunaClient.query(
	q.Map(
		q.Paginate(q.Documents(q.Collection('streamers'))),
		q.Lambda(x => q.Get(x))
	)
).then(
	(data: { data: Streamer[]; }) =>
	{
		streamers = [...data.data];
	}
);

//Musique
import { QueueConstruct } from './API/music';

const queue: Map<string, QueueConstruct> = new Map();

//Exportation
export { CustomClient, Command, UserLevel, Database, Streamer };


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
		if(command.information.length > 0)
		{
			let info: any[] = [];
			
			command.information.forEach(
				(i) =>
				{
					let pushed: any = undefined;
					switch(i)
					{
						case 'database':
							pushed = db;
							break;
						case 'music':
							pushed = queue;
							break;
						case 'faunaClient':
							pushed = faunaClient;
							break;
						case 'streamers':
							pushed = streamers;
							break;
						default:
							console.log(`Information ${command.information} n'existe pas.`);
							break;
					}
					
					info.push(pushed);
				}
			);

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
		
		setInterval(
			() =>
			{
				streamers.forEach(
					async (s, index) =>
					{
						let _stream = await getStream(s.data.user.id, "user_id");
						
						if(!s.data.streaming)
						{
							if(!_stream) return; //Similar to continue
							
							streamers[index].data.streaming = true;
							
							faunaClient.query(
								q.Update(
									s.ref,
									{ data: { streaming: true } }
								)
							);
							
							let _channel = client.channels.cache.get(s.data.channelId) as TextChannel;
							
							if(!_channel) return console.log(`Channel of ${s.data.user.display_name} doesn't exists!`);
							
							_channel.send( await twitchEmbed(_stream, s.data.user) );
						}
						else
						{
							if(_stream) return;
							
							streamers[index].data.streaming = false;
							
							faunaClient.query(
								q.Update(
									s.ref,
									{ data: { streaming: false } }
								)
							);
						}
					}
				);
			}, 60*1000
		);
	}
);

client.login(config.TOKEN).catch(console.log);