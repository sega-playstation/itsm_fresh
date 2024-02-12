import {
  Navigate,
  createSearchParams,
  generatePath,
  useLocation,
  useParams,
} from 'react-router-dom';

export default function NavigateParams({ to, search }) {
  const routerParams = useParams();
  const { search: existingSearch } = useLocation();

  return (
    <Navigate
      to={{
        pathname: generatePath(to, routerParams),
        search: search ? `?${createSearchParams(search)}` : existingSearch,
      }}
    />
  );
}
