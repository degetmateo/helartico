const express = require('express');
const path = require('path');
const { configDotenv } = require('dotenv');

const FRONTEND_PUBLIC_PATH = path.join(__dirname, '/public/');
const FRONTEND_HTML_PATH = path.join(FRONTEND_PUBLIC_PATH, 'index.html');

configDotenv();
const app = express();

app.set('PORT', process.env.PORT);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(FRONTEND_PUBLIC_PATH));

app.use((_, res, next) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

// routers...

app.use((_, res) => {
    res.sendFile(FRONTEND_HTML_PATH);
});

app.listen(app.get('PORT'), (error) => {
    if (error) console.error(error);
    console.log('Server listening on PORT:', app.get('PORT'));
});