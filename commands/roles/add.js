module.exports.run = (client, message, args) => {
    const role = message.guild.roles.cache.find(role => role.name === args.toString());
    if (role) {
        if (message.member.roles.cache.has(role.id)) return message.channel.send("Vous avez déjà ce rôle !");
        if (role.permissions.has('KICK_MEMBERS')) return message.channel.send("Vous ne pouvez pas avoir ce rôle !");

        message.member.roles.add(role)
            .then(m => message.channel.send(`Vous possédez maintenant le role ${role}.`))
            .catch(e => console.log(e));
    } else {
        message.channel.send("Le rôle n'existe pas !");
    }
}

module.exports.help = {
    name: "add",
    description: "Ajouter un role",
}