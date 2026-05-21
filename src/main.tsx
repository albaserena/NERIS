import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import App from './app/App';
import { DogsProvider } from './app/context/DogsContext';
import { AuthProvider } from './app/context/AuthContext';

ReactDOM.createRoot(
  document.getElementById('root')!
).render(

  <React.StrictMode>

    <BrowserRouter>

      <AuthProvider>

        <DogsProvider>

          <App />

        </DogsProvider>

      </AuthProvider>

    </BrowserRouter>

  </React.StrictMode>
);