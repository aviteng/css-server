const path = require('path');
const concat = require('./lib/concat');

concat([
  path.join(__dirname, 'node_modules/webix/webix.js'),
  path.join(__dirname, 'node_modules/webix/webix.js'),
  path.join(__dirname, 'node_modules/webix/webix.js'),
  path.join(__dirname, 'node_modules/webix/webix.js'),
  path.join(__dirname, 'node_modules/webix/webix5.js'),
  path.join(__dirname, 'node_modules/webix/webix.js'),
  path.join(__dirname, 'node_modules/webix/webix.js'),
  path.join(__dirname, 'node_modules/webix/webix.js'),
  path.join(__dirname, 'node_modules/webix/webix.js')
],
path.join(__dirname, 'node_modules/vendors.js'));
