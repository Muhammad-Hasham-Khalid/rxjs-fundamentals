import { fromEvent, interval } from 'rxjs';
import {
  throttleTime,
  debounceTime,
  delay,
  debounce,
  throttle,
  scan,
  map,
  tap,
} from 'rxjs/operators';

import {
  button,
  panicButton,
  addMessageToDOM,
  deepThoughtInput,
  setTextArea,
  setStatus,
} from './utilities';

const panicClicks$ = fromEvent(panicButton, 'click');
const buttonClicks$ = fromEvent(button, 'click').pipe(
  // delay(2000),
  // throttleTime(1000),
  // debounceTime(1000),
  // debounce(() => panicClicks$),
  throttle(() => panicClicks$),
  ``,
);

buttonClicks$.subscribe(addMessageToDOM);
