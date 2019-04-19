import { CSSProperties } from 'react';
import {
  AnimatedValue,
  ForwardedProps,
  TransitionKeyProps,
  useTransition as useTransitionSpring,
  UseTransitionProps,
  UseTransitionResult
} from 'react-spring';

import { useMedia } from 'use-media';
import { ObjectOf } from '../generic-types';

type Merge<A, B> = { [K in keyof A]: K extends keyof B ? B[K] : A[K] } & B;

export function useTransition(items: any, keys: any, values: any) {
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)');
  return useTransitionSpring(items, keys, {
    ...values,
    immediate: reducedMotion
  });
}
