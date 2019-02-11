/*
 *SPDX-License-Identifier: Apache-2.0
 */

const {
  FileSystemWallet,
  Gateway,
  X509WalletMixin
} = require('fabric-network');
const Fabric_Client = require('fabric-client');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const helper = require('../../../common/helper');
//const logger = helper.getLogger('FabricGateway');

class FabricGateway {
  constructor(networkConfig, caUser, caPassword) {
    this.hfc_client = new Fabric_Client();
    this.networkConfig = networkConfig;
    this.config;
    this.gateway;
    this.userName = caUser; // admin
    this.enrollmentSecret = caPassword; // adminpw
    this.identityLabel = this.userName;
    this.mspId;
    this.wallet;
    this.tlsEnable;
    this.defaultChannel;
    this.defaultPeer;
    this.gateway = new Gateway();
    this.fabricCaEnabled = false;
    this.networkName;
    this.FSWALLET;
  }

  async initialize() {
    const configPath = path.resolve(__dirname, this.networkConfig);
    const configJson = fs.readFileSync(configPath, 'utf8');
    this.config = JSON.parse(configJson);
    this.tlsEnable = this.config.client.tlsEnable;
    this.networkName = this.config.name;
    this.FSWALLET = 'wallet/' + this.networkName;
    const info = `\n\t\tLoading configuration  ${
      this.networkName
    }, tlsEnable: ${this.tlsEnable} \n\n`;
    console.log(info.toUpperCase());
    let x;

    let peers = [];
    this._getPeersConfig(peers);

    console.log('========== > peer name ', peers[0].name);
    this.defaultPeer = peers[0].name;
    let orgMsp = [];
    let signedCertPath;
    let adminPrivateKeyPath;

    ({ adminPrivateKeyPath, signedCertPath } = this._getOrganizationsConfig(
      orgMsp,
      adminPrivateKeyPath,
      signedCertPath
    ));
    console.log(
      '\nsignedCertPath ',
      signedCertPath,
      ' \nadminPrivateKeyPath ',
      adminPrivateKeyPath
    );

    this.defaultChannel = this._getDefaultChannel();
    this.mspId = orgMsp[0];
    let caURL = this._getCAurl();
    let identity;
    let enrollment;

    try {
      // Create a new file system based wallet for managing identities.
      let walletPath = path.join(process.cwd(), this.FSWALLET);
      this.wallet = new FileSystemWallet(walletPath);
      // Check to see if we've already enrolled the admin user.
      const adminExists = await this.wallet.exists(this.userName);
      if (adminExists) {
        console.log(
          `An identity for the admin user: ${
            this.userName
          } already exists in the wallet`
        );
        await this.wallet.export(this.userName);
      } else {
        if (this.fabricCaEnabled) {
          ({ enrollment, identity } = await this._enrollCaIdentity(
            caURL,
            enrollment,
            identity
          ));
        } else {
          // Identity to credentials to be stored in the wallet
          // look for signedCert in first-network-connection.json
          identity = await this._enrollUserIdentity(
            signedCertPath,
            adminPrivateKeyPath,
            identity
          );
        }
      }

      // Set connection options; identity and wallet
      let connectionOptions = {
        identity: this.userName,
        mspId: this.mspId,
        wallet: this.wallet,
        discovery: { enabled: true },
        clientTlsIdentity: this.userName,
        eventHandlerOptions: { commitTimeout: 100 }
      };

      // connect to gateway
      await this.gateway.connect(
        this.config,
        connectionOptions
      );
      // testing only
      await this.gateWayInfoTest();
    } catch (error) {
      // logger.error(` ${error}`);
      console.log('LAST CATCH ', error);
      //TODO decide how to proceed if error
      process.exit(1);
    }
  }
  /**
   * @private method
   *
   */
  _getDefaultChannel() {
    let x;
    let defChannel;
    for (x in this.config.channels) {
      // getting default channel
      console.log('this.config.channels ', x);
      if (x) {
        defChannel = x;
      }
    }
    return defChannel;
  }

