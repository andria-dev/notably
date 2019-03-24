import React, { memo, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './pages/home';
import Note from './pages/note';

import { getNotes, ReduxProvider, store } from './store';

/* Global CSS + Utilities */
import './App.css';

function App() {
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
