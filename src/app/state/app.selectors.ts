import {createFeatureSelector, createSelector} from '@ngrx/store';
import {chatFeatureKey, ChatState} from '../components/chat/state/chat.reducers';
import {AppState} from './app.reducers';

const selectConfig = createFeatureSelector<AppState>(chatFeatureKey);

export const configSelector = createSelector(selectConfig, (appState: AppState) => {
  return appState.config;
});
