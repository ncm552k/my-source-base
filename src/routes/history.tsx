import type { BrowserHistory } from 'history';

import React from 'react';
import { Router } from 'react-router-dom';

type THistoryRouterProps = {
  history: BrowserHistory;
  children: React.ReactNode;
};

export const HistoryRouter = ({ history, children }: THistoryRouterProps) => {
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => {
    history.listen(setState);
  }, [history]);

  return React.createElement(Router, Object.assign({ children, navigator: history }, state));
};
