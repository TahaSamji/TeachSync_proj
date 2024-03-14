import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import { useSelector } from 'react-redux';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  const loggedIn = useSelector(state => state.user.loggedIn)

  return useRoutes(loggedIn ? [MainRoutes] : [AuthenticationRoutes]);
}
