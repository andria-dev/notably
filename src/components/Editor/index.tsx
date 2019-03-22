import { Editor as DraftEditor, EditorState, getDefaultKeyBinding, RichUtils } from 'draft-js';
import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { inputHandler } from '../../inputHandler';
import { IAction, updateState, useStore } from '../../store';

import Controls from './Controls';
import { hasCommandModifier, styleMap } from './rich-style';
import './style.css';

export const types = {
  CHANGE: 0,
  INLINE: 1,
  BLOCK: 2
};

function EditorStateReducer(state: EditorState, action: IAction): EditorState {
  switch (action.type) {
    case types.CHANGE:
      return action.payload;
    case types.INLINE:
      return RichUtils.toggleInlineStyle(state, action.payload);
    case types.BLOCK:
      return RichUtils.toggleBlockType(state, action.payload);
    default:
      throw new Error(`Invalid action: ${action.type}`);
  }
}

function Editor() {
  const [state] = useStore();

  const id = state.activeNoteID;
  const note = state.notes[id];

  const [editorState, dispatch] = useReducer(EditorStateReducer, note.state);
  const [setter, unmounted] = useMemo(
    () => inputHandler<EditorState>(2000, id, updateState, true),
    [id]
  );
  const handleChange = useCallback(
    newState => {
      dispatch({ type: types.CHANGE, payload: newState });
      setter(newState);
    },
    [dispatch, setter]
  );

  const handleKeyCommand = useCallback(
    (command: string, currentEditorState: EditorState) => {
      const newState = RichUtils.handleKeyCommand(currentEditorState, command);
      if (newState) {
        dispatch({ type: types.CHANGE, payload: newState });
        return 'handled';
      }

      if (command === 'STRIKETHROUGH') {
        dispatch({ type: types.INLINE, payload: 'STRIKETHROUGH' });
        return 'handled';
      }

      return 'not-handled';
    },
    [dispatch]
  );

  const keyBindingFn = useCallback((event: React.KeyboardEvent<{}>): string | null => {
    const defaultBinding = getDefaultKeyBinding(event);
    if (defaultBinding) {
      return defaultBinding;
    }

    if (hasCommandModifier(event) && event.shiftKey && event.key === 's') {
      return 'STRIKETHROUGH';
    }

    return null;
  }, []);

  useEffect(() => {
    dispatch({ type: types.CHANGE, payload: note.state });
    return unmounted;
  }, [id]);

  return (
    <div className="Editor">
      <Controls editorState={editorState} dispatch={dispatch} />
      <DraftEditor
        editorState={editorState}
        onChange={handleChange}
        customStyleMap={styleMap}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={keyBindingFn}
      />
    </div>
  );
}

export default Editor;
