import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AuthModal from './AuthModal';

export default function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleSignIn = (username, password) => {
    // In a real app, you would validate credentials with a backend
    setUser({ username });
    setIsAuthOpen(false);
  };

  const handleSignUp = (username, email, password) => {
    // In a real app, you would send this data to a backend
    setUser({ username, email });
    setIsAuthOpen(false);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-red-500">reddit clone</h1>
          </div>
          
          <div className="flex-1 max-w-xl px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Reddit"
                className="w-full bg-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.username}!</span>
                <button
                  onClick={handleSignOut}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
              >
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />
    </header>
  );
}