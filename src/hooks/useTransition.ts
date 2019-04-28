import { CSSProperties } from 'react';
import { useTransition as useTransitionSpring } from 'react-spring';

import { useMedia } from 'use-media';

function useTransition<TItem, DS extends CSSProperties>(
  items: any,
  keys: any,
  values: any
) {
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)');
  return useTransitionSpring(items, keys, {
    immediate: reducedMotion,
    ...values
  });
}

const typedUseTransition = useTransition as typeof useTransitionSpring;
export { typedUseTransition as useTransition };
