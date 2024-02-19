import {chatFeatureKey, ChatState} from '../components/chat/state/chat.reducers';

export interface AppState {
  [chatFeatureKey]: ChatState;
}
