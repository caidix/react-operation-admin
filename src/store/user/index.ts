import { createSlice } from '@reduxjs/toolkit';
import { PlatformConsts } from '@src/consts';
import router from '@src/router';
import { RoutePath } from '@src/routes/config';
import { cloneDeep } from 'lodash-es';
import { removeCookie } from 'typescript-cookie';

export interface CounterState {
  value: number;
  title: string;
}

export interface UserInfo {
  id: number;
  name: string;
  desc: string;
  password: string;
  email: string;
  phone: string;
  avatar: string;
  age: string;
  nick: string;
  status: number;
  crateTime: string;
  updateTime: string;
  managerCodes?: string[];
  organizationCodes?: string[];
  roles: string[];
}

const initialState = {
  isLogin: false,
  breadcrumbs: [],
  info: {} as UserInfo,
  sessionId: '',
  authList: [] as Array<string>,
  currentApp: { code: PlatformConsts.APP_PLATFORM_CODE, name: '' },
  menuList: [],
};

// 创建一个 Slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // 定义 reducers 并生成关联的操作
  reducers: {
    setLogin(state, action) {
      const payload: { user: any; sessionId: string } = action.payload;
      // state = {
      //   ...state,
      //   isLogin: true,
      //   info: { ...payload.user },
      //   sessionId: payload.sessionId,
      // };
      state.isLogin = true;
      state.info = { ...payload.user };
      state.sessionId = payload.sessionId;
      console.log({ state }, '执行setlogin');
    },
    setLogout(state, action) {
      const { isBack = true } = action.payload;
      state = cloneDeep(initialState);

      removeCookie('sessionId');
      if (isBack) {
        const pathname = router.location.pathname;
        // 由于有basename 所有采用后缀模式
        if (pathname.endsWith(RoutePath.LOGIN)) {
          return;
        }
        router.replace(`${RoutePath.LOGIN}?from=${pathname}`);
      } else {
        router.replace(RoutePath.LOGIN);
      }
    },
    setBreadcrumbs(state, action) {
      const payload = action.payload;
      state = {
        ...state,
        breadcrumbs: payload.breadcrumbs,
      };
    },
    setCurrentApp(state, action) {
      const payload = action.payload;
      state = {
        ...state,
        currentApp: payload.currentApp,
      };
    },
    setMenuList(state, action) {
      const payload = action.payload;
      state = {
        ...state,
        menuList: payload.menuList,
      };
    },
    setAuthList(state, action) {
      const payload = action.payload;
      state = {
        ...state,
        authList: payload.authList,
      };
    },
  },
});
// 导出加减的方法
export const { setLogin, setLogout, setCurrentApp, setAuthList } = userSlice.actions;

// 默认导出
export default userSlice.reducer;
