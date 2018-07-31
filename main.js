/*
    SPDX-License-Identifier: Apache-2.0
*/

/**
 *
 * Created by shouhewu on 6/8/17.
 *
 */

var http = require('http');
var url = require('url');
var WebSocket = require('ws');
var appconfig = require('./appconfig.json');
var helper = require('./app/helper.js');
var logger = helper.getLogger('main');
var express = require('express');
var path = require('path');
var Explorer = require('./app/explorer/Explorer');

var host = process.env.HOST || appconfig.host;
var port = process.env.PORT || appconfig.port;

class Broadcaster extends WebSocket.Server {
  constructor(server) {
    super({ server });
    this.on('connection', function connection(ws, req) {
      const location = url.parse(req.url, true);
      this.on('message', function incoming(message) {
        console.log('received: %s', message);
      });
    });
  }

  broadcast(data) {
    this.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        logger.debug('Broadcast >> %j' + data);
        client.send(JSON.stringify(data));
      }
    });
  }
}

var server;
var explorer;
async function startExplorer() {
  explorer = new Explorer();
  //============ web socket ==============//
  server = http.createServer(explorer.getApp());
  var broadcaster = new Broadcaster(server);
  await explorer.initialize(broadcaster);
  explorer.getApp().use(express.static(path.join(__dirname, 'client/build')));
  logger.info(
    'Please set logger.setLevel to DEBUG in ./app/helper.js to log the debugging.'
  );
  // ============= start server =======================
  server.listen(port, function() {
    console.log('\n');
    console.log(`Please open web browser to access ：http://${host}:${port}/`);
    console.log('\n');
    console.log('pid is ' + process.pid);
    console.log('\n');
  });
}

startExplorer();

let connections = [];
server.on('connection', connection => {
  connections.push(connection);
  connection.on(
    'close',
    () => (connections = connections.filter(curr => curr !== connection))
  );
});

process.on('unhandledRejection', up => {
  console.log('<<<<<<<<<<<<<<<<<<<<<<<<<< Error >>>>>>>>>>>>>>>>>>>>>');
  console.log(up);
  explorer.close();
  process.exit(1);
});
process.on('uncaughtException', up => {
  console.log('<<<<<<<<<<<<<<<<<<<<<<<<<< Error >>>>>>>>>>>>>>>>>>>>>');
  console.log(up);
  explorer.close();
  process.exit(1);
});

// this function is called when you want the server to die gracefully
// i.e. wait for existing connections
var shutDown = function() {
  console.log('Received kill signal, shutting down gracefully');
  server.close(() => {
    explorer.close();
    console.log('Closed out connections');
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      'Could not close connections in time, forcefully shutting down'
    );
    explorer.close();
    process.exit(1);
  }, 10000);

  connections.forEach(curr => curr.end());
  setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
};
// listen for TERM signal .e.g. kill
process.on('SIGTERM', shutDown);
// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', shutDown);
