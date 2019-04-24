import { useTransition as useTransitionSpring } from 'react-spring';

import { useMedia } from 'use-media';

export function useTransition(items: any, keys: any, values: any) {
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)');
  return useTransitionSpring(items, keys, {
    ...values,
    immediate: reducedMotion
  });
}
