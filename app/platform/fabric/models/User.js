/*
 *SPDX-License-Identifier: Apache-2.0
 */

const helper = require('../../../common/helper');
const logger = helper.getLogger('FabricGateway');

class User {
  constructor(user) {
    // put the user request in user object
    this.userJson = {};
    Object.keys(user).forEach(key => {
      const value = user[key];
      this.userJson[key] = value;
      logger.log('User.constructor ', key, '= ', value);
    });
  }

  async asJson() {
    return this.userJson;
  }
}

module.exports = User;
