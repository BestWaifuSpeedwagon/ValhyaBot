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

const twitch = require('./libraries/twitch.js');
const { setInterval, setTimeout } = require('timers');

//#region Functions

function loadCommands(dir = __dirname + "/commands/") 
{
    fs.readdirSync(dir).forEach(
        dirs =>
        {
            const commands = fs.readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));

            for (const file of commands)
            {
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

client.on('message',
    message => 
    {
        if(!message.content.startsWith(config.PREFIX) || message.author.bot) return;
        
        const args = message.content.slice(config.PREFIX.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (!client.commands.has(commandName)) return;
        const command = client.commands.get(commandName);

        if (command.help.args && !args.length)
        {
            let noArgsReply = `Il faut des arguments pour cette commande, ${message.author}`;

            if (command.help.usage)
            {
                noArgsReply += `\nVoici comment utiliser cette commande: \`${config.PREFIX}${command.help.name} ${command.help.usage}\``
            }
            return message.channel.send(noArgsReply);
        }
        command.run(client, message, args);
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
        
        //Créer tout les streamers
        class Streamer
        {
            constructor(name)
            {
                this.name = name;
                this.id = '';
                
                this.online = false;
            }
        }
        
        let streamers =
        [
            new Streamer('Valhyan'    ),
            new Streamer('Thalounette'),
            new Streamer('delphes99'  ),
            new Streamer('neight___'  ),
            new Streamer('thomasc2607')
        ];
        
        //Obtenir les ids des streamers
        
        streamers.forEach(
            async s => 
            {
                let _id = await twitch.getUserId(s.name);
                
                s.id = _id;
            }
        );
        
        //Obtenir id du salon info / bot-test

        /** @type {TextChannel} */
        let infoChannel = client.guilds.cache.find(g => g.name === "Valhyan").channels.cache.find(c => c.id === "696064128934215710");
        // let infoChannel = client.guilds.cache.find(g => g.name === "Land of JS").channels.cache.find(c => c.name === "bot-test");
        
        
        setInterval(
            async () =>
            {
                for(let streamer of streamers)
                {
                    let stream = await twitch.getUserStream(streamer.id);
                    
                    if(stream === null) //Pas de stream en cours
                    {
                        if(!streamer.online) continue; //Vérifie si on le sait déjà
                        
                        infoChannel.send(`${stream.channel.display_name} n'est plus en ligne.`);
                        
                        streamer.online = false;
                    }
                    else //Stream en cours
                    {
                        if(streamer.online) continue; //Vérifie si on le sait déjà
                        
                        //Envoie un embed
                        infoChannel.send(twitch.twitchEmbed(stream.channel.display_name, stream));
                        
                        streamer.online = true;
                    }
                }
            },
            60000
        )
    }
);



client.login(config.TOKEN);