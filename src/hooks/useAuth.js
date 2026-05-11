import { useSelector, useDispatch } from 'react-redux';
import { setUser, setSession, logout } from '../store/slices/authSlice';
import { authService } from '../services/authService';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, session, loading, error } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    dispatch(setSession(data.session));
    dispatch(setUser(data.user));
  };

  const register = async (form) => {
    await authService.register(form);
  };

  const logoutUser = async () => {
    await authService.logout();
    dispatch(logout());
  };

  return { user, session, loading, error, login, register, logoutUser };
};