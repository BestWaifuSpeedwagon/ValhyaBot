const { MessageEmbed } = require('discord.js');

module.exports.run = (client, message, args) =>
{
    const embed = new MessageEmbed()
        .setColor("#dc143c")
        .setTitle("Titre de l'embed")
        .setURL("https://discordjs.guide/popular-topics/embeds.html")
        .setDescription("Description de l'Embed.")
        .setThumbnail(client.user.displayAvatarURL())
        .addField("Je suis un champ", "et je suis sa valeur")
        .addFields(
            {
                name: 'Je suis le champ 1',
                value: 'et je suis sa valeur',
                inline: true
            },
            {
                name: 'Je suis le champ 2',
                value: 'et je suis sa valeur numéro 2',
                inline: true
            }
        )
        .setImage(client.user.displayAvatarURL())
        .setTimestamp()
        .setFooter("Je suis sur le pied du footer");

    message.channel.send(embed);
}

module.exports.help =
{
    name: "embed",
    description: "Envoie un Embed.",
    args: false
}