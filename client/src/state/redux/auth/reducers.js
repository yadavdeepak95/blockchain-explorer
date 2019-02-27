/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import types from './types';

/* Reducers for Dashboard Charts */
const authReducer = (state = { user: '', error: '', networks: [] }, action) => {
  switch (action.type) {
    case types.LOGIN: {
      return {
        ...state,
        ...action.payload
      };
    }
    case types.LOGOUT: {
      return {
        ...state,
        user: ''
      };
    }
    case types.ERROR: {
      return {
        ...state,
        ...action.payload
      };
    }
    case types.NETWORK: {
      return {
        ...state,
        ...action.payload
      };
    }
    default: {
      return state;
    }
  }
};

export default authReducer;
