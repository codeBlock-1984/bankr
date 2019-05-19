import express from 'express';
import favicon from 'serve-favicon';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

import authRoute from './routes/auth';
import userRoute from './routes/user';
import accountRoute from './routes/account';
import transactionRoute from './routes/transaction';
import actionRoute from './routes/action';
import swaggerDocument from '../swagger.json';

const app = express();
const host = '0.0.0.0';
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use('/api/v1/auth/', authRoute);
app.use('/api/v1/users/', userRoute);
app.use('/api/v1/accounts/', accountRoute);
app.use('/api/v1/transactions/', transactionRoute);
app.use('/api/v1/actions/', actionRoute);
app.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.send('<h1>Bankr API</h1>');
});

app.get('*', (req, res) => {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html');
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
