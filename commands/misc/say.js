module.exports.run = (client, message, args) =>
{
    message.channel.send(args.join(" "));
}

module.exports.help =
{
    name: "say",
    description: "Répéte le message d'un utilisateur",
    usage: `<texte>`,
    args: true
};