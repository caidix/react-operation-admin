import { getCookie } from 'typescript-cookie';
import { store } from '@src/store';
import router from '@src/router';
import { RoutePath } from '@src/routes/config';
import { setLogout } from '@src/store/user';
import { getUserInfo } from '@src/api/user';

export const validateUser = async () => {
  const sessionId = getCookie('sessionId');
  const { user } = store.getState();
  if (!user.isLogin) {
    if (!sessionId) {
      router.push(RoutePath.LOGIN);
      store.dispatch(setLogout({}));
      return false;
    }
    const res = await getUserInfo();
    console.log({ user }, res);
    // dispatch(setLogout({}));
  }
};
