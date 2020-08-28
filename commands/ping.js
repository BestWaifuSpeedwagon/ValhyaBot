module.exports = {
    name: 'ping',
    description: 'Pong !',
    execute(client, message, args)
    {
        message.channel.send('Pong !');
    }
}