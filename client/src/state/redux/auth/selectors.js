/**
 *    SPDX-License-Identifier: Apache-2.0
 */

export const authSelector = state => state.auth.user;

export const errorSelector = state => state.auth.error;

export const networkSelector = state => state.auth.networks;

export const registeredSelector = state => state.auth.registered;

export const enrolledSelector = state => state.auth.enrolled;
