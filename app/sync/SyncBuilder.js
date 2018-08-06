/*
*SPDX-License-Identifier: Apache-2.0
*/
var explorer_const = require('../common/helper.js').explorer.const;

class SyncBuilder {


  static async build(args, persistence, syncconfig) {

    let pltfrm;
    if (syncconfig && syncconfig.sync && syncconfig.sync.platform) {
      pltfrm = syncconfig.sync.platform;
    } else {
      if (args.length > 2) {
        pltfrm = args[2];
      }
    }

    if (!pltfrm) {
      throw 'Platform type is not found in syncconfig or argument';
    }

    if (pltfrm === explorer_const.PLATFORM_FABRIC) {
      //avoid to load all Platform modules

      let FabricScanner = require('./fabric/FabricScanner');
      let CRUDService = require('../persistence/fabric/CRUDService');
      let MetricService = require('../persistence/fabric/MetricService');

      // setting platfrom specific CRUDService and MetricService
      persistence.setMetricService(new MetricService(persistence.getPGService()));
      persistence.setCrudService(new CRUDService(persistence.getPGService()));

      var fabricScanner = new FabricScanner(persistence);
      if (!args || args.length == 0) {
        throw 'Missing network_name and client_name , Please run as > sync.js network_name client_name';
      }

      await fabricScanner.initialize(args);

      return fabricScanner;
    }

    throw 'Platform implimenation is not found for synch process' + pltfrm;
  }
}

module.exports = SyncBuilder;
