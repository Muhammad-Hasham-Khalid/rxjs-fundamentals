import {
  fromEvent,
  concat,
  of,
  race,
  timer,
  tap,
  exhaustMap,
  delay,
  shareReplay,
  first,
} from 'rxjs';

import {
  responseTimeField,
  showLoadingAfterField,
  showLoadingForAtLeastField,
  loadingStatus,
  showLoading,
  form,
  fetchData,
} from './utilities';

const loading$ = fromEvent(form, 'submit').pipe(
  exhaustMap(() => {
    const data$ = fetchData().pipe(shareReplay(1));

    const showLoading$ = of(true).pipe(
      delay(+showLoadingAfterField.value),
      tap(() => showLoading(true)),
    );

    const hideLoading$ = timer(+showLoadingForAtLeastField.value).pipe(first());

    const shouldShowLoading$ = race(showLoading$, data$);

    return concat(shouldShowLoading$, data$, hideLoading$);
  }),
);

loading$.subscribe();
