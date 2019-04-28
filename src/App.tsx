import React, { useContext, useEffect } from 'react';
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

/* Global CSS + Utilities */
import './App.css';

type Location = RouteComponentProps['location'];

const themeMetaTags: NodeListOf<HTMLMetaElement> = document.querySelectorAll(`
  meta[name="theme-color"],
  meta[name="msapplication-navbutton-color"],
  meta[name="apple-mobile-web-app-status-bar-style"]
`);

const App = () => {
  const { location, ...other }: { location: Location } = useContext(
    __RouterContext
  );
  const previousLocation = useLastValue(location.pathname);

  const noteRegex = /^\/note\/.+?$/;
  const immediate =
    !previousLocation ||
    location.pathname.replace(noteRegex, '') ===
      previousLocation.replace(noteRegex, '');

  const transition = useTransition([location], ({ key }: Location) => key!, {
    x: 100,
    from: {
      x: 100,
      position: 'absolute',
      width: '100%',
      minHeight: '100%'
    },
    enter: { x: 0 },
    leave: { x: 100 },
    config: fast,
    immediate: () => immediate
  });

  console.log(immediate);

  return (
    <>
      {transition.map(({ item, key, props: { x, ...props } }) => {
        let reverse = 1;
        if (location.pathname === '/' || previousLocation === '/note/:id') {
          reverse *= -1;
        }

        const transform = x.interpolate(value => {
          if (item.pathname === location.pathname) {
            // animating in
            return `translateX(${value * reverse}%)`;
          } else {
            // animating out
            return `translateX(${-value * reverse}%)`;
          }
        });

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
