import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setNavigate } from '~Infrastructure/redux/navigate-slice';

export const NavigatorSetter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setNavigate(navigate)); // Set the navigate function globally in Redux
  }, [dispatch, navigate]);

  return null; // This component doesn't render anything
};
