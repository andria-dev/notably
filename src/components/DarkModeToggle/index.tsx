import classNames from '@chbphone55/classnames';
import React from 'react';
import useDarkMode from 'use-dark-mode';

import './style.css';

const themeMetaTags: NodeListOf<HTMLMetaElement> = document.querySelectorAll(`
  meta[name="theme-color"],
  meta[name="msapplication-navbutton-color"],
  meta[name="apple-mobile-web-app-status-bar-style"]
`);

interface IDarkModeToggleProps {
  [s: string]: any;
}
function DarkModeToggle({ className, ...props }: IDarkModeToggleProps) {
  const { value, toggle } = useDarkMode(false, {
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

  return (
    <label className={classNames(className, 'DarkModeToggle')} {...props}>
      Dark Mode
      <input
        className="DarkModeToggle__input"
        role="switch"
        type="checkbox"
        onChange={toggle}
        checked={value}
      />
    </label>
  );
}

export default DarkModeToggle;
