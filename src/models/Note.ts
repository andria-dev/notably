import { EditorState } from 'draft-js';

export default class Note {
  // @ts-ignore
  private static rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  public title: string;
  public state: EditorState;
  public lastModified: Date;

  constructor(
    title: string = 'Title',
    state: EditorState = EditorState.createEmpty(),
    lastModified: Date = new Date()
  ) {
    this.title = title;
    this.state = state;
    this.lastModified = lastModified;
  }

  public updateLastModified() {
    this.lastModified = new Date();
  }

  public get timeSinceModified() {
    const now: Date = new Date();
    let timePassed: number = Math.floor(now.getTime() - this.lastModified.getTime());
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

    // years
    return Note.rtf.format(-timePassed, 'year');
  }
}
