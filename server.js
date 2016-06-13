'use strict';
/* jshint node:true */
var fs = require('fs');
var http = require('http');
var express = require('express');
var httpProxy = require('http-proxy');

// Create server

var app = require('express')();
var server = http.createServer(app);
var oneDay = 24 * 60 * 60 * 1000;


app.set('port', process.env.PORT || 2020, '127.0.0.1');

app.use('/app', express.static(__dirname + '/app'));
app.use('/afc_template', express.static(__dirname + '/app/libs/angular_form_controls/afc_template'));


// Configure routes

var proxy = httpProxy.createProxyServer({});

app.get('/app/*', function(req, res) {
    res.send('404', 404);
});
app.get('/public/*', function(req, res) {
    res.send('404', 404);
});

app.all('/api/*', function(req, res) {
    proxy.web(req, res, {
        target: 'http://localhost:8000',
        changeOrigin: true
    });
});
// Configure index.html

app.get('/*', function(req, res) {
    fs.readFile(__dirname + '/app/templates/template.html', 'utf8', function(error, text) {
        res.send(text);
    });
});

// Start server

console.log('Server listening on port ' + app.get('port'));
server.listen(app.get('port'));