var SyncManager = require('./app/SyncManager');
var helper = require('./app/common/helper.js');
var logger = helper.getLogger('Sync');

var args = process.argv.slice(2);

var syncManager;

async function start() {
  syncManager = new SyncManager(args);
  await syncManager.initialize();
}

start();

process.on('message', msg => {
  logger.debug('Message from parent: %j', msg);
});

// this function is called when you want the server to die gracefully
// i.e. wait for existing connections
var shutDown = function () {
  console.log('<<<<<<<<<<<<<<<<<<<<<<<<<< Closing client processor >>>>>>>>>>>>>>>>>>>>>');
  if (syncManager) {
    syncManager.close();
  }
  process.exit(0);
  setTimeout(() => {
    console.error(
      'Could not close child connections in time, forcefully shutting down'
    );
    if (syncManager) {
      syncManager.close();
    }
    process.exit(1);
  }, 10000);
};

process.on('unhandledRejection', up => {
  console.log('<<<<<<<<<<<<<<<<<<<<<<<<<< Sync > Unhandled Rejection >>>>>>>>>>>>>>>>>>>>>');
  console.log(up);
  shutDown();
});
process.on('uncaughtException', up => {
  console.log('<<<<<<<<<<<<<<<<<<<<<<<<<< Sync > Unhandled Exception >>>>>>>>>>>>>>>>>>>>>');
  console.log(up);
  shutDown();
});

// listen for TERM signal .e.g. kill
process.on('SIGTERM', shutDown);
// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', shutDown);


