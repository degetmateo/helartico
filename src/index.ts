/// <reference path="../env.d.ts" />

import express, { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { mongoInit } from './database/mongo.js';
import { pg } from './database/pg.js';

import membersRouter from './routers/members.router.js';
import authRouter from './routers/auth.router.js';
import productsRouter from './routers/products.router.js';
import codesRouter from './routers/codes.router.js';
// import { authorizeStaff } from './helpers/authorization.helper.js';

const FRONTEND_PUBLIC_PATH: string = path.join(__dirname, '../public');
// const FRONTEND_ADMIN_PATH: string = path.join(__dirname, '../admin');
const FRONTEND_HTML_PATH: string = path.join(FRONTEND_PUBLIC_PATH, 'index.html');
// const STAFF_HTML_PATH: string = path.join(FRONTEND_ADMIN_PATH, 'staff.html');

const queryPg = async () => {
    try {
        await pg.query('SELECT NOW()');
    } catch (error) {
        console.error(error);
    };
};

const app = express();

app.set('PORT', process.env.PORT);

const corsConfig: CorsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    origin: process.env.FRONTEND_URL
};

app.use(cors(corsConfig));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((_: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use('/api/members', membersRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/codes', codesRouter);

// app.use('/admin', authorizeStaff, express.static(FRONTEND_ADMIN_PATH));

// app.use(['/staff', '/staff*admin'], authorizeStaff, (_: Request, res: Response) => {
//     res.sendFile(STAFF_HTML_PATH);
// });

app.use('/public', express.static(FRONTEND_PUBLIC_PATH));

app.use((_: Request, res: Response) => {
    res.sendFile(FRONTEND_HTML_PATH);
    queryPg();
});

app.listen(app.get('PORT'), async (error) => {
    if (error) console.error(error);
    console.log('Server listening on PORT:', app.get('PORT'));

    try {
        await mongoInit();
    } catch (err) {
        console.error(err);     
    };
});