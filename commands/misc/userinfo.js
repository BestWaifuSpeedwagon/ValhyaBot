const { MessageEmbed, Client, Message, GuildMember, Collection } = require("discord.js");
const fs = require('fs');

let database = require('../../data/database.json');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 */

exports.run = (client, message, args) =>
{
    //Transforme tout les argument en minuscules
    args = args.join(' ').toLowerCase().split(' ');
    
    /** @type {Collection.<string, GuildMember>} */
    let user_mention;
    
    if(args.length > 0)
    {
        let roles = message.guild.roles.cache.filter(r => args.includes(r.name.toLowerCase()));
        
        user_mention = message.guild.members.cache.filter(m => m.presence.status !== 'offline' && (args.includes(m.user.username.toString().toLowerCase()) || m.roles.cache.array().includes(roles.first())));

    }
    else
    {
        user_mention = message.guild.members.cache.find(m => m.user.id === message.author.id);
    };
    
    
    user_mention.forEach(
        user =>
        {
            if(!database[user.user.tag]) 
            {
                database[user.user.tag] = {
                    xp: 0,
                    level: 1
                };
            }
            fs.writeFile("./data/database.json", JSON.stringify(database, null, 4), e => {if(e) console.log(e)});
            
            if(database[user.user.tag] === undefined) return;
            
            let embed = new MessageEmbed()
                .setColor('#008000')
                .setTitle(`Informations sur ${user.user.username} !`)
                .setThumbnail(user.user.avatarURL())
                .setURL('https://github.com/BestWaifuSpeedwagon/ValhyaBot')
            
            embed.addField('Niveau: ', `${database[user.user.tag].level}`);
            embed.addField('Experience: ', `${database[user.user.tag].xp}`);
            
            message.channel.send(embed);
        }
        
    );
};

exports.help =
{
    name: "userinfo",
    description: "Renvoie les information d'un utilisateur mentionné.",
    usage: "<utilisateur mentionné>",
    args: true,
};