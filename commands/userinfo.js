module.exports = {
    name: 'userinfo',
    description: 'Renvoie les information d\'un utilisateur mentionné.',
    execute(client, message, args)
    {
        const user_mention = message.mentions.users.first();
        message.channel.send(`La personne mentionné : ${user_mention.username}`)
    }
}