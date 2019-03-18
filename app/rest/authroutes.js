/**
 *    SPDX-License-Identifier: Apache-2.0
 */

const passport = require('passport');

const User = require('../platform/fabric/models/User');

const authroutes = async function(router, platform) {
  const proxy = platform.getProxy();

  /** *
   Network list
   GET /networklist -> /login
   curl -i 'http://<host>:<port>/networklist'
   */
  router.get('/networklist', async (req, res) => {
    proxy.networkList(req).then(list => {
      res.send({
        status: 200,
        networkList: list
      });
    });
  });

  /** *
  Login
  POST /login -> /login
  curl -X POST -H 'Content-Type: routerlication/json' -d '{ 'user': '<user>', 'password': '<password>', 'network': '<network>' }' -i 'http://<host>:<port>/login'
  */
  router.post('/login', async (req, res, next) => {
    console.log('req.body', req.body);
    return passport.authenticate('local-login', (err, token, userData) => {
      if (err) {
        if (err.name === 'IncorrectCredentialsError') {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }
        return res.status(400).json({
          success: false,
          message: 'Could not process the form.'
        });
      }
      return res.json({
        status: 200,
        success: true,
        message: 'You have successfully logged in!',
        token,
        user: userData
      });
    })(req, res, next);
  });

  /** *
  Logout
  POST /logout -> /logout
  curl -X POST -H 'Content-Type: routerlication/json' -i 'http://<host>:<port>/logout'
  */
  router.post('/logout', async (req, res) => {
    // TODO: invalidate jwt token
    console.log(`user logged out`);
  });

  /** *
    Register
    POST /register -> /register
    curl -i 'http://<host>:<port>/register/<user>/<password>/<affiliation>/<roles>'
    *
    */
  router.post(
    '/register/:user/:password/:affiliation/:roles',
    async (req, res) => {
      try {
        const reqUser = await new User(req.params).asJson();
        proxy.register(reqUser).then(userInfo => {
          res.send(userInfo);
        });
      } catch (err) {
        logger.error(err);
        return res.send({
          status: 400,
          message: err.toString()
        });
      }
    }
  );

  /** *
    Enroll
    POST /enroll -> /enroll
    curl -i 'http://<host>:<port>/enroll/<user>/<password>/<affiliation>/<roles>'
    *
    */
  router.post('/enroll/:user/:password', async (req, res) => {
    try {
      const reqUser = await new User(req.params).asJson();
      proxy.enroll(reqUser).then(userInfo => {
        res.send(userInfo);
      });
    } catch (err) {
      logger.error(err);
      return res.send({
        status: 400,
        message: err.toString()
      });
    }
  });
}; //end authroutes()

module.exports = authroutes;
