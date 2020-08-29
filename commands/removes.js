module.exports = {
    name: 'removes',
    description: 'Supprimer plusieurs roles',
    execute(client, message, args) {
        args.forEach(rName => {
            const role = message.guild.roles.cache.find(role => role.name === rName.toString());
            if (role) {
                if (!message.member.roles.cache.has(role.id)) return message.channel.send("Vous n'avez pas ce role !");

                message.member.roles.remove(role)
                    .then(m => message.channel.send(`Vous ne possédez plus le role ${role}.`))
                    .catch(e => console.log(e));
            } else {
                message.channel.send("Le rôle n'existe pas !");
            }
        })
        
    }
}