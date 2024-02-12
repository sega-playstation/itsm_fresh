import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './utils/reportWebVitals';

import App from './App';
import './styles/index.css';
import '@fontsource/inter';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
