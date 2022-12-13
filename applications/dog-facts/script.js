import { fromEvent, of, timer, merge, NEVER, EMPTY } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
  catchError,
  exhaustMap,
  mergeMap,
  retry,
  startWith,
  switchMap,
  tap,
  map,
} from 'rxjs/operators';

import {
  fetchButton,
  stopButton,
  clearError,
  clearFacts,
  addFacts,
  setError,
} from './utilities';

const endpoint =
  'http://localhost:3333/api/facts?delay=2000&chaos=true&flakiness=0';

const fetchData = () => {
  return fromFetch(endpoint).pipe(
    tap(clearError),
    mergeMap((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Something went wrong.');
    }),
    retry(4),
    catchError((error) => of({ error: error.message })),
  );
};

const fetch$ = fromEvent(fetchButton, 'click').pipe(map(() => true));
const stop$ = fromEvent(stopButton, 'click').pipe(map(() => false));

const factStream$ = merge(fetch$, stop$).pipe(
  switchMap((shouldFetch) => {
    if (shouldFetch) {
      return timer(0, 30000).pipe(
        tap(clearError),
        tap(clearFacts),
        exhaustMap(fetchData),
      );
    }

    return NEVER;
  }),
);

factStream$.subscribe(addFacts);
