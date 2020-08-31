const XMLHttpRequest = require('xhr2');

function ajax_get(url, callback)
{
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function ()
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{
			console.log('responseText:' + xmlhttp.responseText);
			try
			{
				var data = JSON.parse(xmlhttp.responseText);
			} catch (err)
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


module.exports.run = function(client, message)
{
	ajax_get('https://api.thecatapi.com/v1/images/search?size=full',
		data =>
		{
			message.channel.send(data[0].url);
		}
	);
}

module.exports.help =
{
	name: 'cat',
	description: 'Send random picture of cats',
	args: false
}