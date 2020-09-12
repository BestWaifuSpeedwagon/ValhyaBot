const { MessageEmbed } = require("discord.js");

exports.run = (client, message, args) =>
{
    const user_mention = message.mentions.users.first();
    const str = user_mention === undefined ? "n'existe pas." : user_mention.username;
    let embed = new MessageEmbed()
        .setColor('#008000')
        .setTitle(`Les informations de ${str} !`)
        .setThumbnail('https://cdn.discordapp.com/attachments/744622330117881926/754289447352139806/FO2p50F7Nf4AAAAASUVORK5CYII.png')
        .setURL('https://github.com/BestWaifuSpeedwagon/ValhyaBot')
        .addFields(
            {
                name: 'Niveau :',
                value: `[niveau]`
            }
        )

    message.channel.send(embed);
    
    
};

exports.help =
{
    name: "userinfo",
    description: "Renvoie les information d'un utilisateur mentionné.",
    usage: "<utilisateur mentionné>",
    args: true,
};