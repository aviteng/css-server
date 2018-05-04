const express = require('express');
const cssServer = require('../');

const path = require('path');
const app = express();

const staticPath = path.join(__dirname, './public');
const modulePath = path.join(__dirname, '../node_modules');

app.use(express.static('../node_modules'));
app.use(cssServer(staticPath, modulePath));
app.use(express.static(staticPath));

app.listen(3000);
