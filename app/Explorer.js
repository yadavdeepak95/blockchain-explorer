/**
 *    SPDX-License-Identifier: Apache-2.0
 */
var express = require('express');
var bodyParser = require('body-parser');
var PlatformBuilder = require('./platform/PlatformBuilder');
var explorerconfig = require('./explorerconfig.json');
var PersistenceFactory = require('./persistence/PersistenceFactory');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
var compression = require('compression');

var explorer_const = require('./common/helper.js').explorer.const;

class Explorer {
  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
    this.app.use(compression());
    this.persistence;
    this.platforms = [];
  }

  getApp() {
    return this.app;
  }

  async initialize(broadcaster) {
    if (!explorerconfig[explorer_const.PERSISTENCE]) {
      throw 'Missing persistence type parameter [persistence] in explorerconfig.json';
    }
    if (!explorerconfig[explorerconfig[explorer_const.PERSISTENCE]]) {
      throw 'Missing database configuration parameter [' + explorerconfig[explorer_const.PERSISTENCE] + '] in explorerconfig.json';
    }
    this.persistence = await PersistenceFactory.create(explorerconfig[explorer_const.PERSISTENCE], explorerconfig[explorerconfig[explorer_const.PERSISTENCE]]);

    for (let pltfrm of explorerconfig[explorer_const.PLATFORMS]) {
      let platform = await PlatformBuilder.build(
        this.app,
        pltfrm,
        this.persistence,
        broadcaster,
        explorerconfig
      );
      this.platforms.push(platform);
    }


  }

  close() {
    if (this.persistence) {
      this.persistence.closeconnection();
    }
    for (let platform of this.platforms) {
      if (platform) {
        platform.destroy();
      }
    }
  }
}

module.exports = Explorer;
