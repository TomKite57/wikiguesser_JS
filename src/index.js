import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createGlobalStyle } from 'styled-components';
import { lightTheme } from './theme';

const createCssVar = (items, prefix = '-') =>
  Object.entries(items).flatMap(([key, value]) => {
    const varName = `${prefix}-${key}`;
    if (typeof value === 'object')
      return createCssVar(value, varName);
    return `${varName}:${value}`;
  });

const createCssVars = (colors) => createCssVar(colors).join(';');
const GlobalStyle = createGlobalStyle`
  :root {
    /* We assign variables to root element */
    ${createCssVars(lightTheme)}
  }
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyle/>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
