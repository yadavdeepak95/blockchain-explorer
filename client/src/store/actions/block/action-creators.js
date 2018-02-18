import { createAction } from 'redux-actions'
import * as actionTypes from '../action-types'
import { post } from '../../../services/request.js';
export const getBlockList = (latestBlockVar) => dispatch => {
    post('/api/block/list', { "lastblockid": latestBlockVar, "maxblocks": 50 })
        .then(resp => {
            dispatch(createAction(actionTypes.BLOCK_LIST_POST)(resp))
        }).catch((error) => {
            console.error(error);
        })
}

export const getBlockInfo = (number) => dispatch => {
    console.log("get info called number is", number);
    post('/api/block/getinfo', {"number":number} )
        .then(resp => {
            dispatch(createAction(actionTypes.BLOCK_INFO_POST)(resp))
        }).catch((error) => {
            console.error(error);
        })
}
