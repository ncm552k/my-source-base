import { ConfigProvider } from 'antd';
import { createBrowserHistory } from 'history';

import { HistoryRouter } from './routes/history';

const history = createBrowserHistory();

const App = () => {
  return (
    <ConfigProvider>
      <HistoryRouter history={history}>Hellofff123</HistoryRouter>
    </ConfigProvider>
  );
};

export default App;
