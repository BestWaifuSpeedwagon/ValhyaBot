import { Client, Message } from "discord.js";

export function run(client: Client, message: Message, args: string[]): void
{
    message.channel.send("Pong !")
}

export const help =
{
    name: "ping",
	description: "Renvoie Pong !",
	usage: "",
	args: false,
	category: null
};

export const information = [];