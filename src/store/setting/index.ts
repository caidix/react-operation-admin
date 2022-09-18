import { createSlice } from '@reduxjs/toolkit';

export interface SettingState {
  collapsed: boolean;
}

const initialState: SettingState = {
  collapsed: false,
};

// 创建一个 Slice
export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  // 定义 reducers 并生成关联的操作
  reducers: {
    setCollapsed(state, action) {
      const payload = action.payload;
      state.collapsed = payload;
    },
  },
});

export const { setCollapsed } = settingSlice.actions;

// 默认导出
export default settingSlice.reducer;
