const { MessageEmbed, Client, Message, GuildMember, Collection, Guild, User } = require("discord.js");
const fs = require('fs');

/**
* @typedef {Object} UserLevel
* @property {number} xp
* @property {number} level
* @property {number} requiredXp
* @property {boolean} notification
*/

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args
 * @param {Object.<string, UserLevel>} database
 */

exports.run = function(client, message, args, database)
{
    //Assigne member_mention au type voulu
    /** @type {Collection.<string, GuildMember>} */
    let member_mention;
    
    /** @type {Collection.<string, User>} */
    let user_mention = new Collection();
    
    if(args.length > 0)
    {
        //Vérifie que la guild existe'
        if(!message.guild) return message.channel.send(`Vous n'êtes pas dans un serveur!`);
        
        //Transforme tout les argument en minuscules
        args = args.join(' ').toLowerCase().split(' ');

        //Extrai les rôles dans les arguments
        let roles = message.guild.roles.cache.filter(r => args.includes(r.name.toLowerCase())).array();
        
        //Vérifie que l'utilisateur est en ligne, puis que son pseudo ou rôle est dans les arguments
        member_mention = message.guild.members.cache.filter(m => m.presence.status !== 'offline' && (args.includes(m.user.username.toString().toLowerCase()) || m.roles.cache.array().some(r => roles.includes(r))));
        member_mention.forEach((m, key) => { user_mention.set(m.user.id, m.user) });
    }
    else
    {
        //Si aucun argument n'est donné
        user_mention = new Collection().set(message.author.id, message.author);
    };
    
    user_mention.forEach(
        user =>
        {
            if(user.bot) return;

            if(!database[user.tag])
            {
                database[user.tag] =
                {
                    "xp": 0,
                    "level": 1,
                    "requiredXp": 5,
                    "notification": true
                }
                //Ecris la nouvelle personne dans le .json
                fs.writeFile("./data/level.json", JSON.stringify(database, null, 4), e => { if(e) console.log(e) });
            }

            let embed = new MessageEmbed()
                .setColor('#008000')
                .setTitle(`Informations sur ${user.username} !`)
                .setThumbnail(user.avatarURL())
                .setURL('https://github.com/BestWaifuSpeedwagon/ValhyaBot')

            embed.addField('Niveau: ', `${database[user.tag].level}`, true);
            embed.addField('Experience: ', `${Math.round(database[user.tag].xp)}`, true);
            embed.addField('Prochain niveau: ', `${Math.ceil(database[user.tag].requiredXp)}`, true);

            message.channel.send(embed);
        }

    );
};

exports.help =
{
    name: "info",
    description: "Renvoie les information d'un utilisateur mentionné.",
    usage: "<Rien | Utilisateur | Rôle>",
	args: 1, //Peut et ne peux pas avoir d'arguments,
	category: 'level'
};

exports.information = 'database';