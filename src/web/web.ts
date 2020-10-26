import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json({ strict: false }));

app.post('/streamer',
	(req, res) =>
	{
		console.log(req.body);
		res.sendStatus(200);
	}
);

app.listen(8080, () => console.log('Server started...'));