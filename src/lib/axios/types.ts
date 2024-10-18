import type { ObjectType } from '@src/common/types/utilities';
import type { AxiosHeaders, Method, RawAxiosRequestHeaders } from 'axios';

export type HttpClientProps = {
  url: string;
  method: Method;
  customHeader?: RawAxiosRequestHeaders | AxiosHeaders;
  params?: ObjectType;
  data?: ObjectType;
  pathParams?: ObjectType;
};

export type TQueryConfig = {
  manuallyHandlingErrorMsg?: boolean;
  disableSpinner?: boolean;
};

export type TDefaultAxiosBaseResponse<T> = {
  data: T;
  serverTime: string;
  zoneInfo: string;
  service: string;
  sessionId: string;
  requestId: string;
  code: string;
  message: string;
  errorDesc: string;
  headers: Record<string, string>;
};
