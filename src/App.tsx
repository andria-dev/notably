import React, { useReducer, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './pages/home';

import { reducer, initialState, StoreContext, getNotes } from './store';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getNotes().then(dispatch);
  }, []);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      <Router>
        <Route exact path="/" component={Home} />
      </Router>
    </StoreContext.Provider>
  );
}

export default App;
