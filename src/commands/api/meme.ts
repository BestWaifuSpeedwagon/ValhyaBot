import { MessageEmbed, Client, Message } from 'discord.js';
import {getSubData, Mode} from '../../API/reddit';

export async function run(client: Client, message: Message, args: Mode[])
{
	//Retourne si les arguments sont faux
	if(!['hot', 'new', 'rising'].includes(args[0])) return;
	
	//Obtiens les données de reddit
	let data = await getSubData('dankmemes', args[0]);
	
	//Récupère un meme aléatoire
	let meme = data.data.children[Math.floor(Math.random() * data.data.dist)];
	
	let embed = new MessageEmbed()
		.setAuthor(meme.data.author_fullname)
		.setTitle(meme.data.title)
		.setImage(meme.data.url)
		.addField("Score: ", meme.data.score)
		
	message.channel.send(embed);
}

export const help = 
{
	name: "meme",
	description: "Renvoit les top post de r/dankmemes selon le type donné",
	args: true,
	usage: "<hot | new | rising>",
	category: null
}