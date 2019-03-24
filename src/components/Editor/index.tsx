import {
  DraftHandleValue,
  Editor as DraftEditor,
  EditorState,
  getDefaultKeyBinding,
  RichUtils
} from 'draft-js';
import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { inputHandler } from '../../inputHandler';
import { IAction, updateState, useStore } from '../../store';

import {
  getKeyBinding,
  handleKeyCommand,
  handleReturn,
  hasSelectionInBlock,
  onTab
} from 'draft-js-code-custom';
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

  const handleEditorKeyCommand = useCallback(
    (command: string, currentEditorState: EditorState) => {
      let newState;

      // try code key command
      if (hasSelectionInBlock(editorState)) {
        // @ts-ignore
        newState = handleKeyCommand(command, editorState, 2);

        if (newState) {
          handleChange(newState);
          return 'handled';
        }
      }

      // inline code
      switch (command) {
        case 'code':
          dispatch({ type: types.INLINE, payload: 'CODE' });
          return 'handled';

        // code block
        case 'code-block':
          dispatch({ type: types.BLOCK, payload: 'code-block' });
          return 'handled';

        // strikethrough key command
        case 'strikethrough':
          dispatch({ type: types.INLINE, payload: 'STRIKETHROUGH' });
          return 'handled';

        default:
          break;
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
    if (hasSelectionInBlock(editorState)) {
      const command = getKeyBinding(event);
      if (command) {
        return command;
      }
    }

    if (hasCommandModifier(event)) {
      if (event.shiftKey) {
        if (event.key.toLocaleLowerCase() === 's') {
          event.preventDefault();
          return 'strikethrough';
        }

        if (event.key.toLocaleLowerCase() === 'j') {
          event.preventDefault();
          return 'code-block';
        }
      } else {
        if (event.key === 's') {
          event.preventDefault();
          // TODO: save
        }

        if (event.key === 'j') {
          event.preventDefault();
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

  const handleEditorReturn = useCallback(
    (event, currentEditorState): DraftHandleValue => {
      if (hasSelectionInBlock(currentEditorState)) {
        // @ts-ignore
        handleChange(handleReturn(event, currentEditorState, 2));
        return 'handled';
      }

      return 'not-handled';
    },
    [dispatch]
  );

  const handleTab = useCallback(
    event => {
      if (hasSelectionInBlock(editorState)) {
        handleChange(onTab(event, editorState));
        return 'handled';
      }

      return 'not-handled';
    },
    [handleChange, editorState]
  );

  useEffect(() => {
    dispatch({ type: types.CHANGE, payload: note.state });
    return unmounted;
  }, [id]);

  return (
    <main className="Editor">
      <Controls editorState={editorState} dispatch={dispatch} />
      <DraftEditor
        editorState={editorState}
        onChange={handleChange}
        customStyleMap={styleMap}
        // @ts-ignore
        blockRenderMap={blockRenderMap}
        handleKeyCommand={handleEditorKeyCommand}
        keyBindingFn={keyBindingFn}
        handleReturn={handleEditorReturn}
        onTab={handleTab}
      />
    </main>
  );
}

export default Editor;
