/// <reference path="../env.d.ts" />

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { mongoInit } from './database/mongo.js';
import { pg } from './database/pg.js';

import membersRouter from './routers/members.router.js';
import authRouter from './routers/auth.router.js';
import productsRouter from './routers/products.router.js';

const FRONTEND_PUBLIC_PATH: string = path.join(__dirname, '../public');
const FRONTEND_HTML_PATH: string = path.join(FRONTEND_PUBLIC_PATH, 'index.html');

mongoInit();

const app = express();

app.set('PORT', process.env.PORT);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(FRONTEND_PUBLIC_PATH));

app.use((_: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use('/api/members', membersRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

app.use((_: Request, res: Response) => {
    res.sendFile(FRONTEND_HTML_PATH);
    pg.query('SELECT NOW()');
});

app.listen(app.get('PORT'), (error) => {
    if (error) console.error(error);
    console.log('Server listening on PORT:', app.get('PORT'));
});