/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import { post, get } from '../../../services/request';

import {
  login as loginAction,
  logout as logoutAction,
  network as networkAction,
  register as registerAction,
  error as errorAction
} from './actions';

import actions from '../charts/actions';

const login = ({ user, password }, network) => dispatch =>
  post('/api/login', { user, password, network })
    .then(resp => {
      dispatch(errorAction(null));
      dispatch(loginAction({ user, ...resp }));
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error(error);
      dispatch(errorAction(error));
    });

const logout = () => dispatch =>
  post('/api/logout', {})
    .then(() => {
      dispatch(logoutAction());
    })
    .catch(error => {
      // TODO: keeping till api service implemented
      // eslint-disable-next-line no-console
      console.error(error);
      dispatch(logoutAction());
    });

const network = () => dispatch =>
  get('/api/networklist', {})
    .then(({ networkList }) => {
      const networks = networkList.map(network => network[0]);
      dispatch(networkAction({ networks }));
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error(error);
      dispatch(actions.getErroMessage(error));
    });

const register = user => dispatch =>
  post('/api/register', { ...user })
    .then(resp => {
      dispatch(registerAction({ ...user, ...resp }));
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error(error);
      // dispatch(errorAction(error));
      dispatch(registerAction({ ...user }));
    });

export default {
  login,
  logout,
  network,
  register
};
