/*
*SPDX-License-Identifier: Apache-2.0
*/

var explorer_const = require('../common/helper.js').explorer.const;

class PlatformBuilder {


  static async build(app, pltfrm, persistence, broadcaster, explorerconfig) {

    if (pltfrm === explorer_const.PLATFORM_FABRIC) {
      //avoid to load all Platform modules
      let Platform = require('./fabric/Platform');
      let CRUDService = require('../persistence/fabric/CRUDService');
      let MetricService = require('../persistence/fabric/MetricService');
      let dbroutes = require('../rest/fabric/dbroutes.js');
      let platformroutes = require('../rest/fabric/platformroutes.js');
      let SyncExplorer = require('../sync/SyncExplorer');

      // setting platfrom specific CRUDService and MetricService
      persistence.setMetricService(new MetricService(persistence.getPGService()));
      persistence.setCrudService(new CRUDService(persistence.getPGService()));

      var platform = new Platform(persistence);
      await platform.initialize();

      // initializing the rest app services
      await dbroutes(app, platform);
      await platformroutes(app, platform);

      let syncExplorer = new SyncExplorer(platform, broadcaster);
      await syncExplorer.initialize(explorerconfig);

      return platform;
    }

    throw 'Platform implimenation is not found for ' + pltfrm;
  }

}

module.exports = PlatformBuilder;
