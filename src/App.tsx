import React, { memo, useContext, useEffect } from 'react';
import {
  // @ts-ignore
  __RouterContext,
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  Switch
} from 'react-router-dom';

import { animated, OpaqueInterpolation } from 'react-spring';
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

const App = () => {
  const { location }: { location: Location } = useContext(__RouterContext);
  const transition = useTransition(
    [location],
    (currentLocation: Location) => currentLocation.pathname,
    {
      from: {
        transform: 'translateX(100%)',
        position: 'absolute',
        width: '100%'
      },
      enter: { transform: 'translateX(0%)' },
      leave: { transform: 'translateX(100%)' }
    }
  );

  return (
    <>
      {transition.map(({ item, key, props }) => (
        // @ts-ignore
        <animated.div style={props} key={key}>
          <Switch location={item}>
            <Route exact path="/" component={Home} />
            <Route exact path="/note/:id" component={Note} />
          </Switch>
        </animated.div>
      ))}
    </>
  );
};

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
