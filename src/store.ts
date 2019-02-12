import { useContext, createContext } from 'react';
import { EditorState } from 'draft-js';

class Note {
  static rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  public title: string;
  public pages: Page[];
  private lastModified: Date;

  public updateLastModified() {
    this.lastModified = new Date();
  }

  public get daysSinceModified() {
    const now: Date = new Date();
    let timePassed: number = Math.floor(
      now.getTime() - this.lastModified.getTime(),
    );
    const divide = (n: number) => {
      timePassed = Math.floor(timePassed / n);
    };

    divide(1000); // seconds
    if (timePassed < 60) {
      return Note.rtf.format(-timePassed, 'second');
    }

    divide(60); // minutes
    if (timePassed < 60) {
      return Note.rtf.format(-timePassed, 'minute');
    }

    divide(60); // hours
    if (timePassed < 24) {
      return Note.rtf.format(-timePassed, 'hour');
    }

    divide(24); // days
    if (timePassed < 7) {
      return Note.rtf.format(-timePassed, 'day');
    }

    divide(7); // weeks
    if (
      this.lastModified.getUTCMonth() === now.getUTCMonth() ||
      this.lastModified.getUTCDate() < now.getUTCDate()
    ) {
      return Note.rtf.format(-timePassed, 'week');
    }

    divide(30.4167); // months (average)
    if (timePassed < 12) {
      return Note.rtf.format(-timePassed, 'month');
    }

    return Note.rtf.format(-timePassed, 'year');
  }

  constructor(
    title: string = '',
    pages: Page[] = [],
    lastModified: Date = new Date(),
  ) {
    this.title = title;
    this.pages = pages;
    this.lastModified = lastModified;
  }
}

class Page {
  public title: string;
  public state: EditorState;

  constructor(title: string, state?: EditorState) {
    if (!state) {
      state = EditorState.createEmpty();
    }

    this.title = title;
    this.state = state;
  }
}

interface Action {
  type: string;
  payload: any;
}

function reducer(state: Note[], action: Action) {
  switch (action.type) {
    default:
      return state;
  }
}

const initialState: Note[] = [];
export const StoreContext = createContext([]);

export function useStore() {
  return useContext(StoreContext);
}
