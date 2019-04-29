import {
  ItemKeys,
  ItemsProp,
  useTransition as useTransitionSpring,
  UseTransitionProps
} from 'react-spring';

import { useMedia } from 'use-media';
import { ObjectOf } from '../generic-types';

function useTransition<
  Item,
  Props extends ObjectOf<unknown> & UseTransitionProps<Item>
>(
  items: ItemsProp<Item>,
  keys: ItemKeys<Item>,
  { immediate, ...values }: Props
) {
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)');
  return useTransitionSpring(items, keys, {
    immediate: immediate || reducedMotion,
    ...values
  });
}

const typedUseTransition = useTransition as typeof useTransitionSpring;
export { typedUseTransition as useTransition };
