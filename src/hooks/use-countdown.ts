import { useUnmount } from 'ahooks';
import { useRef } from 'react';

export default function useCountdown(count: number) {
  const currentCount = useRef(count);

  const isStart = useRef(false);

  let timerId: ReturnType<typeof setInterval> | null;

  function clear() {
    timerId && window.clearInterval(timerId);
  }

  function stop() {
    isStart.current = false;
    clear();
    timerId = null;
  }

  function start() {
    if (isStart.current || !!timerId) {
      return;
    }
    isStart.current = true;
    timerId = setInterval(() => {
      if (currentCount.current === 1) {
        stop();
        currentCount.current = count;
      } else {
        currentCount.current -= 1;
      }
    }, 1000);
  }

  function reset() {
    currentCount.current = count;
    stop();
  }

  function restart() {
    reset();
    start();
  }

  useUnmount(() => {
    reset();
  });

  return { start, reset, restart, clear, stop, currentCount, isStart };
}
