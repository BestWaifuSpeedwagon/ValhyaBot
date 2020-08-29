module.exports = {
    name: 'userinfo',
    description: 'Renvoie les information d\'un utilisateur mentionné.',
    execute(client, message, args)
    {
        const user_mention = message.mentions.users.first();
        const str = user_mention == undefined ? "n'existe pas." : user_mention.username;
        
        message.channel.send("La personne mentionné : " + str);
    }
}