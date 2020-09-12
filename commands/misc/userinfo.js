const { MessageEmbed, Client, Message } = require("discord.js");
const database = require('../../data/database.json');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 */

exports.run = (client, message, args) =>
{
    //Transforme tout les argument en minuscules
    args.forEach(a => a = a.toLowerCase());
    
    //Obtiens tous les membre dans les arguments
    const user_mention = message.guild.members.cache.filter(m => args.includes(m.nickname.toLowerCase()));
    

    user_mention.forEach(
        user =>
        {
            let embed = new MessageEmbed()
                .setColor('#008000')
                .setTitle(`Informations sur ${user.nickname} !`)
                .setThumbnail('https://cdn.discordapp.com/attachments/744622330117881926/754289447352139806/FO2p50F7Nf4AAAAASUVORK5CYII.png')
                .setURL('https://github.com/BestWaifuSpeedwagon/ValhyaBot')
            
            embed.addField('Niveau: ', `${user.user.username}`)
        }
        
    );
    
    
        // .addFields(
        //     {
        //         name: 'Niveau :',
        //         value: `[niveau]`
        //     }
        // )

    message.channel.send(embed);
    
    
};

exports.help =
{
    name: "userinfo",
    description: "Renvoie les information d'un utilisateur mentionné.",
    usage: "<utilisateur mentionné>",
    args: true,
};