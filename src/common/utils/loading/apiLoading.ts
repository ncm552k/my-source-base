import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

const loadingQueue: number[] = [];

export const startLoadingAPI = () => {
  loadingQueue.push(1);
  NProgress.start();
};

export const stopLoadingAPI = () => {
  loadingQueue.pop();

  if (!loadingQueue.length) {
    NProgress.done();
  }
};
