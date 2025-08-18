import React, { useState, useEffect } from 'react';
import { checkBrowserCompatibility } from '../utils/polyfills';

interface BrowserCompatibilityProps {
  children: React.ReactNode;
  showWarnings?: boolean;
  fallbackComponent?: React.ReactNode;
}

export const BrowserCompatibility: React.FC<BrowserCompatibilityProps> = ({
  children,
  showWarnings = true,
  fallbackComponent
}) => {
  const [compatibility, setCompatibility] = useState<ReturnType<typeof checkBrowserCompatibility> | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const compat = checkBrowserCompatibility();
    setCompatibility(compat);

    // Check for critical missing features
    const criticalFeatures = ['esModules', 'fetch'];
    const hasCriticalIssues = criticalFeatures.some(feature => !compat[feature as keyof typeof compat]);

    if (hasCriticalIssues) {
      setShowWarning(true);
    }
  }, []);

  // Show fallback for critical issues
  if (showWarning && fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  // Show warning banner for non-critical issues
  if (showWarnings && compatibility && showWarning) {
    const missingFeatures = Object.entries(compatibility)
      .filter(([_, supported]) => !supported)
      .map(([feature]) => feature);

    return (
      <div className="min-h-screen">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Browser Compatibility Notice:</strong> Your browser is missing some modern features. 
                The application may not work optimally. Consider updating to a modern browser.
              </p>
              {missingFeatures.length > 0 && (
                <details className="mt-2">
                  <summary className="text-sm text-yellow-700 cursor-pointer">
                    Missing features: {missingFeatures.length}
                  </summary>
                  <ul className="mt-1 text-xs text-yellow-600 list-disc list-inside">
                    {missingFeatures.map(feature => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setShowWarning(false)}
                  className="inline-flex bg-yellow-50 rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

// Hook for checking browser compatibility in components
export const useBrowserCompatibility = () => {
  const [compatibility, setCompatibility] = useState<ReturnType<typeof checkBrowserCompatibility> | null>(null);

  useEffect(() => {
    setCompatibility(checkBrowserCompatibility());
  }, []);

  return compatibility;
};

// Component for showing browser upgrade recommendation
export const BrowserUpgradeRecommendation: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto mt-8">
      <div className="flex items-center mb-4">
        <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-blue-900">Browser Upgrade Recommended</h3>
      </div>
      <p className="text-blue-800 mb-4">
        For the best experience with TechXNinjas, we recommend using a modern browser with the latest features.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded border">
          <h4 className="font-medium text-gray-900 mb-2">Recommended Browsers</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Chrome 90+</li>
            <li>• Firefox 88+</li>
            <li>• Safari 14+</li>
            <li>• Edge 90+</li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded border">
          <h4 className="font-medium text-gray-900 mb-2">Download Links</h4>
          <div className="space-y-2">
            <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-800">
              Download Chrome
            </a>
            <a href="https://www.mozilla.org/firefox/" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-800">
              Download Firefox
            </a>
            <a href="https://www.microsoft.com/edge" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-800">
              Download Edge
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
