import React, { useContext, useEffect, useState } from 'react';
import {
  // @ts-ignore
  __RouterContext,
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  Switch
} from 'react-router-dom';

import { animated } from 'react-spring';
import { useLastValue, useTransition } from './hooks';
import { fast } from './spring-configs';

import Home from './pages/home';
import Note from './pages/note';

import { getNotes, ReduxProvider, store } from './store';

import useDarkMode from 'use-dark-mode';
import { DarkModeContext } from './contexts';
import { ObjectOf } from './lib/generic-types';

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
  const previousLocation = useLastValue(location.pathname);

  const noteRegex = /^\/note\/.+?$/;
  const fade =
    !previousLocation ||
    location.pathname.replace(noteRegex, '') ===
      previousLocation.replace(noteRegex, '');

  const [resting, setResting] = useState(false);
  const transition = useTransition([location], ({ key }: Location) => key!, {
    x: 100,
    from: {
      x: fade ? 0 : 100,
      position: 'absolute',
      width: '100%',
      minHeight: '100%',
      opacity: fade ? 0 : 1
    },
    enter: {
      x: 0,
      opacity: 1
    },
    leave: {
      x: fade ? 0 : 100,
      opacity: fade ? 0 : 1
    },
    config: fast,
    onStart() {
      setResting(false);
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onRest() {
      setResting(true);
      document.body.style.overflow = '';
      document.body.style.pointerEvents = '';
    }
  });

  return (
    <>
      {transition.map(({ item, key, props: { x, ...props } }) => {
        let reverse = 1;
        if (location.pathname === '/' || previousLocation === '/note/:id') {
          reverse *= -1;
        }

        let transform: ObjectOf<any> | null = x.interpolate(value => {
          if (item.pathname === location.pathname) {
            // animating in
            return `translateX(${value * reverse}%)`;
          } else {
            // animating out
            return `translateX(${-value * reverse}%)`;
          }
        });

        if (resting) {
          transform = null;
        }

        return (
          <animated.div style={{ transform, ...props } as any} key={key}>
            <Switch location={item}>
              <Route exact path="/" component={Home} />
              <Route exact path="/note/:id" component={Note} />
            </Switch>
          </animated.div>
        );
      })}
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
