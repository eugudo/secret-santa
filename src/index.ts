import * as bodyParser from 'body-parser';

import { Application } from 'express';
import { database } from '@/models/database';
import express from 'express';
import { getPortNumberFromEnv } from '@/helpers/getPortNumberFromEnv';
import { shuffleRoutes } from '@/routes/shuffleRoutes';
import { userRoutes } from '@/routes/userRoutes';

const port = getPortNumberFromEnv();
export const app: Application = express();

database.sync();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user', userRoutes);
app.use('/shuffle', shuffleRoutes);

app.listen(port);
