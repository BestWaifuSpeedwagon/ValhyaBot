import { Client, Message } from "discord.js";

export function run(client: Client, message: Message, args: string[])
{
    args = args.join(' ').split('  ');
    
    args.forEach(
        rName => {
            const role = message.guild.roles.cache.find(role => role.name === rName.toString());
            
            if(role)
            {
                if(message.member.roles.cache.has(role.id)) return message.channel.send("Vous avez déjà ce rôle !");
                if(!message.author.presence.member.roles.highest.permissions.has("ADMINISTRATOR")) return message.channel.send("Vous ne pouvez pas avoir ce rôle !");
                
                message.member.roles.add(role)
                    .then(m => message.channel.send(`Vous possédez maintenant le role ${role}.`))
                    .catch(e => console.log(e));
            }
            else
            {
                message.channel.send("Le rôle n'existe pas !");
            }
        }
    )
}

export const help =
{
    name: "add",
    description: "Ajouter plusieurs roles",
    usage: "<Roles à ajouter>",
	args: true,
	category: 'role'
}

export const information = [];