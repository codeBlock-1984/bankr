import express from 'express';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import accountRoute from './routes/accountRoute';
import transactionRoute from './routes/transactionRoute';
import swaggerDocument from '../swagger.json';

const app = express();
const host = '0.0.0.0';
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use('/api/v1/auth/', authRoute);
app.use('/api/v1/users/', userRoute);
app.use('/api/v1/accounts/', accountRoute);
app.use('/api/v1/transactions/', transactionRoute);
app.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', "text/html");
  res.send('<h1>Bankr API</h1>');
});

app.get('*', (req, res) => {
  res.statusCode = 404;
  res.setHeader('Content-Type', "text/html");
  res.send(
    `<h1>404</h1>
     <hr>
     <h3>Page Not Found!</h3>
    `,
  );
});

app.listen(port, host, () => {
  console.log(`Bankr server listening on port ${port}!`);
});

export default app;
