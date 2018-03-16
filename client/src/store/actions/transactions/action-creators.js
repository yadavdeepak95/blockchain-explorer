import { createAction } from 'redux-actions'
import * as actionTypes from '../action-types'
import { get } from '../../../services/request.js';
export const getTransactionList = (offset) => dispatch => {
    get('/api/txList/mychannel/0/0/10/'+offset)
        .then(resp => {
            dispatch(createAction(actionTypes.TX_LIST)(resp))
        }).catch((error) => {
            console.error(error);
        })
}

