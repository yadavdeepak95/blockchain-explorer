
var explorer_const = require('../common/helper.js').explorer.const;

class SyncExplorer {
    constructor(platform, broadcaster) {
        this.platform = platform;
        this.broadcaster = broadcaster;
    }

    async initialize(explorerconfig) {

        if (explorerconfig.sync && explorerconfig.sync.type === explorer_const.SYNC_TYPE_LOCAL) {
            this.platform.initializeSyncLocal(this.broadcaster);
        }
    }
}

module.exports = SyncExplorer;