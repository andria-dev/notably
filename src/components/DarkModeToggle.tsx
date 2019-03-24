import React from 'react';
import useDarkMode from 'use-dark-mode';
import Toggle from './Toggle';

const themeMetaTags: NodeListOf<HTMLMetaElement> = document.querySelectorAll(`
  meta[name="theme-color"],
  meta[name="msapplication-navbutton-color"],
  meta[name="apple-mobile-web-app-status-bar-style"]
`);

const icons = {
  checked: (
    <img
      src="/moon.png"
      width="16"
      height="16"
      role="presentation"
      style={{ pointerEvents: 'none' }}
    />
  ),
  unchecked: (
    <img
      src="/sun.png"
      width="16"
      height="16"
      role="presentation"
      style={{ pointerEvents: 'none' }}
    />
  )
};

function DarkModeToggle({ ...props }) {
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

  return <Toggle checked={value} onChange={toggle} icons={icons} {...props} />;
}

export default DarkModeToggle;