  /**
   * @private method
   *
   */
  _getPeersConfig(peers) {
    let x;
    for (x in this.config.peers) {
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
  }

  /**
   * @private method
   *
   */
  _getOrganizationsConfig(orgMsp, adminPrivateKeyPath, signedCertPath) {
    let x;
    for (x in this.config.organizations) {
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
    return { adminPrivateKeyPath, signedCertPath };
  }

  /**
   * @private method
   *
   */
  _getCAurl() {
    let x;
    let caURL = [];
    if (this.config.certificateAuthorities) {
      this.fabricCaEnabled = true;
      for (x in this.config.certificateAuthorities) {
        //TODO may need to handle multiple fabric-ca server ??
        if (this.config.certificateAuthorities[x].url) {
          caURL.push(this.config.certificateAuthorities[x].url);
        }
      }
    }
    return caURL;
  }

  /**
   * @private method
   *
   */
  async _enrollUserIdentity(signedCertPath, adminPrivateKeyPath, identity) {
    console.dir(signedCertPath, adminPrivateKeyPath);
    console.log(typeof signedCertPath);
    console.log(typeof adminPrivateKeyPath);
    let _signedCertPath = signedCertPath;
    let _adminPrivateKeyPath = adminPrivateKeyPath;
    const cert = fs.readFileSync(_signedCertPath, 'utf8');
    console.log('cert =========> \n\n\n\n ', cert);
    // see in first-network-connection.json adminPrivateKey key
    const key = fs.readFileSync(_adminPrivateKeyPath, 'utf8');
    console.log('key =========> \n\n\n\n ', key);
    identity = X509WalletMixin.createIdentity(this.mspId, cert, key);
    console.log(cert, key);
    await this.wallet.import(this.identityLabel, identity);
    return identity;
  }

  /**
   * @private method
   *
   */
  async _enrollCaIdentity(caURL, enrollment, identity) {
    try {
      console.log(
        'this.fabricCaEnabled ',
        this.fabricCaEnabled,
        ' caURL[0] ',
        caURL[0]
      );
      if (this.fabricCaEnabled) {
        let ca = new FabricCAServices(caURL[0]);
        enrollment = await ca.enroll({
          enrollmentID: this.userName,
          enrollmentSecret: this.enrollmentSecret
        });
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>> enrollment ', enrollment);
        identity = X509WalletMixin.createIdentity(
          this.mspId,
          enrollment.certificate,
          enrollment.key.toBytes()
        );
        console.log('identity ', identity);
        await this.wallet.import(this.identityLabel, identity);
      }
    } catch (error) {
      //  logger.error(` ${error}`);
      //TODO add explanation for message 'Calling enrollment endpoint failed with error [Error: connect ECONNREFUSED 127.0.0.1:7054]'
      // reason : no fabric running, check your network
      console.dir('Error instantiating FabricCAServices ', error);
      //TODO decide how to proceed if error
      process.exit(1);
    }
    return { enrollment, identity };
  }

  async getIdentityInfo(label) {
    let identityInfo;
    console.log('Searching for an identity with label: ', label);
    try {
      let list = await this.wallet.list();
      identityInfo = list.filter(id => {
        return id.label === label;
      });
    } catch (error) {
      console.error(error);
    }
    return identityInfo;
  }
  async gateWayInfoTest() {
    // console.dir(this.gateway)
    const client = this.gateway.getClient();

    console.log('this.defaultPeer', this.defaultPeer);
    let channels = await client.queryChannels(this.defaultPeer, true);
    console.log(channels);
    const channel = await client.getChannel(this.defaultChannel, true);
    await channel.initialize({
      discover: true,
      target: this.defaultPeer
    });
    let queryInfo = await channel.queryInfo(this.defaultPeer, true);
    console.log('\n\n\n queryInfo', queryInfo, '\n\n');
    console.log(channel.getChannelPeers());
    console.log('getDiscoveryResults ', await channel.getDiscoveryResults());
    let block = await channel.queryBlock(0, this.defaultPeer, true);
    console.log('\n\n', block, '\n\n');
  }
}

module.exports = FabricGateway;
