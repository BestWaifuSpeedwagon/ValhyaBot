const config = require('./config.json');

const { Client, Collection, ClientApplication } = require('discord.js');
const fs = require('fs');
const { help } = require('./commands/reactions/poll');

const client = new Client();
client.commands = new Collection();


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
                
                console.log(`Commande chargée: ${config.PREFIX}${getFileName.help.name}`);
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
    }
);
client.login(config.TOKEN);