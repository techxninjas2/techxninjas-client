import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { AuthContextType } from "../../types";
import { GoogleIcon } from "../icons";
import { Turnstile } from "@marsidev/react-turnstile";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | undefined>();
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const turnstileSiteKey = "0x4AAAAAABhuYfA0fxpwvokl";

  const auth = useContext(AuthContext) as AuthContextType;
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (!name.trim()) {
      setFormError("Full Name is required.");
      return;
    }
    if (!captchaToken) {
      setFormError("Please complete the CAPTCHA challenge.");
      return;
    }
    if (!auth) return;
    auth.clearError();

    try {
      await auth.signUp(email, password, name, captchaToken);
      // On successful Supabase call (even if email confirmation is pending), call onSuccess.
      // AuthContext handles alert for email confirmation.
      // onSuccess(); // This might close the modal too soon if email confirmation is the next step.
      // Let AuthModal handle closing on user state change.
    } catch (error: any) {
      console.error("Registration failed:", error);
      // Error will be displayed by AuthModal
    } finally {
      setCaptchaToken(undefined); // Reset token for re-challenge
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    // Optional: gate Google Sign-In button with CAPTCHA if desired
    // if (!captchaToken) { setCaptchaError("Please complete the CAPTCHA first."); return; }
    auth.clearError();
    try {
      await auth.signInWithGoogle(captchaToken); // Pass token if gating
    } catch (error) {
      console.error("Google Sign up failed from button:", error);
    } finally {
      setCaptchaToken(undefined); // Reset token
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={
            auth.loading /* Potentially add || !captchaToken if gating Google button */
          }
          className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 dark:focus:ring-offset-gray-800"
        >
          <GoogleIcon className="w-5 h-5 mr-2" />
          Sign up with Google
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            Or register with email
          </span>
        </div>
      </div>

      {formError && (
        <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md text-sm">
          <p>{formError}</p>
        </div>
      )}
      <div>
        <label
          htmlFor="name-register"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Full Name
        </label>
        <input
          id="name-register"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label
          htmlFor="email-register"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email address
        </label>
        <input
          id="email-register"
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
        <label
          htmlFor="password-register"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Password
        </label>
        <input
          id="password-register"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="confirm-password-register"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Confirm Password
        </label>
        <input
          id="confirm-password-register"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="my-4 w-full">
        {/* CAPTCHA container with proper sizing to prevent cut-off */}
        <div className="captcha-container">
          {!turnstileSiteKey ? (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 rounded-md text-sm text-center max-w-full">
              CAPTCHA is not configured. Please contact support.
            </div>
          ) : (
            <div className="captcha-wrapper">
              <Turnstile
                siteKey={turnstileSiteKey}
                onSuccess={setCaptchaToken}
                onError={() => {
                  setCaptchaError(
                    "CAPTCHA challenge failed. Please refresh and try again."
                  );
                  setCaptchaToken(undefined);
                }}
                onExpire={() => {
                  setCaptchaError(
                    "CAPTCHA challenge expired. Please refresh and try again."
                  );
                  setCaptchaToken(undefined);
                }}
                options={{
                  theme: document.documentElement.classList.contains("dark")
                    ? "dark"
                    : "light",
                }}
              />
            </div>
          )}
        </div>
        {captchaError && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400 text-center max-w-full break-words">
            {captchaError}
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={auth.loading || !captchaToken || !turnstileSiteKey}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-ninja-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 dark:focus:ring-offset-gray-800"
        >
          {auth.loading ? "Registering..." : "Register"}
        </button>
      </div>

      {/* Privacy and Terms Disclaimer */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          By creating an account, you agree to our{" "}
          <Link
            to="/privacy"
            className="text-brand-primary hover:text-ninja-gold dark:text-ninja-gold dark:hover:text-brand-primary underline"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            to="/terms"
            className="text-brand-primary hover:text-ninja-gold dark:text-ninja-gold dark:hover:text-brand-primary underline"
          >
            Terms of Service
          </Link>
          .
        </p>
      </div>

      <div className="text-sm text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-brand-primary hover:text-ninja-gold dark:text-ninja-gold dark:hover:text-brand-primary"
          >
            Login instead
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
