import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuthContext();

  if (!session) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;