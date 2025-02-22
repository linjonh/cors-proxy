import express from 'express';
import pkg from 'body-parser';
const { json, urlencoded } = pkg;
import corsProxy from './handler/cors-proxy.js';

const app = express();
const port = 3000;

app.use(json());
app.use(urlencoded({ extended: true }));

app.all('*', corsProxy);

app.listen(port, () => {
    console.log(`CORS Proxy server is running at http://localhost:${port}`);
});