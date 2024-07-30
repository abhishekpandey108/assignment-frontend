import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '../../assets/logout.svg';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-custom-gray text-white">
      <h1 className="text-xl font-bold">Customer KYC</h1>
      <div className="relative group">
        <button
          onClick={handleLogout}
          className="w-10 h-10 bg-custom-orange rounded-full flex items-center justify-center hover:bg-custom-orange/80 transition-all duration-300 ease-in-out"
          aria-label="Logout"
        >
          <img src={LogoutIcon} alt="Logout" className="w-5 h-5" />
        </button>
        <div className="absolute -top-10 right-0 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Logout
        </div>
      </div>
    </header>
  );
};

export default Header;
