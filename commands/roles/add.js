module.exports.run = (client, message, args) =>
{
    const role = message.guild.roles.cache.find(role => role.name === args.toString());
    
    if (role)
    {
        if (message.member.roles.cache.has(role.id)) return message.channel.send("Vous avez déjà ce rôle !");
        if (role.permissions.has('ADMINISTRATOR')) return message.channel.send("Vous n'êtes pas administrateur!");

        message.member.roles.add(role)
            .then(m => message.channel.send(`Vous possédez maintenant le role ${role}.`))
            .catch(e => console.log(e));
    }
    else
    {
        message.channel.send("Le rôle n'existe pas !");
    }
}

module.exports.help =
{
    name: "add",
    description: "Ajouter un role",
    usage: "<role à ajouter>",
    args: true
}