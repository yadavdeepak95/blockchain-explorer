/**
 *    SPDX-License-Identifier: Apache-2.0
 */

const requtil = require('./requestutils');

const platformroutes = async function(router, platform) {
  const proxy = platform.getProxy();

  /**
  Transactions by Organization(s)
  GET /txByOrg
  curl -i 'http://<host>:<port>/txByOrg/<channel_genesis_hash>'
  Response:
  {'rows':[{'count':'4','creator_msp_id':'Org1'}]}
  */
  router.get('/txByOrg/:channel_genesis_hash', (req, res) => {
    const channel_genesis_hash = req.params.channel_genesis_hash;

    if (channel_genesis_hash) {
      proxy
        .getTxByOrgs(channel_genesis_hash)
        .then(rows => res.send({ status: 200, rows }));
    } else {
      return requtil.invalidRequest(req, res);
    }
  });

  /**
  Channels
  GET /channels -> /channels/info
  curl -i 'http://<host>:<port>/channels/<info>'
  Response:
  [
    {
      'channelName': 'mychannel',
      'channel_hash': '',
      'craetedat': '1/1/2018'
    }
  ]
  */
  router.get('/channels/info', (req, res) => {
    proxy
      .getChannelsInfo()
      .then(data => {
        data.forEach(element => {
          element.createdat = new Date(element.createdat).toISOString();
        });
        res.send({ status: 200, channels: data });
      })
      .catch(err => res.send({ status: 500 }));
  });

  /** *Peer Status List
  GET /peerlist -> /peersStatus
  curl -i 'http://<host>:<port>/peersStatus/<channel>'
  Response:
  [
    {
      'requests': 'grpcs://127.0.0.1:7051',
      'server_hostname': 'peer0.org1.example.com'
    }
  ]
  */
  router.get('/peersStatus/:channel', (req, res) => {
    const channelName = req.params.channel;
    if (channelName) {
      proxy.getPeersStatus(channelName).then(data => {
        res.send({ status: 200, peers: data });
      });
    } else {
      return requtil.invalidRequest(req, res);
    }
  });

  /** *
  Block by number
  GET /block/getinfo -> /block
  curl -i 'http://<host>:<port>/block/<channel>/<number>'
  */
  router.get('/block/:channel_genesis_hash/:number', (req, res) => {
    const number = parseInt(req.params.number);
    const channel_genesis_hash = req.params.channel_genesis_hash;
    if (!isNaN(number) && channel_genesis_hash) {
      proxy.getBlockByNumber(channel_genesis_hash, number).then(block => {
        res.send({
          status: 200,
          number: block.header.number.toString(),
          previous_hash: block.header.previous_hash,
          data_hash: block.header.data_hash,
          transactions: block.data.data
        });
      });
    } else {
      return requtil.invalidRequest(req, res);
    }
  });

  /**
  Return list of channels
  GET /channellist -> /channels
  curl -i http://<host>:<port>/channels
  Response:
  {
    'channels': [
      {
        'channel_id': 'mychannel'
      }
    ]
  }
  */
  router.get('/channels', (req, res) => {
    proxy.getChannels().then(channels => {
      const response = {
        status: 200
      };
      response.channels = channels;
      res.send(response);
    });
  });

  /**
  Return current channel
  GET /curChannel
  curl -i 'http://<host>:<port>/curChannel'
  */
  router.get('/curChannel', (req, res) => {
    proxy.getCurrentChannel().then(data => {
      res.send(data);
    });
  });

  /**
  Return change channel
  POST /changeChannel
  curl -i 'http://<host>:<port>/curChannel'
  */
  router.get('/changeChannel/:channel_genesis_hash', (req, res) => {
    const channel_genesis_hash = req.params.channel_genesis_hash;
    proxy.changeChannel(channel_genesis_hash).then(data => {
      res.send({
        currentChannel: data
      });
    });
  });

  /** *
  Read 'blockchain-explorer/app/config/CREATE-CHANNEL.md' on 'how to create a channel'

  The values of the profile and genesisBlock are taken fron the configtx.yaml file that
  is used by the configtxgen tool
  Example values from the defualt first network:
  profile = 'TwoOrgsChannel';
  genesisBlock = 'TwoOrgsOrdererGenesis';
  */

  /*
  Create new channel
  POST /channel
  Content-Type : application/x-www-form-urlencoded
  {channelName:'newchannel02'
  genesisBlock:'TwoOrgsOrdererGenesis'
  orgName:'Org1'
  profile:'TwoOrgsChannel'}
  {fieldname: 'channelArtifacts', fieldname: 'channelArtifacts'}
  <input type='file' name='channelArtifacts' multiple />
  Response: {  success: true, message: 'Successfully created channel '   }
  */
  router.post('/channel', async (req, res) => {
    try {
      // upload channel config, and org config
      const artifacts = await requtil.aSyncUpload(req, res);
      const chCreate = await proxy.createChannel(artifacts);
      const channelResponse = {
        success: chCreate.success,
        message: chCreate.message
      };
      return res.send(channelResponse);
    } catch (err) {
      logger.error(err);
      const channelError = {
        success: false,
        message: 'Invalid request, payload'
      };
      return res.send(channelError);
    }
  });

  /**
  An API to join channel
  POST /joinChannel

  curl -X POST -H 'Content-Type: application/json' -d '{ 'orgName':'Org1','channelName':'newchannel'}' http://localhost:8080/joinChannel

  Response: {  success: true, message: 'Successfully joined peer to the channel '   }
  */
  router.post('/joinChannel', (req, res) => {
    const channelName = req.body.channelName;
    const peers = req.body.peers;
    const orgName = req.body.orgName;
    if (channelName && peers && orgName) {
      proxy
        .joinChannel(channelName, peers, orgName)
        .then(resp => res.send(resp));
    } else {
      return requtil.invalidRequest(req, res);
    }
  });

  /** *Peer Status List
  GET /peerlist -> /peersStatus
  curl -i 'http://<host>:<port>/peersStatus/<channel>'
  Response:
  [
    {
      'requests': 'grpcs://127.0.0.1:7051',
      'server_hostname': 'peer0.org1.example.com'
    }
  ]
  */
  router.get('/peersStatus/:channel', (req, res) => {
    const channelName = req.params.channel;
    if (channelName) {
      proxy.getPeersStatus(channelName).then(data => {
        res.send({ status: 200, peers: data });
      });
    } else {
      return requtil.invalidRequest(req, res);
    }
  });
}; //end platformroutes()

module.exports = platformroutes;
