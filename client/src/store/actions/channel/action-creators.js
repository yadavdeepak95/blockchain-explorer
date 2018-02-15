import { createAction } from 'redux-actions'
import * as actionTypes from '../action-types'
import { post } from '../../../services/request.js';
export const getChannel = () => dispatch => {
    post('/curChannel')
        .then(resp => {
            dispatch(createAction(actionTypes.CHANNEL)(resp))
        }).catch((error) => {
            console.error(error);
        })
}

