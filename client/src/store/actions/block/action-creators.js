import { createAction } from 'redux-actions'
import * as actionTypes from '../action-types'
import { post } from '../../../services/request.js';
 export const getBlockList = (latestBlockVar) => dispatch => {
    console.log(latestBlockVar);
    post('/api/block/list',{"lastblockid":latestBlockVar,"maxblocks":50})
        .then(resp => {
            dispatch(createAction(actionTypes.BLOCK_LIST_POST)(resp))
        }).catch((error) => {
            console.error(error);
        })
}

