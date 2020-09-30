const ytdl = require('ytdl-core');
const {VoiceChannel, VoiceConnection, StreamDispatcher} = require('discord.js');

class Song
{
	/**
	 * @param {('youtube'|'discord')} type
	 * @param {string} title 
	 * @param {string} url 
	 */
	constructor(type, title, url)
	{
		this.type = type;
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

const https = require('https');
const googleID = process.env.googleID;

/**
 * @typedef {Object} itemResponse
 * @property {string} kind
 * @property {string} etag
 * @property {{ kind: string, videoId: string }} id
 * @property {
	{
        publishedAt: string,
    	channelId: string,
        title: string,
        description: string,
        thumbnails: {
          default: {
            url: string,
            width: number,
            height: number
          },
          medium: {
            url: string,
            width: number,
            height: number
          },
          high: {
            url: string,
            width: number,
            height: number
          }
        },
        channelTitle: string,
        liveBroadcastContent: string,
        publishTime: string
      }
	} snippet
 */
/**
 * @typedef {
	{
		kind: string,
		etag: string,
		nextPageToken: string,
		regionCode: string,
		pageInfo:
		{
			totalResults: number,
			resultsPerPage: number
		},
		items: itemResponse[]
	}
	} queryResponse
 */
/**
 * @param {string} search 
 * @returns {Promise.<queryResponse>}
}
 */
function searchQuery(search)
{
	//curl \
	//  'https://www.googleapis.com/youtube/v3/search?maxResults=1&q=my%20salsa&key=[YOUR_API_KEY]' \
	//  --header 'Accept: application/json' \
	//  --compressed
	search = encodeURI(search);
	return new Promise(
		(resolve, reject) =>
		{
			https.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${search}&key=${googleID}`,
				res =>
				{
					let rawData = "";
					res.on('data', chunk => { rawData+=chunk });
					res.on('end',
						() =>
						{
							/** @type {queryResponse} */
							let parsedData = JSON.parse(rawData);
							
							resolve(parsedData);
						}
					);
					res.on('error', console.log)
				}
			).on('error', console.log);
		}
	)
}

/**
 * @param {string} listId 
 * @returns {Promise.<queryResponse>}
 */
function playlistQuery(listId)
{
	//curl \
	//  'https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Csnippet&playlistId=PL7bbiJ1WK8wRUJjxx5OfTpS9BKc2Fg0ky&key=[YOUR_API_KEY]' \
	//  --header 'Accept: application/json' \
	//  --compressed
	
	return new Promise(
		(resolve, reject) =>
		{
			https.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Csnippet&maxResults=20&playlistId=${listId}&key=${googleID}`,
				res =>
				{
					let rawData = "";
					res.on('data', chunk => { rawData+=chunk });
					res.on('end',
						() =>
						{
							/** @type {queryResponse} */
							let parsedData = JSON.parse(rawData);
							
							resolve(parsedData);
						}
					);
					res.on('error', console.log);
				}
			).on('error', console.log);
		}
	);
}

exports.QueueConstruct = QueueConstruct;
exports.Song = Song;
exports.searchQuery = searchQuery;
exports.playlistQuery = playlistQuery;