import {get} from 'https';

type Mode = 'hot' | 'new' | 'rising'

interface RedditPost
{
	kind: string;
	data: {
		subreddit: string;
		subreddit_name_prefixed: string;
		subreddit_type: 'public' | 'private';
		author_fullname: string;
		title: string;
		score: number;
		url: string;
	}
}

interface RedditResponse
{
	kind: string;
	data: {
		modhash: string;
		dist: number;
		after: string;
		children: RedditPost[];
	}
}

function getSubData(sub: string, mode: Mode): Promise<RedditResponse>
{
	return new Promise(
		(resolve, reject) =>
		{
			get(`https://www.reddit.com/r/${sub}/${mode}.json`,
				res =>
				{
					let rawData = "";
					
					res.on('data', chunk => rawData+=chunk);
					
					res.on('end',
						() =>
						{
							let parsedData: RedditResponse = JSON.parse(rawData);
							resolve(parsedData);
						}
					);
				}
			);
		}
	);
}

export {getSubData, Mode};