import express from 'express';


const app = express();

app.listen(process.env.PORT, () => console.log('Server started...'));

app.get('/streamer', 
	data =>
	{
		console.log(data);
	}
);