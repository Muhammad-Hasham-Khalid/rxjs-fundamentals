import { fromEvent, merge, interval, concat, race, forkJoin } from 'rxjs';
import { startWith, take, map } from 'rxjs/operators';
import {
  labelWith,
  startButton,
  pauseButton,
  setStatus,
  bootstrap,
} from './utilities';

const start$ = fromEvent(startButton, 'click').pipe(map(() => true));
const pause$ = fromEvent(pauseButton, 'click').pipe(map(() => false));

const isRunning$ = merge(start$, pause$).pipe(startWith(false));

isRunning$.subscribe(setStatus);

const first$ = interval(1000).pipe(map(labelWith('First')), take(5));
const second$ = interval(1000).pipe(map(labelWith('Second')), take(4));

const combined$ = forkJoin([first$, second$]);

bootstrap({ first$, second$, combined$ });
