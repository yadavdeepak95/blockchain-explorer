var syncconfig = require('./explorerconfig.json');
var helper = require('./common/helper.js');
var logger = helper.getLogger('SyncManager');
var SyncBuilder = require('./sync/SyncBuilder')
var PersistenceFactory = require('./persistence/PersistenceFactory');

var explorer_const = require('./common/helper.js').explorer.const;

var syncScanner;

class SyncManager {
  constructor(args) {
    this.args = args;
    this.persistence;
    this.syncScanner;
  }

  async  initialize() {

    if (!syncconfig[explorer_const.PERSISTENCE]) {
      throw 'Missing persistence type parameter [persistence] in explorerconfig.json';
    }
    if (!syncconfig[syncconfig[explorer_const.PERSISTENCE]]) {
      throw 'Missing database configuration parameter [' + syncconfig[explorer_const.PERSISTENCE] + '] in explorerconfig.json';
    }

    this.persistence = await PersistenceFactory.create(syncconfig[explorer_const.PERSISTENCE], syncconfig[syncconfig[explorer_const.PERSISTENCE]]);

    this.syncScanner = await SyncBuilder.build(this.args, this.persistence, syncconfig);

  }

  close() {
    if (this.persistence) {
      this.persistence.closeconnection();
    }
    if (this.syncScanner) {
      this.syncScanner.destroy();
    }
  }
}

module.exports = SyncManager;





