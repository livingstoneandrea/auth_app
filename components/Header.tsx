import React from "react";

const Header = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold">Notifier App</h1>
      <div className="flex items-center space-x-4">
        <span>Hello, {user?.email}</span>
        <button
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
