import {Config} from '../app.interface';
import {createReducer, on} from '@ngrx/store';
import {configInited} from './app.actions';
import {state} from '@angular/animations';

export interface AppState {
  config: Config | null;
}

export const initAppState: AppState = {
  config: null,
};

export const appReducers = createReducer(
  initAppState,
  on(configInited, (state, {config}) => {
    return {...state, config};
  }),
);

export const appFeatureKey = 'config';
