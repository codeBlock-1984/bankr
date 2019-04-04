import express from 'express';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

import userRoute from './routes/userRoute';
import accountRoute from './routes/accountRoute';
import transactionRoute from './routes/transactionRoute';

const app = express();
const host = '0.0.0.0';
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use('/api/v1/auth/', userRoute);
app.use('/api/v1/auth/', userRoute);
app.use('/api/v1/accounts/', accountRoute);
app.use('/api/v1/transactions/', transactionRoute);

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', "text/html");
  res.send('<h1>Bankr API</h1>');
});

app.listen(port, host, () => {
  console.log(`Bankr server listening on port ${port}!`);
});

export default app;
