import {
  createSearchParams,
  generatePath,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

export default function useNavigateParams() {
  const navigate = useNavigate();
  const routerParams = useParams();
  const { search } = useLocation();

  return (pathname, searchParams) => {
    navigate({
      pathname: generatePath(pathname, routerParams),
      search: searchParams ? `?${createSearchParams(searchParams)}` : search,
    });
  };
}
