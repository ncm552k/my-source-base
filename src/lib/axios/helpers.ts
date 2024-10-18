import axios from 'axios';

import { KEY_STORAGE } from './constants';

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
};

export const getClientIP = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');

    return response.data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);

    return '127.0.0.1';
  }
};

export const getCurrentTime = () => new Date().getTime();

export const getTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getDeviceId = () => {
  if (typeof window === 'undefined') return '';

  let deviceId = localStorage.getItem(KEY_STORAGE.DEVICE_ID) ?? '';

  if (!deviceId) {
    deviceId = generateUUID(); // Hàm để tạo UUID
    localStorage.setItem(KEY_STORAGE.DEVICE_ID, deviceId);
  }

  return deviceId;
};

export const getDeviceName = () => {
  if (typeof window === 'undefined') return 'Server';

  return navigator.userAgent;
};

export const getDeviceType = () => {
  if (typeof window === 'undefined') return 'Server';

  const userAgent = navigator.userAgent;

  if (userAgent.match(/Android/i)) return 'Android';
  if (userAgent.match(/iPhone|iPad|iPod/i)) return 'iOS';
  if (userAgent.match(/Mac/i)) return 'MacOS';
  if (userAgent.match(/Windows/i)) return 'Windows';

  return 'Unknown';
};
