import {
  debounceTime,
  distinctUntilChanged,
  first,
  fromEvent,
  map,
  merge,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import {
  addResults,
  clearResults,
  form,
  renderPokemon,
  search,
} from '../pokemon/utilities';

const endpoint = 'http://localhost:3333/api/pokemon';

const searchPokemon = (searchTerm) => {
  return fromFetch(`${endpoint}/search/${searchTerm}`).pipe(
    mergeMap((response) => response.json()),
  );
};

const getPokemonData = (pokemon) => {
  return fromFetch(`${endpoint}/${pokemon.id}`).pipe(
    mergeMap((response) => response.json()),
  );
};

const formSubmit$ = fromEvent(form, 'submit').pipe(
  map(() => search.value),
  switchMap(searchPokemon),
  map((data) => data.pokemon),
  mergeMap((pokemon) => pokemon),
  first(),
  switchMap((pokemon) => {
    const pokemon$ = of(pokemon);

    const additionalData$ = getPokemonData(pokemon).pipe(
      map((data) => ({ ...pokemon, data })),
    );

    return merge(pokemon$, additionalData$);
  }),
  tap(renderPokemon),
);

const search$ = fromEvent(search, 'input').pipe(
  debounceTime(300),
  map((event) => event.target.value),
  distinctUntilChanged(), // if it is the same value as the last time don't send a request
  switchMap(searchPokemon),
  tap(clearResults),
  map((data) => data.pokemon),
  tap(addResults),
);

formSubmit$.subscribe(console.log);
