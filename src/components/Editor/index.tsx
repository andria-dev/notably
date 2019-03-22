import {
  Editor as DraftEditor,
  EditorState,
  getDefaultKeyBinding,
  RichUtils,
  Modifier
} from 'draft-js';
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

        if (newState) {
          handleChange(newState);
          return 'handled';
        }
      }

      // inline code
      if (command === 'code') {
        dispatch({ type: types.INLINE, payload: 'CODE' });
        return 'handled';
      }

      // code block
      if (command === 'code-block') {
        dispatch({ type: types.BLOCK, payload: 'code-block' });
        return 'handled';
      }

      // strikethrough key command
      if (command === 'strikethrough') {
        dispatch({ type: types.INLINE, payload: 'STRIKETHROUGH' });
        return 'handled';
      }

      // try default key command
      newState = RichUtils.handleKeyCommand(currentEditorState, command);
      if (newState) {
        handleChange(newState);
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

    if (hasCommandModifier(event)) {
      if (event.shiftKey) {
        if (event.key === 's') {
          return 'strikethrough';
        }

        if (event.key === 'j') {
          return 'code-block';
        }
      } else {
        if (event.key === 'j') {
          return 'code';
        }
      }
    }

    const defaultBinding = getDefaultKeyBinding(event);
    if (defaultBinding) {
      return defaultBinding;
    }

    return null;
  }, []);

  const handleReturn = useCallback(
    event => {
      if (!CodeUtils.hasSelectionInBlock(editorState)) {
        return 'not-handled';
      }

      handleChange(CodeUtils.handleReturn(event, editorState));
      return 'handled';
    },
    [dispatch]
  );

  const onTab = useCallback(
    event => {
      event.preventDefault();

      // insert tab
      const newContent = Modifier.replaceText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        '  '
      );
      handleChange(EditorState.push(editorState, newContent, 'insert-characters'));

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
        blockRenderMap={blockRenderMap}
      />
    </div>
  );
}

export default Editor;
