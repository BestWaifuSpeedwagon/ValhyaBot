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
const { setInterval } = require('timers');

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
    () =>
    {
        console.log(`Logged in as ${client.user.username} !`);
        client.user.setStatus("online");
        
        client.user.setActivity("!vbot", {type: "LISTENING"});
        //Trouver une channel spécifique
        //let channel = client.guilds.cache.find(guild => guild.name === "NOM").channels.cache.find(channel => channel.id === "ID");
        
        //Vérifier le stream toutes les minutes
        let streamData = require('./data/stream.json');

        let infoChannel = client.guilds.cache.find(g => g.name === "Valhyan").channels.cache.find(c => c.id === "696064128934215710");
        // let infoChannel = client.guilds.cache.find(g => g.name === "Land of JS").channels.cache.find(c => c.name === "bot-test");
        setInterval(
            () =>
            {
                twitch.getUserStream("Thalounette").then(
                    stream =>
                    {
                        stream = stream.stream; //Obtenir le contenu de la promise
                        
                        if (stream === null)
                        {
                            if (!streamData.online) return;
                            
                            infoChannel.send("Thalounette n'est plus en ligne.");
                            
                            streamData.online = false;
                            fs.writeFile('./data/stream.json', JSON.stringify(streamData, null, 4), e => {if(e) console.log(e)});
                        }
                        else
                        {
                            if (streamData.online) return;

                            infoChannel.send(twitch.twitchEmbed("Thalounette", stream));

                            streamData.online = true;
                            fs.writeFile('./data/stream.json', JSON.stringify(streamData, null, 4), e => {if(e) console.log(e)});
                        }
                    }
                ).catch(e => console.log(e));
            },
            60000
        )
    }
);



client.login(config.TOKEN);