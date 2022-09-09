import { EventName } from '@src/consts';
import { store } from '@src/store';
import eventBus from '../eventBus';

const microEmitter = eventBus();

/** 发射登录信息 */
export function emitLoginInfo() {
  const state = store.getState();
  const { sessionId, info, isLogin } = state.user;
  microEmitter.emit(EventName.GET_USER_INFO, { sessionId, info, isLogin });
}
