exports.run = (client, message, args) => {
    message.channel.send("Pong !")
}

exports.help =
{
    name: "ping",
    description: "Renvoie Pong !",
    args: false
};