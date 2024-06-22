import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { RenderRouteTable } from '~Infrastructure/Routes/RouteTable';
import { ErrorBoundary } from '~Infrastructure/components/ErrorBoundary/ErrorBoundary';
import { createStoreWithState } from '~Infrastructure/redux/store';
import { Navbar } from '~Navbar/Navbar';

import './main.css';

const store = createStoreWithState({});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <Navbar />
          <RenderRouteTable />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
