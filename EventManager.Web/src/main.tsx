import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { Footer } from '~Footer/Footer';
import { RenderRouteTable } from '~Infrastructure/Routes/RouteTable';
import { ErrorBoundary } from '~Infrastructure/components/ErrorBoundary/ErrorBoundary';
import { NavigatorSetter } from '~Infrastructure/components/NavigationSetter';
import { ToastWrapper } from '~Infrastructure/components/ToastMessages/ToastWrapper';
import { store } from '~Infrastructure/redux/store';
import { Navbar } from '~Navbar/Navbar';

import './main.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <NavigatorSetter />
        <ErrorBoundary>
          <ToastWrapper />
          <Navbar />
          <div id="main">
            <RenderRouteTable />
          </div>
          <Footer />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
