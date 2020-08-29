module.exports.run = (client, message, args) => {
    const role = message.guild.roles.cache.find(role => role.name === args.toString());
    if (role) {
        if (!message.member.roles.cache.has(role.id)) return message.channel.send("Vous n'avez pas ce role !");

        message.member.roles.remove(role)
            .then(m => message.channel.send(`Vous ne possédez plus le role ${role}.`))
            .catch(e => console.log(e));
    } else {
        message.channel.send("Le rôle n'existe pas !");
    }
}

module.exports.help = {
    name: "remove",
    description: "Supprimer un role",
}