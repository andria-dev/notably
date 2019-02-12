import { EditorState } from 'draft-js';

export default class Page {
  public title: string;
  public state: EditorState;

  constructor(title: string = '', state?: EditorState) {
    if (!state) {
      state = EditorState.createEmpty();
    }

    this.title = title;
    this.state = state;
  }
}
