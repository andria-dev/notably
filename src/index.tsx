import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

async function loadRelativeTimeFormat() {
  // @ts-ignore
  if (Intl.RelativeTimeFormat) {
    return;
  }

  // @ts-ignore
  const RelativeTimeFormat = await import('relative-time-format');
  // @ts-ignore
  const en: object = await import('relative-time-format/locale/en');

  RelativeTimeFormat.addLocale(en);
  // @ts-ignore
  Intl.RelativeTimeFormat = RelativeTimeFormat;
}

// wait for polyfills
Promise.all([loadRelativeTimeFormat()]).then(() => {
  // then render
  ReactDOM.render(<App />, document.getElementById('root'));
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
