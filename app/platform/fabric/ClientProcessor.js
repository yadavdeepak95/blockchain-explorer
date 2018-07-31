var ClientScanner = require('./ClientScanner.js');
var helper = require('../../helper.js');
var logger = helper.getLogger('FabricEvent');

var clientArgs = process.argv.slice(2);
console.log('Child ' + clientArgs[1] + ' pid is ' + process.pid);
logger.debug('Client ' + clientArgs[1] + ' Args: %s', clientArgs);

var clientProcessor;

async function start() {
  if (clientArgs.length > 1) {
    try {
      clientProcessor = new ClientScanner(clientArgs[0], clientArgs[1]);
      await clientProcessor.initialize();
    } catch (e) {
      process.send({ error: 'Failed to start the client process ' + e });
      if (clientProcessor) {
        clientProcessor.close();
      }
      process.exit(1);
    }
  } else {
    process.send({
      error: 'Client Processor required network name and client name '
    });
    process.exit(1);
  }
}

start();

process.on('message', msg => {
  logger.debug('Message from parent: %j', msg);
});

// this function is called when you want the server to die gracefully
// i.e. wait for existing connections
var shutDown = function() {
  console.log(
    '<<<<<<<<<<<<<<<<<<<<<<<<<< Closing client processor >>>>>>>>>>>>>>>>>>>>>'
  );
  if (clientProcessor) {
    clientProcessor.close();
  }
  process.exit(0);

  setTimeout(() => {
    console.error(
      'Could not close child connections in time, forcefully shutting down'
    );
    if (clientProcessor) {
      clientProcessor.close();
    }
    process.exit(1);
  }, 10000);
};
// listen for TERM signal .e.g. kill
process.on('SIGTERM', shutDown);
// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', shutDown);
