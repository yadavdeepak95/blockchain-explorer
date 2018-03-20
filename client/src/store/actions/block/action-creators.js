import { createAction } from 'redux-actions'
import * as actionTypes from '../action-types'
import { get } from '../../../services/request.js';
import { getTransactionInfo } from '../transaction/action-creators';

export const getBlockList = (channel, offset) => dispatch => {
    // post('/api/blockAndTxList', { "blocknum": "0","channel":"mychannel", "limitrows": "10","offset":offset })
    get('/api/blockAndTxList/' + channel + '/0/10/' + offset)
        .then(resp => {
            dispatch(createAction(actionTypes.BLOCK_LIST_POST)(resp))
        }).catch((error) => {
            console.error(error);
        })
}

// export const getBlockInfo = (number) => dispatch => {
//     post('/api/block/getinfo', { "number": number })
//         .then(resp => {
//             dispatch(createAction(actionTypes.BLOCK_INFO_POST)(resp))
//             if (resp.transactions[0].payload.header.channel_header.tx_id != null) {
//                 dispatch(getTransactionInfo(resp.transactions[0].payload.header.channel_header.tx_id));
//             }
//         }).catch((error) => {
//             console.error(error);
//         })
// }
