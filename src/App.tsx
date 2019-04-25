import React, { memo, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  Switch
} from 'react-router-dom';

import { animated } from 'react-spring';
import { useTransition } from './hooks';

import Home from './pages/home';
import Note from './pages/note';

import { getNotes, ReduxProvider, store } from './store';

import useDarkMode from 'use-dark-mode';
import { DarkModeContext } from './contexts';

/* Global CSS + Utilities */
import './App.css';

type Location = RouteComponentProps['location'];

const themeMetaTags: NodeListOf<HTMLMetaElement> = document.querySelectorAll(`
  meta[name="theme-color"],
  meta[name="msapplication-navbutton-color"],
  meta[name="apple-mobile-web-app-status-bar-style"]
`);

const App = memo(() => {
  const transition = useTransition(
    [location],
    (currentLocation: Location) => currentLocation.pathname,
    {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 }
    }
  );

  return transition.map(({ item, key, props }) => (
    <animated.div style={props} key={key}>
      <Switch location={item}>
        <Route exact path="/" component={Home} />
        <Route exact path="/note/:id" component={Note} />
      </Switch>
    </animated.div>
  ));
});

function AppWrapper() {
  const darkMode = useDarkMode(false, {
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
      <DarkModeContext.Provider value={darkMode}>
        <Router>
          <App />
        </Router>
      </DarkModeContext.Provider>
    </ReduxProvider>
  );
}

export default AppWrapper;
