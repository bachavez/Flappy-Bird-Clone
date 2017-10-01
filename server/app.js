const express = require('express');
const app = express();

app.use(express.static('public'));
app.use('/scripts', express.static(__dirname + '/node_modules/phaser/build/'));

module.exports = app;


