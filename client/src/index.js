import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Toaster } from "react-hot-toast"
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {/* <React.StrictMode> */}
      <App />
      <Toaster />
      {/* </React.StrictMode> */}
    </PersistGate>
  </Provider>
);

