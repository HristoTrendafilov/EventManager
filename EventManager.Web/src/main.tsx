import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDOM from 'react-dom/client';
import 'react-image-gallery/styles/css/image-gallery.css';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Footer } from '~/Footer/Footer';
import { RenderRouteTable } from '~/Infrastructure/Routes/RouteTable';
import { ErrorBoundary } from '~/Infrastructure/components/ErrorBoundary/ErrorBoundary';
import { NavigatorSetter } from '~/Infrastructure/components/NavigationSetter';
import { store } from '~/Infrastructure/redux/store';
import { Navbar } from '~/Navbar/Navbar';

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
          <ToastContainer />
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
