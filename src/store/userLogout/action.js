/*
 *
 * userLogout actions
 *
 */

import { push } from 'react-router-redux';
import { Feedback } from '@icedesign/base';
import { postUserLogout } from '../../api';
import { setAuthority } from '../../utils/authority';
import { reloadAuthorized } from '../../utils/Authorized';
import {
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_FAILURE,
  USER_LOGOUT_SUCCESS,
} from './constants';

const userLogoutRequest = () => {
  return {
    type: USER_LOGOUT_REQUEST,
    isLoading: true,
  };
};

const userLogoutSuccess = payload => {
  return {
    type: USER_LOGOUT_FAILURE,
    isLoading: false,
    payload,
  };
};

const userLogoutFailure = payload => {
  return {
    type: USER_LOGOUT_SUCCESS,
    isLoading: false,
    payload,
  };
};

export const userLogout = () => {
  return async dispatch => {
    dispatch(userLogoutRequest());
    try {
      const response = await postUserLogout();
      // console.log(response);
      dispatch(userLogoutSuccess(response.data));

      const { code, result, isSuccess } = response.data;

      if (code === 200 && isSuccess) {
        setAuthority('');

        reloadAuthorized();

        dispatch(push('/user/login'));
      } else {
        Feedback.toast.error('请稍后重试');
      }
    } catch (error) {
      dispatch(userLogoutFailure(error));
    }
  };
};
