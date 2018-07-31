/*
*SPDX-License-Identifier: Apache-2.0
*/

var Persist = require('./postgreSQL/Persist');

class PersistenceFactory {
  static async create(db) {
    if (db === 'postgreSQL') {
      var persist = new Persist();
      await persist.initialize();
      return persist;
    }

    throw 'Persistence implementation is not found for ' + db;
  }
}

module.exports = PersistenceFactory;
