module.exports.run = (client, message, args) =>
{
    const user_mention = message.mentions.users.first();
    const str = user_mention == undefined ? "n'existe pas." : user_mention.username;

    message.channel.send("La personne mentionné : " + str);
};

module.exports.help =
{
    name: "userinfo",
    description: "Renvoie les information d'un utilisateur mentionné.",
    usage: "<utilisateur mentionné>",
    args: true,
};