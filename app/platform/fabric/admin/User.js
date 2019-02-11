/*
 *SPDX-License-Identifier: Apache-2.0
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const helper = require('../../../common/helper');
const logger = helper.getLogger('FabricGateway');
const FabricCAServices = require('fabric-ca-client');

// TODO pass the user type to constructor, and enroll, and add the identity to the wallet
class User {
  constructor(userInfo) {
    super();
    this.userInfo = userInfo;
  }
  //TODO
  async enroll() {}
  //TODO
  async register() {}
}

module.exports = User;
