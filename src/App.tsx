import React, { memo, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './pages/home';
import Note from './pages/note';

import useDarkMode from 'use-dark-mode';
import { getNotes, ReduxProvider, store } from './store';

/* Global CSS + Utilities */
import './App.css';

function App() {
  useDarkMode(false, {
    onChange: (isDark?: boolean) => {
      if (isDark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
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
