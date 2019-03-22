import { EditorState } from 'draft-js';
import { decorator } from '../components/Editor/rich-style';

export default class Note {
  // @ts-ignore
  private static longRtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'long' });
  // @ts-ignore
  private static shortRtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'short' });

  public title: string;
  public state: EditorState;
  public lastModified: Date;

  constructor(
    title: string = 'Title',
    state: EditorState = EditorState.createEmpty(decorator),
    lastModified: Date = new Date()
  ) {
    this.title = title;
    this.state = state;
    this.lastModified = lastModified;
  }

  public updateLastModified() {
    this.lastModified = new Date();
  }

  public timeSinceModified({ short } = { short: false }) {
    const now: Date = new Date();
    let timePassed: number = Math.floor(now.getTime() - this.lastModified.getTime());

    const divide = (n: number) => {
      timePassed = Math.floor(timePassed / n);
    };

    const rtf = short ? Note.shortRtf : Note.longRtf;

    divide(1000); // seconds
    if (timePassed < 60) {
      return rtf.format(-timePassed, 'second');
    }

    divide(60); // minutes
    if (timePassed < 60) {
      return rtf.format(-timePassed, 'minute');
    }

    divide(60); // hours
    if (timePassed < 24) {
      return rtf.format(-timePassed, 'hour');
    }

    divide(24); // days
    if (timePassed < 7) {
      return rtf.format(-timePassed, 'day');
    }

    divide(7); // weeks
    if (
      this.lastModified.getUTCMonth() === now.getUTCMonth() ||
      this.lastModified.getUTCDate() < now.getUTCDate()
    ) {
      return rtf.format(-timePassed, 'week');
    }

    divide(30.4167); // months (average)
    if (timePassed < 12) {
      return rtf.format(-timePassed, 'month');
    }

    // years
    return rtf.format(-timePassed, 'year');
  }
}
