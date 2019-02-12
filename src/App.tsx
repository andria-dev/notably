import React, { useReducer } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './pages/home';

import { reducer, initialState, StoreContext } from './store';

function App() {
  const store = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={store}>
      <Router>
        <Route exact path="/" component={Home} />
      </Router>
    </StoreContext.Provider>
  );
}

export default App;
