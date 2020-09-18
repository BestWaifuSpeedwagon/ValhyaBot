const { MessageEmbed } = require('discord.js');
const epicGames = require('../../APIs/epicGames');

exports.run = async function(client, message, args)
{
    let data = await epicGames.getFreeGames();

    let freeGames = data.data.Catalog.searchStore.elements;
    freeGames.forEach(
        element => 
        {
            let embed = new MessageEmbed()
                .setAuthor(`Éditeur : ${element.seller.name}`)
                .setTitle(`**${element.title}**`)
                .setURL('https://www.epicgames.com/store/fr/free-games')
                .setColor('#121212')
                .setDescription("Les jeux gratuits de la semaine !")
                .setImage(`${element.keyImages[0].url}`)
                .addField(`Le nouveau jeu gratuit est : **${element.title}** :thumbsup:`, ' !\nAllez le prendre ! :cool: ')
                .setThumbnail(`${element.keyImages[1].url}`)
                .setTimestamp()
            
            message.channel.send(embed);
        }
    );
    
    
}

exports.help =
{
    name: "epic",
    description: "Renvoie les jeux gratuits sur Epic Games.",
    args: false
};