import React, { useEffect } from 'react';
import { RootState } from '@src/store';
import { useDispatch, useSelector, useStore } from 'react-redux';
interface IAuthProps {
  children: React.ReactNode;
}

import { getCookie } from 'typescript-cookie';
import { store } from '@src/store';
import router from '@src/router';
import { RoutePath } from '@src/routes/config';
import { setLogout, setLogin, UserInfo } from '@src/store/user';
import { getUserInfo } from '@src/api/user';

export const validateUser = async (): Promise<[UserInfo | undefined, string | undefined]> => {
  const sessionId = getCookie('sessionId');
  const { user } = store.getState();
  if (!user.isLogin) {
    if (!sessionId) {
      router.push(RoutePath.LOGIN);
      store.dispatch(setLogout({}));
      return [undefined, undefined];
    }
    const res = await getUserInfo();
    console.log({ user }, res);
    store.dispatch(
      setLogin({
        user: res,
        sessionId,
      }),
    );
    return [res, sessionId];
  }
  return [user.info, sessionId];
};

const Auth: React.FC<IAuthProps> = (props) => {
  // useEffect(() => {
  //   validateUser();
  // }, []);
  return <>{props.children}</>;
};

export default Auth;
