const { MessageEmbed, Client, Message, GuildMember, Collection } = require("discord.js");
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
    //Assigne user_mention au type voulu
    /** @type {Collection.<string, GuildMember>} */
    let user_mention;

    if(args.length > 0)
    {
        //Transforme tout les argument en minuscules
        args = args.join(' ').toLowerCase().split(' ');

        //Extrai les rôles dans les arguments
        let roles = message.guild.roles.cache.filter(r => args.includes(r.name.toLowerCase()));

        //Vérifie que l'utilisateur est en ligne, puis que son pseudo ou rôle est dans les arguments
        user_mention = message.guild.members.cache.filter(m => m.presence.status !== 'offline' && (args.includes(m.user.username.toString().toLowerCase()) || m.roles.cache.array().includes(roles.first())));
    }
    else
    {
        //Si aucun argument n'est donné
        user_mention = message.guild.members.cache.filter(m => m.user.id === message.author.id);
    };


    user_mention.forEach(
        user =>
        {
            if(user.user.bot) return;

            if(!database[user.user.tag])
            {
                database[user.user.tag] =
                {
                    "xp": 0,
                    "level": 1,
                    "requiredXp": 5,
                    "notification": true
                }
                //Ecris la nouvelle personne dans le .json
                fs.writeFile("./data/database.json", JSON.stringify(database, null, 4), e => { if(e) console.log(e) });
            }

            let embed = new MessageEmbed()
                .setColor('#008000')
                .setTitle(`Informations sur ${user.user.username} !`)
                .setThumbnail(user.user.avatarURL())
                .setURL('https://github.com/BestWaifuSpeedwagon/ValhyaBot')

            embed.addField('Niveau: ', `${database[user.user.tag].level}`, true);
            embed.addField('Experience: ', `${database[user.user.tag].xp}`, true);
            embed.addField('Prochain niveau: ', `${Math.ceil(database[user.user.tag].requiredXp)}`, true);

            message.channel.send(embed);
        }

    );
};

exports.help =
{
    name: "userinfo",
    description: "Renvoie les information d'un utilisateur mentionné.",
    usage: "<utilisateur mentionné>",
    args: 1, //Peut et ne peux pas avoir d'arguments
};

exports.information = 'database';