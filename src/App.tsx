import React, { memo, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './pages/home';
import Note from './pages/note';

import useDarkMode from 'use-dark-mode';
import { getNotes, ReduxProvider, store } from './store';

/* Global CSS + Utilities */
import './App.css';

const themeMetaTags: NodeListOf<HTMLMetaElement> = document.querySelectorAll(`
  meta[name="theme-color"],
  meta[name="msapplication-navbutton-color"],
  meta[name="apple-mobile-web-app-status-bar-style"]
`);

function App() {
  useDarkMode(false, {
    onChange: (isDark?: boolean) => {
      if (isDark) {
        document.body.classList.add('dark-mode');
        themeMetaTags.forEach((tag: HTMLMetaElement) => {
          tag.content = '#191919';
        });
      } else {
        document.body.classList.remove('dark-mode');
        themeMetaTags.forEach((tag: HTMLMetaElement) => {
          tag.content = '#013b98';
        });
      }
    }
  });

  useEffect(() => {
    getNotes().then(store.dispatch);
  }, []);

  return (
    <ReduxProvider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/note/:id" component={Note} />
        </Switch>
      </Router>
    </ReduxProvider>
  );
}

export default memo(App);
