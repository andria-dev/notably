import { ContentBlock, Editor as DraftEditor, EditorState, Modifier, RichUtils } from 'draft-js';
import React, { useEffect, useMemo, useReducer } from 'react';
import { inputHandler } from '../../inputHandler';
import { IAction, updateState, useStore } from '../../store';

import Controls from './Controls';
import { styleMap } from './rich-style';
import './style.css';

function EditorStateReducer(state: EditorState, action: IAction): EditorState {
  switch (action.type) {
    case 'change':
      return action.payload;
    case 'inline':
      return RichUtils.toggleInlineStyle(state, action.payload);
    case 'block':
      return RichUtils.toggleBlockType(state, action.payload);
    case 'set-type':
      const [key] = action.payload.offsetKey.split('-');
      const { contentState, type } = action.payload;

      if (
        contentState
          .getBlockMap()
          .get(key)
          .getType() === action.payload.type
      ) {
        return state;
      }

      const newContentState = Modifier.setBlockType(
        state.getCurrentContent(),
        state.getSelection(),
        action.payload.type
      );
      return EditorState.push(state, newContentState, 'change-block-type');
    default:
      throw new Error(`Invalid action: ${action.type}`);
  }
}

let exportedDispatch: React.Dispatch<IAction>;
export { exportedDispatch as dispatch };

function Editor() {
  const [state] = useStore();

  const id = state.activeNoteID;
  const note = state.notes[id];

  const [editorState, dispatch] = useReducer(EditorStateReducer, note.state);
  exportedDispatch = dispatch;
  const [setter, unmounted] = useMemo(
    () => inputHandler<EditorState>(2000, id, updateState, true),
    [id]
  );

  useEffect(() => {
    dispatch({ type: 'change', payload: note.state });
    return unmounted;
  }, [id]);

  return (
    <div className="Editor">
      <Controls editorState={editorState} dispatch={dispatch} />
      <DraftEditor
        editorState={editorState}
        onChange={newState => {
          dispatch({ type: 'change', payload: newState });
          setter(newState);
        }}
        customStyleMap={styleMap}
      />
    </div>
  );
}

export default Editor;
