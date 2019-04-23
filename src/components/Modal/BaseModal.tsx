import React, { ReactNode, useEffect, useRef } from 'react';
import { useTransition } from '../../hooks';
import ModalBackdrop from './ModalBackdrop';
import ModalPortal from './ModalPortal';

const root = document.getElementById('root')!;
function getFocusable(element: HTMLElement): NodeListOf<HTMLElement> {
  return element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
}

export interface IBaseModalProps {
  children: ReactNode;
  isOpen: boolean;
  onRequestClose: () => void;
}

function BaseModal({ isOpen, onRequestClose, children }: IBaseModalProps) {
  const lastActiveElement = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLElement>(null);

  const backdropTransition = useTransition(isOpen, null, {
    '--opacity': 0,
    from: { '--opacity': 0 },
    enter: { '--opacity': 0.5 },
    leave: { '--opacity': 0 },
    config: { mass: 1, tension: 200, friction: 26 }
  });

  // Close on Escape
  useEffect(() => {
    function listener(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onRequestClose();
      }
    }
    window.addEventListener('keyup', listener);

    return () => {
      window.removeEventListener('keyup', listener);
    };
  }, [onRequestClose]);

  useEffect(() => {
    function handleTab(event: KeyboardEvent) {
      if (event.key === 'Tab' && modalRef.current) {
        const focusedElement = document.querySelector(':focus') as HTMLElement;
        if (!modalRef.current.contains(focusedElement)) {
          const focusableElements = getFocusable(modalRef.current);
          if (!focusableElements.length) {
            // If nothing to focus on, just blur
            return focusedElement.blur();
          }

          // focus on first element
          focusableElements[0].focus();
        }
      }
    }

    if (isOpen) {
      lastActiveElement.current = document.activeElement as HTMLElement;
      root.setAttribute('aria-hidden', 'true');

      if (modalRef.current) {
        const focusableElements = getFocusable(modalRef.current);
        if (focusableElements.length) {
          focusableElements[0].focus();
        }
      }

      window.addEventListener('keyup', handleTab);
    } else {
      if (lastActiveElement.current) {
        lastActiveElement.current.focus();
      }
      root.removeAttribute('aria-hidden');

      window.removeEventListener('keyup', handleTab);
    }

    return () => window.removeEventListener('keyup', handleTab);
  }, [isOpen]);

  return (
    <ModalPortal>
      {backdropTransition.map(backdrop =>
        backdrop.item ? (
          <ModalBackdrop
            key={backdrop.key}
            className="BottomModal__backdrop"
            style={backdrop.props}
            onClick={onRequestClose}
            aria-modal="true"
            role="dialog"
            ref={modalRef}
          >
            {children}
          </ModalBackdrop>
        ) : null
      )}
    </ModalPortal>
  );
}

export default BaseModal;
