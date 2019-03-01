/*
    SPDX-License-Identifier: Apache-2.0
*/

const fs = require('fs');
class FabricConfig {
  constructor() {}

  initialize(configPath) {
    const configJson = fs.readFileSync(configPath, 'utf8');
    this.config = JSON.parse(configJson);
  }

  getConfig() {
    return this.config;
  }

  isFabricCaEnabled() {
    if (this.config.certificateAuthorities) {
      return true;
    }
    return false;
  }
  getTls() {
    return this.config.client.tlsEnable;
  }

  getEnableAuthentication() {
    return this.config.client.enableAuthentication;
  }

  getAdminUser() {
    return this.config.client.adminUser;
  }

  getNetworkName() {
    return this.config.name;
  }
  getAdminPassword() {
    return this.config.client.adminPassword;
  }

  getDefaultChannel() {
    let defChannel;
    for (let x in this.config.channels) {
      // getting default channel
      console.log('FabricConfig, this.config.channels ', x);
      if (x) {
        defChannel = x;
      }
    }
    return defChannel;
  }
  getDefaultPeerConfig() {
    let defaultPeerConfig = [];
    let peers = this.getPeersConfig();
    if (peers) {
      defaultPeerConfig = peers[0];
    }
    return defaultPeerConfig;
  }

  getPeersConfig() {
    let peers = [];
    for (let x in this.config.peers) {
      //TODO may need to handle multiple fabric-ca server ??
      if (this.config.peers[x].url) {
        let peer = {
          name: x,
          url: this.config.peers[x].url,
          tlsCACerts: this.config.peers[x].tlsCACerts,
          eventUrl: this.config.peers[x].eventUrl,
          grpcOptions: this.config.peers[x].grpcOptions
        };
        peers.push(peer);
      }
    }
    return peers;
  }
  //TOD need to verify maybe there is a better way of getting the key/value from the configuration
  getOrganizationsConfig() {
    let orgMsp = [];
    let adminPrivateKeyPath;
    let signedCertPath;
    for (let x in this.config.organizations) {
      //TODO may need to handle multiple MSPID's ??
      if (this.config.organizations[x].mspid) {
        orgMsp.push(this.config.organizations[x].mspid);
      }
      if (this.config.organizations[x].adminPrivateKey) {
        adminPrivateKeyPath = this.config.organizations[x].adminPrivateKey.path;
      }
      if (this.config.organizations[x].signedCert) {
        signedCertPath = this.config.organizations[x].signedCert.path;
      }
    }
    return { orgMsp, adminPrivateKeyPath, signedCertPath };
  }

  getServerCertPath() {
    let serverCertPath = null;
    if (this.config.certificateAuthorities) {
      for (let x in this.config.certificateAuthorities) {
        if (this.config.certificateAuthorities[x].tlsCACerts) {
          serverCertPath = this.config.certificateAuthorities[x].tlsCACerts
            .path;
        }
      }
    }

    return serverCertPath;
  }

  getCertificateAuthorities() {
    let caURL = [];
    let serverCertPath = null;
    // let serverCert = fs.readFileSync(path.join(__dirname, 'somepath/msp/tlscacerts/example.com-cert.pem'));
    if (this.config.certificateAuthorities) {
      for (let x in this.config.certificateAuthorities) {
        //TODO may need to handle multiple fabric-ca server ??
        if (this.config.certificateAuthorities[x].tlsCACerts) {
          serverCertPath = this.config.certificateAuthorities[x].tlsCACerts
            .path;
        }
        if (this.config.certificateAuthorities[x].url) {
          caURL.push(this.config.certificateAuthorities[x].url);
        }
      }
    }
    return { caURL, serverCertPath };
  }

  getPeers() {
    let peers = [];
    for (let x in this.config.peers) {
      //TODO may need to handle multiple fabric-ca server ??
      if (this.config.peers[x].url) {
        let peer = {
          name: x,
          url: this.config.peers[x].url,
          tlsCACerts: this.config.peers[x].tlsCACerts,
          eventUrl: this.config.peers[x].eventUrl,
          grpcOptions: this.config.peers[x].grpcOptions
        };
        peers.push(peer);
      }
    }
    return peers;
  }
}

module.exports = FabricConfig;
