/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import types from './types';

export const login = user => ({
  type: types.LOGIN,
  payload: user
});

export const logout = () => ({
  type: types.LOGOUT
});

export const network = networks => ({
  type: types.NETWORK,
  payload: networks
});

export const error = error => ({
  type: types.ERROR,
  payload: error
});
