interface requestIdleCallbackProps {
  didTimeout: boolean;
  timeRemaining: () => number;
}

export function requestIdleCallback(
  cb: (props: requestIdleCallbackProps) => {},
) {
  const start = Date.now();
  return setTimeout(function() {
    cb({
      didTimeout: false,
      timeRemaining() {
        return Math.max(0, 50 - (Date.now() - start));
      },
    });
  }, 1);
}

export const cancelIdleCallback = clearTimeout;
