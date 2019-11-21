import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import Routes from './routes';
import GlobalStyle from './styles/global';
import { DataProvider } from './components/DataContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/shards-dashboards.1.1.0.min.css';

import store from './store';

function App() {
  return (
    <Provider store={store}>
      <DataProvider>
        <BrowserRouter>
          <Routes />
          <GlobalStyle />
        </BrowserRouter>
      </DataProvider>
    </Provider>
  );
}

export default App;
