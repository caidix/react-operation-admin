import queryString from 'query-string';
import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const useRouter = <Q = Record<string, string>>() => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  return useMemo(() => {
    return {
      navigate,
      pathname: location.pathname,
      query: {
        ...queryString.parse(location.search), // Convert string to object
        ...params,
      } as {
        [x: string]: undefined | null | string;
      },
      location,
    };
  }, [params, location]);
};

export default useRouter;
