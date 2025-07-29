import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { AuthContextType } from "../../types";
import { ArrowLeftIcon } from "../icons";
import { Turnstile } from "@marsidev/react-turnstile";

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void; // Called after successful email submission
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSwitchToLogin,
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const auth = useContext(AuthContext) as AuthContextType;
  const [captchaToken, setCaptchaToken] = useState<string | undefined>();
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const turnstileSiteKey = "0x4AAAAAABhuYfA0fxpwvokl";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    if (!captchaToken) {
      setCaptchaError("Please complete the CAPTCHA challenge.");
      return;
    }
    auth.clearError();
    // setMessage(null); // Local message not used, AuthModal displays global errors

    try {
      await auth.resetPasswordForEmail(email, captchaToken);
      // Message is handled by AuthContext alert.
      onSuccess();
    } catch (error: any) {
      console.error("Forgot password failed:", error);
    } finally {
      setCaptchaToken(undefined); // Reset token
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email-forgot"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email address
        </label>
        <input
          id="email-forgot"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {auth.loading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>

      <div className="text-sm text-center pt-2">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="inline-flex items-center font-medium text-brand-primary hover:text-ninja-gold dark:text-ninja-gold dark:hover:text-brand-primary"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to Login
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
