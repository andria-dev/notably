# Notably

An offline note-taking PWA built with React.js with persisted data via the browser's IndexedDB

[![Netlify Status](https://api.netlify.com/api/v1/badges/84e7f8f7-5170-4857-b127-c0b8dd6f14c0/deploy-status)](https://app.netlify.com/sites/notably/deploys)

### Tools used

- [idb-keyval](https://npm.im/idb-keyval) — an abstraction for Indexed DB that uses promises. All **saving/persistence** goes through here
- [slate.js](https://github.com/ianstormtaylor/slate) — a robust content-editable editor that allows for rich-text editing. This is used as **the main editor for the web app**. I began the project using Facebook's [draft.js](https://npm.im/draft-js), however, it is has many flaws and seems to be a dying project
- [use-dark-mode](https://npm.im/use-dark-mode) — a React hook for persisting a setting for dark mode that is initially based on `prefers-color-scheme` media query
- [redux](https://npm.im/redux) — used as state management for React. Originally, I had attempted to use React's Context API to handle state management, and it worked, but it began to cause _performance issues_
- [relative-time-format](https://npm.im/relative-time-format) — a polyfill for `Intl.RelativeTimeFormat` that is loaded dynamically when `Intl.RelativeTimeFormat` is missing. This was used to render a readable form of the time passed since the last edit
