const express = require('express');
const cssServer = require('../');

const path = require('path');
const app = express();

const staticPath = path.join(__dirname, './public');
app.use(cssServer(staticPath));
app.use(express.static(staticPath));

app.listen(3000);
