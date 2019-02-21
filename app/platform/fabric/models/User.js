/*
 *SPDX-License-Identifier: Apache-2.0
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const helper = require('../../../common/helper');
const logger = helper.getLogger('FabricGateway');
const FabricCAServices = require('fabric-ca-client');

//TODO identify roles we need to support?
const ROLES = ['admin', 'operator'];

// TODO pass the user type to constructor, and enroll, and add the identity to the wallet
class User {
  constructor(user) {
    // put the user request in user object
    this.userJson = {};
    Object.keys(user).forEach(key => {
      let value = user[key];
      this.userJson[key] = value;
      console.log('User.constructor ', key, '= ', value);
    });
  }

  async asJson() {
    //return JSON.stringify(this.userJson);
    return this.userJson;
  }
}

module.exports = User;
