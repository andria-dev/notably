import Page from './Page';

export default class Note {
  // @ts-ignore
  static rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  public title: string;
  public pages: Page[];
  private lastModified: Date;

  public updateLastModified() {
    this.lastModified = new Date();
  }

  public get timeSinceModified() {
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

    // years
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
