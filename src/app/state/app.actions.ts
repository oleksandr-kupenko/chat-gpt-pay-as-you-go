import {createAction, props} from '@ngrx/store';
import {Config} from '../app.interface';

export const initConfigAction = createAction('[App Init Config]');
export const configInited = createAction('[App Config Inited]', props<{config: Config | null}>());
