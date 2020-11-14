import { MessageEmbed, Client, Message, GuildMember, Collection, Guild, User } from "discord.js";
import { Database } from '../../main';

export function run(client: Client, message: Message, args: string[], [database]: [ Database ])
{
    //Assigne member_mention au type voulu
    let member_mention: Collection<string, GuildMember>;
    
    let user_mention: Collection<string, User> = new Collection();
    
    if(args.length > 0)
    {
        //Vérifie que la guild existe'
        if(!message.guild) return message.channel.send(`Vous n'êtes pas dans un serveur!`);
        
        //Transforme tout les argument en minuscules
        args = args.join(' ').toLowerCase().split(' ');

        //Extrai les rôles dans les arguments
        let roles = message.guild.roles.cache.filter(r => args.includes(r.name.toLowerCase())).array();
        
        //Vérifie que l'utilisateur est en ligne, puis que son pseudo ou rôle est dans les arguments
        member_mention = message.guild.members.cache.filter(m => m.presence.status !== 'offline' && (args.includes(m.user.username.toString().toLowerCase()) || m.roles.cache.array().some(r => roles.includes(r))));
        member_mention.forEach((m, key) => { user_mention.set(m.user.id, m.user) });
    }
    else
    {
        //Si aucun argument n'est donné
        user_mention = new Collection().set(message.author.id, message.author) as Collection<string, User>;
    };
	
    user_mention.forEach(
        user =>
        {
            if(user.bot) return;
			
            if(!database[user.id])
            {
				return message.channel.send(`Cet utilisateur n'est pas dans la base de donné.`);
            }

			message.channel.send(
				new MessageEmbed()
                .setColor('#008000')
                .setTitle(`Informations sur ${user.username} !`)
                .setThumbnail(user.avatarURL())
				.addField('Niveau: ', `${database[user.id].data.level}`, true)
				.addField('Experience: ', `${Math.round(database[user.id].data.xp)}`, true)
				.addField('Prochain niveau: ', `${Math.ceil(database[user.id].data.requiredXp)}`, true)
			);
        }

    );
};

export const help =
{
    name: "info",
    description: "Renvoie les information d'un utilisateur mentionné.",
    usage: "<Rien | Utilisateur | Rôle>",
	args: 1, //Peut et ne peux pas avoir d'arguments,
	category: 'level'
};

export const information = ['database'];