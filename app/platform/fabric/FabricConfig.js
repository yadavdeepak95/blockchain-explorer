/*
 * SPDX-License-Identifier: Apache-2.0
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
		for (const x in this.config.channels) {
			// Getting default channel
			console.log('FabricConfig, this.config.channels ', x);
			if (x) {
				defChannel = x;
			}
		}
		return defChannel;
	}
	getDefaultPeerConfig() {
		let defaultPeerConfig = [];
		const peers = this.getPeersConfig();
		if (peers) {
			defaultPeerConfig = peers[0];
		}
		return defaultPeerConfig;
	}

	getPeersConfig() {
		const peers = [];
		for (const x in this.config.peers) {
			// TODO may need to handle multiple fabric-ca server ??
			if (this.config.peers[x].url) {
				const peer = {
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
	// TOD need to verify maybe there is a better way of getting the key/value from the configuration
	getOrganizationsConfig() {
		const orgMsp = [];
		let adminPrivateKeyPath;
		let signedCertPath;
		for (const x in this.config.organizations) {
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
			for (const x in this.config.certificateAuthorities) {
				if (this.config.certificateAuthorities[x].tlsCACerts) {
					serverCertPath = this.config.certificateAuthorities[x].tlsCACerts.path;
				}
			}
		}

		return serverCertPath;
	}

	getCertificateAuthorities() {
		const caURL = [];
		let serverCertPath = null;

		if (this.config.certificateAuthorities) {
			for (const x in this.config.certificateAuthorities) {
				if (this.config.certificateAuthorities[x].tlsCACerts) {
					serverCertPath = this.config.certificateAuthorities[x].tlsCACerts.path;
				}
				if (this.config.certificateAuthorities[x].url) {
					caURL.push(this.config.certificateAuthorities[x].url);
				}
			}
		}
		return { caURL, serverCertPath };
	}

	getPeers() {
		const peers = [];
		for (const x in this.config.peers) {
			if (this.config.peers[x].url) {
				const peer = {
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
