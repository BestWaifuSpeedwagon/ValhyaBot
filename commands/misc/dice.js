const { MessageEmbed, MessageAttachment } = require('discord.js');
const diceImage = new MessageAttachment('./assets/img/dice.png');

function randomDice()
{
    return Math.ceil(Math.random() * 6);
}

module.exports.run = (client, message, args) =>
{
    const embed = new MessageEmbed()
        .setColor("#d54e12")
        .setTitle("Random Dice")
        .attachFiles(diceImage)
        .setThumbnail('attachment://dice.png')
        .addFields(
            {
                name: 'Dice #1',
                value: randomDice(),
                inline: true
            },
            {
                name: 'Dice #2',
                value: randomDice(),
                inline: true
            },
            {
                name: 'Dice #3',
                value: randomDice(),
                inline: true
            }
        )
        .addFields(
            {
                name: 'Dice #4',
                value: randomDice(),
                inline: true
            },
            {
                name: 'Dice #5',
                value: randomDice(),
                inline: true
            },
            {
                name: 'Dice #6',
                value: randomDice(),
                inline: true
            }
        )

    message.channel.send(embed);
}

module.exports.help =
{
    name: "dice",
    description: "Renvoie la valeur de plusieurs dès.",
    args: false
}