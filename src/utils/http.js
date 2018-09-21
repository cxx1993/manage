/**
 * 封装axios
 * @author:chenxin
 *
 * 注：⚠️
 * 使用封装的axios的本文件的post，get...方法
 * 请求拦截：将token放在header中
 * 响应拦截：调取request里的handleRES检测/更新token
 */

import axios from 'axios';
import qs from 'qs';
import { getAuthority } from '@/utils/authority';
// import { Feedback } from '@icedesign/base';
import { handleRES } from './request';


// const Toast = Feedback.toast;

const instance = axios.create();
instance.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';
instance.defaults.timeout = 20 * 1000;

instance.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  res => {
    const { code, isSuccess, result } = res.data;
    handleRES(res.data); // 处理token

    if (code !== 200 || !isSuccess || !result) {
      return Promise.reject(res.data);
    }

    return Promise.resolve(res.data);
  },
  err => {
    return Promise.reject(err.data);
  }
);

export function get(url, data) {
  const params = data || {};
  const token = getAuthority();

  return instance({
    method: 'GET',
    url,
    params,
    headers: {
      'x-access-token': token,
    },
    paramsSerializer: param => qs.stringify(param, { arrayFormat: 'brackets' }),
  });
}

function makeRequest(method) {
  return function _doRequest(url, data) {
    const token = getAuthority();
    let params = data || {};
    params = qs.stringify(params);

    return instance({
      method,
      url,
      data: params,
      headers: {
        'x-access-token': token,
      },
    });
  };
}

export const post = makeRequest('POST');
export const put = makeRequest('PUT');
export const del = makeRequest('DELETE');
