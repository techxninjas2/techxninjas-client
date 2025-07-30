
import React, { useState, useEffect, useContext } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { CloseIcon } from '../icons';
import { AuthContext } from '../../contexts/AuthContext';
import { AuthContextType } from '../../types';
import { ArrowLeft } from 'lucide-react';


type AuthView = 'login' | 'register' | 'forgotPassword';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: AuthView;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = 'login' }) => {
  const [currentView, setCurrentView] = useState<AuthView>(initialView);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (isOpen) {
      setCurrentView(initialView); 
       authContext?.clearError(); 
    }
  }, [isOpen, initialView, authContext]);
  
  useEffect(() => {
    if (authContext?.user && isOpen) {
        onClose();
    }
  }, [authContext?.user, isOpen, onClose]);


  if (!isOpen) {
    return null;
  }

  const switchToRegister = () => setCurrentView('register');
  const switchToLogin = () => setCurrentView('login');
  const switchToForgotPassword = () => setCurrentView('forgotPassword');

  const getTitle = () => {
    switch (currentView) {
      case 'login': return 'Login'; // Title is shorter as per new design
      case 'register': return 'Create Account';
      case 'forgotPassword': return 'Reset Password';
      default: return '';
    }
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) { 
        onClose();
    }
  };


  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className="modal-content dark:bg-gray-800 relative pt-12">
        {/* Mobile Back Button */}
        <div className="sticky top-0 left-0 z-20 w-full flex items-start bg-inherit block sm:hidden" style={{ minHeight: '0' }}>
          <button
            onClick={onClose}
            className="p-2 text-brand-primary hover:text-brand-ninja-gold rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-2 mt-2"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
        
        {currentView === 'login' && (
          <div className="text-center mb-6">
            <h2 id="auth-modal-title-welcome" className="text-2xl font-bold text-brand-primary">
              Welcome to TechXNinjas!
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Sign in to your account to access your dashboard.
            </p>
          </div>
        )}

        <h2 id="auth-modal-title" className={`text-xl font-semibold text-center mb-6 text-brand-text dark:text-dark-text ${currentView === 'login' ? 'sr-only' : ''}`}>
          {/* Title is displayed here for register/forgot, sr-only for login as it has custom header */}
          {getTitle()}
        </h2>


        {authContext?.error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md text-sm">
                <p><strong>Error:</strong> {authContext.error.message}</p>
            </div>
        )}

        {currentView === 'login' && (
          <LoginForm 
            onSwitchToRegister={switchToRegister} 
            onSwitchToForgotPassword={switchToForgotPassword}
            onSuccess={onClose} 
          />
        )}
        {currentView === 'register' && (
          <RegisterForm 
            onSwitchToLogin={switchToLogin} 
            onSuccess={onClose}
          />
        )}
        {currentView === 'forgotPassword' && (
          <ForgotPasswordForm 
            onSwitchToLogin={switchToLogin} 
            onSuccess={() => { switchToLogin(); }}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;