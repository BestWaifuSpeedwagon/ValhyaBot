import { Client, Message } from "discord.js";

export function run(client: Client, message: Message): void
{
    message.channel.send("https://www.youtube.com/watch?v=9wnNW4HyDtg");
}

export const help =
{
    name: "ayaya",
	description: "Renvoie ayaya !",
	usage: "",
	args: false,
	category: null
};