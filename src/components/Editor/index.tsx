import { Editor as DraftEditor, EditorState, getDefaultKeyBinding, RichUtils } from 'draft-js';
import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { inputHandler } from '../../inputHandler';
import { IAction, updateState, useStore } from '../../store';

// @ts-ignore
import CodeUtils from 'draft-js-code';
import Controls from './Controls';
import { blockRenderMap, decorator, hasCommandModifier, styleMap } from './rich-style';

import './style.css';

export const types = {
  CHANGE: 0,
  INLINE: 1,
  BLOCK: 2
};

function EditorStateReducer(state: EditorState, action: IAction): EditorState {
  switch (action.type) {
    case types.CHANGE:
      return EditorState.set(action.payload, { decorator });
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
      let newState;

      // try code key command
      if (CodeUtils.hasSelectionInBlock(editorState)) {
        newState = CodeUtils.handleKeyCommand(editorState, command);
      }

      // try default key command
      if (!newState) {
        newState = RichUtils.handleKeyCommand(currentEditorState, command);
      }

      if (newState) {
        dispatch({ type: types.CHANGE, payload: newState });
        return 'handled';
      }

      // strikethrough key command
      if (command === 'STRIKETHROUGH') {
        dispatch({ type: types.INLINE, payload: 'STRIKETHROUGH' });
        return 'handled';
      }

      return 'not-handled';
    },
    [dispatch]
  );

  const keyBindingFn = useCallback((event: React.KeyboardEvent<{}>): string | null => {
    if (CodeUtils.hasSelectionInBlock(editorState)) {
      const command = CodeUtils.getKeyBinding(event);
      if (command) {
        return command;
      }
    }

    const defaultBinding = getDefaultKeyBinding(event);
    if (defaultBinding) {
      return defaultBinding;
    }

    if (hasCommandModifier(event) && event.shiftKey && event.key === 's') {
      return 'STRIKETHROUGH';
    }

    return null;
  }, []);

  const handleReturn = useCallback(
    event => {
      if (!CodeUtils.hasSelectionInBlock(editorState)) {
        return 'not-handled';
      }

      dispatch({ type: types.CHANGE, payload: CodeUtils.handleReturn(event, editorState) });
      return 'handled';
    },
    [dispatch]
  );

  const onTab = useCallback(
    event => {
      if (!CodeUtils.hasSelectionInBlock(editorState)) {
        return 'not-handled';
      }

      dispatch({ type: types.CHANGE, payload: CodeUtils.onTab(event, editorState) });
      return 'handled';
    },
    [dispatch]
  );

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
        handleReturn={handleReturn}
        onTab={onTab}
        // @ts-ignore
        blockRenderMap={blockRenderMap}
      />
    </div>
  );
}

export default Editor;
