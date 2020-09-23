require('dotenv').config();
//Charge le .env dans process.env

const config = 
{
    TOKEN: process.env.TOKEN,
    PREFIX: process.env.PREFIX,
    twitchID: process.env.twitchID
}

const { Client, Collection, ClientApplication, TextChannel } = require('discord.js');
const fs = require('fs');
const { help } = require('./commands/reactions/poll');


const client = new Client();

client.commands = new Collection();

const { setInterval, setTimeout } = require('timers');

/**
 * @typedef {Object} command
 * @property {function} run
 * @property {{name: string, description: string, args: boolean | number, usage: string}} help
 * @property {string} [information]
 */
//#region Functions

function loadCommands(dir = __dirname + "/commands/") 
{
    fs.readdirSync(dir).forEach(
        dirs =>
        {
            const commands = fs.readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));

            for (const file of commands)
            {   
                
                /** @type {command} */
                const getFileName = require(`${dir}/${dirs}/${file}`);
                
                client.commands.set(getFileName.help.name, getFileName);
                
                //if(getFileName.help.name == undefined) console.log()
                
                //console.log(`Commande chargée: ${config.PREFIX}${getFileName.help.name}`);
            }
        }
    );
};

//#endregion

loadCommands();

//Définis "l'objet" utilisé dans le json
/**
 * @typedef {Object} UserLevel
 * @property {number} xp
 * @property {number} level
 * @property {number} requiredXp
 * @property {boolean} notification
 */

/** @type {Object.<string, UserLevel>} */
let db = JSON.parse(fs.readFileSync("data/database.json", "utf-8"));

//Charge les commandes twitch
const { Streamer, getUserId, getUserStream, twitchEmbed } = require('@API/');

//Créer tout les streamers
let streamers =
[
	new Streamer('Valhyan'),
	new Streamer('Thalounette'),
	new Streamer('Delphes99'),
	new Streamer('neight___'),
	new Streamer('thomasc2607')
];

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
            }
        }
        
        let userlevel = db[message.author.tag];
        
        userlevel.xp += message.content.length/3;
        
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
        
        //Ecris les nouvelles valeurs dans un json.
        fs.writeFile("./data/database.json", JSON.stringify(db, null, 4), e => { if(e) console.log(e) });

        //#endregion
        
        if(!message.content.startsWith(config.PREFIX)) return;
		
        
        const args = message.content.slice(config.PREFIX.length).split(/ +/);
        
        const commandName = args.shift().toLowerCase();
        
        if (!client.commands.has(commandName)) return;
        
        /** @type {command} */
        const command = client.commands.get(commandName);
        
        //Vérifie si la fonction demande des arguments et si il y en a
        if(command.help.args === true && !args.length)
        {
            let noArgsReply = `Il faut des arguments pour cette commande, ${message.author}`;

            if (command.help.usage)
            {
                noArgsReply += `\nVoici comment utiliser cette commande: \`${config.PREFIX}${command.help.name} ${command.help.usage}\``
            }
            return message.channel.send(noArgsReply);
        }
        
        //Vérifie si la fonction à besoin de plus d'arguments
        if(command.information)
        {
			/** @type {any} */
            let info;
            switch(command.information)
            {
                case 'database':
                    info = db;
					break;
				case 'streamers':
					info = streamers;
					break;
				default:
					console.log(`Information ${command.information} n'existe pas.`);
            }
            
            //Envoit la fonction avec les arguments en plus
            command.run(client, message, args, info);
        }
        else command.run(client, message, args); //Sinon lancer la fonction normalement
    }
);

client.on('ready',
    async () =>
    {
        console.log(`Logged in as ${client.user.username} !`);
        client.user.setStatus("online");
        
        client.user.setActivity("!vbot", {type: "LISTENING"});
        //Trouver une channel spécifique
        //let channel = client.guilds.cache.find(guild => guild.name === "NOM").channels.cache.find(channel => channel.id === "ID");
        
        
        ///Vérifie le stream toutes les minutes
        
        
        
        //Obtenir les ids des streamers
        
        streamers.forEach(
            async s => 
            {
                let _id = await getUserId(s.name);
                
                s.id = _id;
            }
        );
		
        //Obtenir id des salons info
        /** @type {Collection.<string, TextChannel>} */
        let channelCache = client.guilds.cache.find(g => g.name === "Valhyan").channels.cache;
		
        /** @type {TextChannel[]} */
        let channels = 
        [
			channelCache.find(c => c.name === "les-autres-streams"),
			channelCache.find(c => c.id === "696064128934215710")
        ]
		
        setInterval(
            async () =>
            {
                for(let streamer of streamers)
                {
                    let stream = await getUserStream(streamer.id);
                    
                    if(stream === null) //Pas de stream en cours
                    {
                        if(!streamer.online) continue; //Vérifie si on le sait déjà
                        
                        streamer.online = false;
                    }
                    else //Stream en cours
                    {
                        if(streamer.online) continue; //Vérifie si on le sait déjà
                        
                        //Envoie un embed
						let channel = 0;
						let message = "Lien du stream";
						
                        switch(streamer.name)
                        {
                            case 'Valhyan':
								channel = 1;
								message = "Venez voir le roi du Choo Choo!";
								break;
							case 'Delphes99':
								message = "Le maitre du kotlin!";
								break;
						}
						
						channels[channel].send(twitchEmbed(streamer.name, message, stream));
                        
                        streamer.online = true;
                    }
                }
            },
            60000
        )
    }
);



client.login(config.TOKEN);