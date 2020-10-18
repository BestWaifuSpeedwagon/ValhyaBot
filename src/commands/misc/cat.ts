import { Client, Message } from 'discord.js';
import * as XMLHttpRequest from 'xhr2';

function ajax_get(url: string, callback: {(data: any)})
{
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = () =>
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{
			try
			{
				var data = JSON.parse(xmlhttp.responseText);
			}
			catch (err)
			{
				console.log(err.message + " in " + xmlhttp.responseText);
				return;
			}
			callback(data);
		}
	};

	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}


export function run(client: Client, message: Message)
{
	ajax_get('https://api.thecatapi.com/v1/images/search?size=full',
		data =>
		{
			message.channel.send(data[0].url);
		}
	);
}

export const help =
{
	name: 'cat',
	description: 'Envoie une image aléatoire de chat.',
	usage: "",
	args: false,
	category: null
}