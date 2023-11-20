import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider  } from './AuthProvider';
import ReactDOM from 'react-dom/client';
import './index.sass';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
