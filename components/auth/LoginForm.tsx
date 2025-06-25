import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { AuthContextType } from '../../types';
import { GoogleIcon } from '../icons';
import { Turnstile } from '@marsidev/react-turnstile';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
  onSuccess: () => void;
}

type LoginTab = 'emailPassword' | 'magicLink';

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onSwitchToForgotPassword, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<LoginTab>('emailPassword');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [magicLinkMessage, setMagicLinkMessage] = useState<string | null>(null);
  const [magicLinkError, setMagicLinkError] = useState<string | null>(null);
  
  const [captchaToken, setCaptchaToken] = useState<string | undefined>();
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const turnstileSiteKey = '0x4AAAAAABhuYfA0fxpwvokl';

  const auth = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    // Reset captcha token and error when tab changes
    setCaptchaToken(undefined);
    setCaptchaError(null);
    auth.clearError(); // Clear any existing auth errors from context
    setMagicLinkMessage(null);
    setMagicLinkError(null);
  }, [activeTab, auth]);

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !captchaToken) return;
    auth.clearError();
    setMagicLinkMessage(null); 
    setMagicLinkError(null);
    try {
      await auth.login(email, password, captchaToken);
      onSuccess(); 
    } catch (error) {
      console.error("Login failed:", error);
      // AuthModal will display auth.error
    } finally {
        setCaptchaToken(undefined); // Reset token for re-challenge
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    // CAPTCHA for Google sign-in button itself is optional, as Google has its own checks.
    // If you want to gate the button click with Turnstile:
    // if (!captchaToken) { setCaptchaError("Please complete the CAPTCHA first."); return; }
    auth.clearError();
    setMagicLinkMessage(null); 
    setMagicLinkError(null);
    try {
      await auth.signInWithGoogle(captchaToken); // Pass token if gating
    } catch (error) {
      console.error("Google Sign in failed from button:", error);
    } finally {
        setCaptchaToken(undefined); // Reset token for Google sign-in if it was used for gating
    }
  };

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !captchaToken) return;
    auth.clearError();
    setMagicLinkMessage(null);
    setMagicLinkError(null);
    try {
      await auth.sendMagicLink(magicLinkEmail, captchaToken);
      setMagicLinkMessage("If your email is registered, a magic link has been sent. Please check your inbox to log in.");
    } catch (error: any) {
      setMagicLinkError(error.message || "Failed to send magic link. Please try again.");
    } finally {
        setCaptchaToken(undefined); // Reset token
    }
  };
  
  const TabButton: React.FC<{ tabId: LoginTab; currentTab: LoginTab; onClick: () => void; children: React.ReactNode }> = ({ tabId, currentTab, onClick, children }) => (
    <button
      type="button"
      role="tab"
      aria-selected={currentTab === tabId}
      onClick={onClick}
      className={`flex-1 py-2.5 px-1 text-sm font-medium text-center border-b-2 focus:outline-none transition-colors duration-200
        ${currentTab === tabId 
          ? 'border-brand-primary text-brand-primary' 
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
    >
      {children}
    </button>
  );

  const renderTurnstile = () => (
    <div className="my-4 flex justify-center"> {/* Centering classes moved here */}
      {!turnstileSiteKey ? (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 rounded-md text-sm text-center">
          CAPTCHA is not configured. Please contact support.
        </div>
      ) : (
        <Turnstile
          siteKey={turnstileSiteKey}
          onSuccess={setCaptchaToken}
          onError={() => { setCaptchaError("CAPTCHA challenge failed. Please refresh and try again."); setCaptchaToken(undefined); }}
          onExpire={() => { setCaptchaError("CAPTCHA challenge expired. Please refresh and try again."); setCaptchaToken(undefined); }}
          options={{ theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light' }}
          // className="flex justify-center" // Removed from here
        />
      )}
      {captchaError && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400 text-center">{captchaError}</p>
      )}
    </div>
  );

  return (
    <>
      <div className="mb-6 flex border-b border-gray-200 dark:border-gray-700" role="tablist" aria-label="Login methods">
        <TabButton tabId="emailPassword" currentTab={activeTab} onClick={() => setActiveTab('emailPassword')}>
          Email & Password
        </TabButton>
        <TabButton tabId="magicLink" currentTab={activeTab} onClick={() => setActiveTab('magicLink')}>
          Magic Link
        </TabButton>
      </div>

      {/* Turnstile is now rendered inside each tab's form */}

      {activeTab === 'emailPassword' && (
        <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={auth.loading /* Potentially add || !captchaToken if gating Google button */}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 dark:focus:ring-offset-gray-800"
            >
              <GoogleIcon className="w-5 h-5 mr-2" />
              Sign in with Google
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
          
          <div>
            <label htmlFor="email-login" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <input
              id="email-login"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="password-login" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password-login"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex items-center justify-end text-sm">
            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              className="font-medium text-brand-primary hover:text-ninja-gold dark:text-ninja-gold dark:hover:text-brand-primary"
            >
              Forgot your password?
            </button>
          </div>
          
          {renderTurnstile()}

          <div>
            <button
              type="submit"
              disabled={auth.loading || !captchaToken || !turnstileSiteKey}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-ninja-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 dark:focus:ring-offset-gray-800"
            >
              {auth.loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'magicLink' && (
        <form onSubmit={handleSendMagicLink} className="space-y-4">
          <div>
            <label htmlFor="magic-link-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <input
              id="magic-link-email"
              name="magicLinkEmail"
              type="email"
              autoComplete="email"
              required
              value={magicLinkEmail}
              onChange={(e) => setMagicLinkEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>

          {magicLinkMessage && (
            <div className="p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-200 rounded-md text-sm">
              <p>{magicLinkMessage}</p>
            </div>
          )}
          {magicLinkError && (
             <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md text-sm">
              <p>{magicLinkError}</p>
            </div>
          )}

          {renderTurnstile()}

          <div>
            <button
              type="submit"
              disabled={auth.loading || !captchaToken || !turnstileSiteKey}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-ninja-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 dark:focus:ring-offset-gray-800"
            >
              {auth.loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </div>
        </form>
      )}

      {/* Privacy and Terms Disclaimer */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          By logging in, you agree to our{' '}
          <Link 
            to="/privacy" 
            className="text-brand-primary hover:text-ninja-gold dark:text-ninja-gold dark:hover:text-brand-primary underline"
          >
            Privacy Policy
          </Link>
          {' '}and{' '}
          <Link 
            to="/terms" 
            className="text-brand-primary hover:text-ninja-gold dark:text-ninja-gold dark:hover:text-brand-primary underline"
          >
            Terms of Service
          </Link>
          .
        </p>
      </div>

      <div className="mt-6 text-sm text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium text-brand-primary hover:text-ninja-gold dark:text-ninja-gold dark:hover:text-brand-primary"
          >
            Register instead
          </button>
        </p>
      </div>
    </>
  );
};

export default LoginForm;