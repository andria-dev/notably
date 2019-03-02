import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
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

async function loadRequestIdleCallback() {
  // @ts-ignore
  if (!window.requestIdleCallback) {
    const {
      requestIdleCallback,
      cancelIdleCallback,
    } = await import('./polyfills/requestIdleCallback');
    // @ts-ignore
    window.requestIdleCallback = requestIdleCallback;
    // @ts-ignore
    window.cancelIdleCallback = cancelIdleCallback;
  }
}

async function loadClipboard() {
  // @ts-ignore
  if (!navigator.clipboard.writeText) {
    navigator.clipboard.writeText = (await import('./polyfills/clipboard-write')).writeText;
  }
}

// wait for polyfills
Promise.all([
  loadRelativeTimeFormat(),
  loadRequestIdleCallback(),
  loadClipboard(),
]).then(() => {
  // then render
  ReactDOM.render(<App />, document.getElementById('root'));
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
