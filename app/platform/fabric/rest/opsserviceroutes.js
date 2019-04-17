/**
 *    SPDX-License-Identifier: Apache-2.0
 */

const requtil = require('./../../../rest/requestutils');
const explorer_const = require('./../../../common/ExplorerConst').explorer
  .const;

const opsserviceroutes = async function(router, platform) {
  const proxy = platform.getProxy();
  /**
    Get metrics from HLFabric operations service

    'healthz' returns the status of the peer, or orderer UP, or DOWN
    curl -s -X GET \
        http://localhost:8080/api/operationsService/healthz \
        -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTU1Mzc5MTEyNiwiZXhwIjoxNTUzOTYzOTI2fQ.hGl7vXdeaAOFrp133R12v55ZSHuAztliInwdPukWMRg" \
        -H "content-type: application/json" \

    OR

    curl -s -X GET \
        http://localhost:8080/api/operationsService/metrcis \
        -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTU1Mzc5MTEyNiwiZXhwIjoxNTUzOTYzOTI2fQ.hGl7vXdeaAOFrp133R12v55ZSHuAztliInwdPukWMRg" \
        -H "content-type: application/json" \

    The "authorization: Bearer" JWT tokeen can be retrieved using Dev tools in Chrome under Network - Request Headers

*/

  router.get('/operationsService/:network/:type', async (req, res) => {
    let TYPE = explorer_const.HEALTHZ;
    let network = req.params.network;
    let checkType = req.params.type;
    if (checkType) {
      if (checkType === explorer_const.METRICS) {
        TYPE = explorer_const.METRICS;
      }
    }
    console.log(`Initiated /operationsService ${TYPE} request`);
    if (network && checkType) {
      const response = await proxy.getOperationsService(network, checkType);

      if (response) {
        res.send({
          status: 200,
          healthStatus: response
        });
      } else
        res.send({
          status: 200,
          healthStatus: []
        });
    } else {
      return requtil.invalidRequest(req, res);
    }
  });
};

module.exports = opsserviceroutes;
