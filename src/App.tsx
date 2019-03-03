import React, { useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './pages/home';
import Note from './pages/note';

import { getNotes, initialState, reducer, StoreContext } from './store';

/* Global CSS + Utilities */
import './App.css';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getNotes().then(dispatch);
  }, []);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/note/:id" component={Note} />
        </Switch>
      </Router>
    </StoreContext.Provider>
  );
}

export default App;
