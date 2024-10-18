import type { HttpClientProps, TQueryConfig } from './types';
import type { ObjectType } from '@src/common/types/utilities';
import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  ParamsSerializerOptions,
  RawAxiosRequestHeaders,
} from 'axios';

import { TOKEN } from '@src/common/constants/auth';
import { startLoadingAPI, stopLoadingAPI } from '@src/common/utils/loading';
import { getAuthToken } from '@src/common/utils/token';
import { notification } from 'antd';
import axios from 'axios';
import qs from 'qs';

import { BASE_URL } from './constants';

const paramsSerializerOptions: ParamsSerializerOptions = {
  serialize: (params) => qs.stringify(params),
};

axios.defaults.paramsSerializer = paramsSerializerOptions;
axios.defaults.timeout = 30000;

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig & TQueryConfig) => {
    const { disableSpinner } = config;

    if (!disableSpinner) {
      startLoadingAPI();
    }

    return config;
  },
  (error: AxiosError) => {
    stopLoadingAPI();

    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    stopLoadingAPI();

    return response;
  },
  async (error: AxiosError) => {
    const { response, code, config } = error;
    const { manuallyHandlingErrorMsg } = config as AxiosError['config'] & TQueryConfig;

    stopLoadingAPI();

    // TODO: handle logic response status 403
    // if (response?.status === 403) {
    // }

    if (response?.status === 408 || code === 'ECONNABORTED') {
      notification.error({ message: 'Request timed out' });
    }

    // TODO: handle logic response status 401
    // if (response?.status === 401 && config?.url !== `${import.meta.env.VITE_APP_BASE_URL}/UserAuth/Authenticate`) {
    //   try {
    //     return await handleRefreshToken(config as AxiosRequestConfig);
    //   } finally {
    //     stopLoadingAPI();
    //   }
    // }

    if (response?.status === 401) {
      try {
        // if (window.location.href !== `/${ROUTES.LOGIN}`) window.location.href = `/${ROUTES.LOGIN}`;
      } finally {
        stopLoadingAPI();
      }
    }

    if (!manuallyHandlingErrorMsg) {
      notification.error({
        message: (response?.data as any)?.message ?? 'Unknown error occurred.',
      });
    }

    return Promise.reject(error);
  },
);

const headers: RawAxiosRequestHeaders = {
  'Content-Type': 'application/json',
  accept: '*/*',
};

export const axiosBaseQuery = <ReturnType>(config: HttpClientProps & TQueryConfig) => {
  const { url, method, data, params, customHeader, manuallyHandlingErrorMsg, disableSpinner, pathParams } = config;
  const accessToken = getAuthToken(TOKEN.ACCESS_TOKEN);

  // Xử lý đường dẫn động với pathParams
  let finalUrl = url;

  if (pathParams) {
    finalUrl = url.replace(/{(\w+)}/g, (_, key) => pathParams[key] || '');
  }

  const axiosConfig = {
    baseURL: BASE_URL,
    url: finalUrl,
    method,
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...headers,
      ...customHeader,
    },
    ...(params && { params }),
    ...(data && { data }),
    manuallyHandlingErrorMsg,
    disableSpinner,
  } as AxiosRequestConfig<ObjectType> & TQueryConfig;

  return new Promise<ReturnType>((resolve, reject) =>
    axios<ReturnType>(axiosConfig)
      .then((response) => resolve(response.data))
      .catch((e: AxiosError) => reject(e)),
  );
};
