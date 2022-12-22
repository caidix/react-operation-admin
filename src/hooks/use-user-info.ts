import { RootState } from '@src/store';
import { UserInfo } from '@src/store/user';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
export default function useUserInfo(): [
  UserInfo,
  {
    hasRoleByCode: (code: string) => boolean;
    isManager: (code: string) => boolean;
  },
] {
  const user = useSelector((store: RootState) => store.user);
  const info = user.info;

  const actions = useMemo(() => {
    const { roles = [], organizationCodes = [], managerCodes = [] } = info || {};

    console.log({ info, managerCodes });
    const hasRoleByCode = (code: string) => {
      return roles.includes(code);
    };
    const isManager = (code: string) => {
      console.log({ managerCodes });

      return managerCodes.includes(code);
    };
    return {
      hasRoleByCode,
      isManager,
    };
  }, [user]);

  return [info, actions];
}
