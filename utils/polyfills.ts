/**
 * Browser Compatibility Polyfills
 * Provides fallbacks for older browsers that don't support modern JavaScript features
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  // Import Maps Polyfill Detection
  if (!('importMap' in HTMLScriptElement.prototype)) {
    console.log('Import maps not natively supported, using polyfill');
  }

  // Promise polyfill (for very old browsers)
  if (!window.Promise) {
    console.warn('Promise not supported - this may cause issues');
  }

  // Fetch polyfill (for older browsers)
  if (!window.fetch) {
    console.warn('Fetch not supported - this may cause issues');
    // You could load a fetch polyfill here if needed
    // import('whatwg-fetch');
  }

  // IntersectionObserver polyfill (for older browsers)
  if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver not supported - some animations may not work');
  }

  // ResizeObserver polyfill (for older browsers)
  if (!window.ResizeObserver) {
    console.warn('ResizeObserver not supported - some responsive features may not work');
  }

  // CustomEvent polyfill (for older browsers)
  if (typeof window.CustomEvent !== 'function') {
    const CustomEvent = function(event: string, params: any) {
      params = params || { bubbles: false, cancelable: false, detail: null };
      const evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };
    CustomEvent.prototype = window.Event.prototype;
    (window as any).CustomEvent = CustomEvent;
  }

  // requestAnimationFrame polyfill (for older browsers)
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      return setTimeout(callback, 1000 / 60);
    };
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }

  // Array.from polyfill (for older browsers)
  if (!Array.from) {
    Array.from = function(arrayLike: any, mapFn?: any, thisArg?: any) {
      const C = this;
      const items = Object(arrayLike);
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }
      let mapFunction = mapFn;
      let T;
      if (typeof mapFn !== 'undefined') {
        if (typeof mapFn !== 'function') {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }
        if (arguments.length > 2) {
          T = thisArg;
        }
      }
      const len = parseInt(items.length);
      const A = typeof C === 'function' ? Object(new C(len)) : new Array(len);
      let k = 0;
      let kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFunction) {
          A[k] = typeof T === 'undefined' ? mapFunction(kValue, k) : mapFunction.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      A.length = len;
      return A;
    };
  }

  // Object.assign polyfill (for older browsers)
  if (typeof Object.assign !== 'function') {
    Object.assign = function(target: any, ...sources: any[]) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      const to = Object(target);
      for (let index = 1; index < arguments.length; index++) {
        const nextSource = arguments[index];
        if (nextSource != null) {
          for (const nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    };
  }

  // String.includes polyfill (for older browsers)
  if (!String.prototype.includes) {
    String.prototype.includes = function(search: string, start?: number) {
      if (typeof start !== 'number') {
        start = 0;
      }
      if (start + search.length > this.length) {
        return false;
      } else {
        return this.indexOf(search, start) !== -1;
      }
    };
  }

  // Array.includes polyfill (for older browsers)
  if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement: any, fromIndex?: number) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      const o = Object(this);
      const len = parseInt(o.length) || 0;
      if (len === 0) {
        return false;
      }
      let n = fromIndex || 0;
      let k;
      if (n >= 0) {
        k = n;
      } else {
        k = len + n;
        if (k < 0) {
          k = 0;
        }
      }
      while (k < len) {
        const currentElement = o[k];
        if (searchElement === currentElement || (searchElement !== searchElement && currentElement !== currentElement)) {
          return true;
        }
        k++;
      }
      return false;
    };
  }
}

// Export a function to check browser compatibility
export function checkBrowserCompatibility(): {
  importMaps: boolean;
  esModules: boolean;
  fetch: boolean;
  intersectionObserver: boolean;
  resizeObserver: boolean;
  customEvent: boolean;
  requestAnimationFrame: boolean;
  arrayFrom: boolean;
  objectAssign: boolean;
  stringIncludes: boolean;
  arrayIncludes: boolean;
} {
  if (!isBrowser) {
    return {
      importMaps: false,
      esModules: false,
      fetch: false,
      intersectionObserver: false,
      resizeObserver: false,
      customEvent: false,
      requestAnimationFrame: false,
      arrayFrom: false,
      objectAssign: false,
      stringIncludes: false,
      arrayIncludes: false,
    };
  }

  return {
    importMaps: 'importMap' in HTMLScriptElement.prototype,
    esModules: 'noModule' in HTMLScriptElement.prototype,
    fetch: !!window.fetch,
    intersectionObserver: !!window.IntersectionObserver,
    resizeObserver: !!window.ResizeObserver,
    customEvent: typeof window.CustomEvent === 'function',
    requestAnimationFrame: !!window.requestAnimationFrame,
    arrayFrom: !!Array.from,
    objectAssign: typeof Object.assign === 'function',
    stringIncludes: !!String.prototype.includes,
    arrayIncludes: !!Array.prototype.includes,
  };
}

// Export a function to show compatibility warning
export function showCompatibilityWarning(): void {
  if (!isBrowser) return;

  const compatibility = checkBrowserCompatibility();
  const missingFeatures = Object.entries(compatibility)
    .filter(([_, supported]) => !supported)
    .map(([feature]) => feature);

  if (missingFeatures.length > 0) {
    console.warn('Browser compatibility warning: Missing features:', missingFeatures);
  }
}

// Auto-run compatibility check
if (isBrowser) {
  showCompatibilityWarning();
}
