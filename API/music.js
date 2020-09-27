const ytdl = require('ytdl-core');
const {VoiceChannel, VoiceConnection, StreamDispatcher} = require('discord.js');

class Song
{
	/**
	 * 
	 * @param {string} title 
	 * @param {string} url 
	 */
	constructor(title, url)
	{
		this.title = title;
		this.url = url;
	}
}

class QueueConstruct
{
	/**
	 * @param {number} volume 
	 */

	constructor(volume)
	{
		this.volume = volume;

		/** @type {null | VoiceChannel} */
		this.voiceChannel = null;
		/** @type {null | VoiceConnection} */
		this.connection = null;
		/** @type {Song[]} */
		this.songs = [];
		/** @type {null | StreamDispatcher} */
		this.dispatcher = null;
	}
}

exports.QueueConstruct = QueueConstruct;
exports.Song = Song;