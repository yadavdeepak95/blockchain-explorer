/**
 *    SPDX-License-Identifier: Apache-2.0
 */
const PgService = require('./PgService');

class Persist {
	constructor(pgconfig) {
		this.pgservice = new PgService(pgconfig);
		this.metricservice = null;
		this.crudService = null;
	}

	setMetricService(metricservice) {
		this.metricservice = metricservice;
	}

	setCrudService(crudService) {
		this.crudService = crudService;
	}

	getMetricService() {
		return this.metricservice;
	}

	getCrudService() {
		return this.crudService;
	}

	getPGService() {
		return this.pgservice;
	}

	closeconnection() {
		this.pgservice.closeconnection();
	}
}

module.exports = Persist;
