'use client';

import React, { useEffect, useState } from 'react';

export default function withAuth<T extends React.JSX.IntrinsicAttributes>(
  WrappedComponent: React.ComponentType<T>
) {
  const AuthWrapper = (props: T) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsAuthenticated(loggedIn);
    }, []);

    if (isAuthenticated === null) {
      return <p className="text-center mt-10">Checking authentication...</p>;
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-600 text-lg">Please login to access this page.</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return AuthWrapper;
}
