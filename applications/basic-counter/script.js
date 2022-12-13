import { fromEvent, interval, merge, NEVER, map, switchMap, scan } from 'rxjs';
import { setCount, startButton, pauseButton } from './utilities';

const start$ = fromEvent(startButton, 'click').pipe(map(() => true));
const pause$ = fromEvent(pauseButton, 'click').pipe(map(() => false));

let counter$ = merge(start$, pause$).pipe(
  switchMap((shouldIBeRunning) => {
    if (shouldIBeRunning) {
      return interval(1000);
    }

    return NEVER;
  }),
  scan((total) => total + 1, 0),
);

counter$.subscribe(setCount);
