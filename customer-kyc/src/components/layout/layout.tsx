import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './header';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const showHeader = location.pathname !== '/';

  return (
    <>
      {showHeader && <Header />}
      <main>{children}</main>
    </>
  );
};

export default Layout;
