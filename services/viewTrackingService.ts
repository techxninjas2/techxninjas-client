import { supabase } from '../lib/supabaseClient';

interface ViewTrackingData {
  article_id: string;
  user_id?: string;
  session_id: string;
  ip_address?: string;
  page_url: string;
  user_agent: string;
  time_spent: number;
  timestamp: string;
  is_authenticated: boolean;
}

interface ViewTrackingResponse {
  success: boolean;
  message?: string;
  error?: string;
  view_id?: string;
  total_views?: number;
}

interface ViewTrackingConfig {
  minEngagementTime: number; // in milliseconds
  maxRetries: number;
  retryDelay: number;
  enableDebugLogging: boolean;
}

class ViewTracker {
  private config: ViewTrackingConfig = {
    minEngagementTime: 60000, // 60 seconds
    maxRetries: 3,
    retryDelay: 1000,
    enableDebugLogging: false
  };

  private activeTrackers = new Map<string, {
    timer: NodeJS.Timeout;
    startTime: number;
    isTracked: boolean;
    sessionId: string;
    articleId: string;
  }>();

  private sessionId: string;
  private visibilityChangeHandler: (() => void) | null = null;
  private beforeUnloadHandler: (() => void) | null = null;

  constructor(config?: Partial<ViewTrackingConfig>) {
    this.config = { ...this.config, ...config };
    this.sessionId = this.generateSessionId();
    this.setupGlobalEventListeners();
  }

  /**
   * Generate a unique session ID for tracking
   */
  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomStr}`;
  }

  /**
   * Get or create session ID from sessionStorage
   */
  private getSessionId(): string {
    try {
      let sessionId = sessionStorage.getItem('view_tracking_session_id');
      if (!sessionId) {
        sessionId = this.generateSessionId();
        sessionStorage.setItem('view_tracking_session_id', sessionId);
      }
      return sessionId;
    } catch (error) {
      // Fallback if sessionStorage is not available
      return this.sessionId;
    }
  }

  /**
   * Check if view has already been tracked for this article and session
   */
  private async hasViewBeenTracked(articleId: string): Promise<boolean> {
    try {
      const sessionId = this.getSessionId();
      const storageKey = `view_tracked_${articleId}_${sessionId}`;
      
      // Check sessionStorage first
      const sessionTracked = sessionStorage.getItem(storageKey);
      if (sessionTracked) {
        return true;
      }

      // For authenticated users, also check database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('article_views')
          .select('id')
          .eq('article_id', articleId)
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
          .limit(1);

        if (!error && data && data.length > 0) {
          // Mark as tracked in session storage to avoid future DB queries
          sessionStorage.setItem(storageKey, 'true');
          return true;
        }
      }

      return false;
    } catch (error) {
      this.log('Error checking if view has been tracked:', error);
      return false;
    }
  }

  /**
   * Get client IP address (best effort)
   */
  private async getClientIP(): Promise<string | undefined> {
    try {
      // This is a simplified approach. In production, you might want to use a service
      // or get IP from your backend to avoid CORS issues
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      this.log('Could not fetch IP address:', error);
      return undefined;
    }
  }

  /**
   * Detect if the request might be from a bot
   */
  private isLikelyBot(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const botPatterns = [
      'bot', 'crawler', 'spider', 'scraper', 'headless',
      'phantom', 'selenium', 'puppeteer', 'playwright'
    ];
    
    return botPatterns.some(pattern => userAgent.includes(pattern));
  }

  /**
   * Setup global event listeners for page visibility and unload
   */
  private setupGlobalEventListeners(): void {
    // Handle page visibility changes (tab switching, minimizing)
    this.visibilityChangeHandler = () => {
      if (document.hidden) {
        this.pauseAllTrackers();
      } else {
        this.resumeAllTrackers();
      }
    };

    // Handle page unload
    this.beforeUnloadHandler = () => {
      this.stopAllTrackers();
    };

    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  }

  /**
   * Pause all active trackers when page becomes hidden
   */
  private pauseAllTrackers(): void {
    this.activeTrackers.forEach((tracker, articleId) => {
      if (tracker.timer) {
        clearTimeout(tracker.timer);
        tracker.timer = null as any;
      }
    });
  }

  /**
   * Resume trackers when page becomes visible again
   */
  private resumeAllTrackers(): void {
    this.activeTrackers.forEach((tracker, articleId) => {
      if (!tracker.isTracked && !tracker.timer) {
        const remainingTime = this.config.minEngagementTime - (Date.now() - tracker.startTime);
        if (remainingTime > 0) {
          tracker.timer = setTimeout(() => {
            this.recordView(articleId);
          }, remainingTime);
        }
      }
    });
  }

  /**
   * Stop all active trackers
   */
  private stopAllTrackers(): void {
    this.activeTrackers.forEach((tracker) => {
      if (tracker.timer) {
        clearTimeout(tracker.timer);
      }
    });
    this.activeTrackers.clear();
  }

  /**
   * Log debug messages if enabled
   */
  private log(...args: any[]): void {
    if (this.config.enableDebugLogging) {
      console.log('[ViewTracker]', ...args);
    }
  }

  /**
   * Record a view in the database with retry logic
   */
  private async recordView(articleId: string, retryCount = 0): Promise<ViewTrackingResponse> {
    try {
      // Check if already tracked
      const alreadyTracked = await this.hasViewBeenTracked(articleId);
      if (alreadyTracked) {
        this.log('View already tracked for article:', articleId);
        return {
          success: false,
          error: 'View already tracked for this session'
        };
      }

      // Detect bot traffic
      if (this.isLikelyBot()) {
        this.log('Bot traffic detected, skipping view tracking');
        return {
          success: false,
          error: 'Bot traffic detected'
        };
      }

      const { data: { user } } = await supabase.auth.getUser();
      const sessionId = this.getSessionId();
      const ipAddress = await this.getClientIP();

      const viewData: Partial<ViewTrackingData> = {
        article_id: articleId,
        user_id: user?.id,
        session_id: sessionId,
        ip_address: ipAddress,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        time_spent: this.config.minEngagementTime,
        timestamp: new Date().toISOString(),
        is_authenticated: !!user
      };

      // Call database function to record view
      const { data, error } = await supabase.rpc('record_article_view', {
        p_article_id: articleId,
        p_session_id: sessionId,
        p_ip_address: ipAddress,
        p_page_url: window.location.href,
        p_user_agent: navigator.userAgent,
        p_time_spent: this.config.minEngagementTime
      });

      if (error) {
        throw error;
      }

      // Mark as tracked in session storage
      const storageKey = `view_tracked_${articleId}_${sessionId}`;
      sessionStorage.setItem(storageKey, 'true');

      // Mark tracker as completed
      const tracker = this.activeTrackers.get(articleId);
      if (tracker) {
        tracker.isTracked = true;
        if (tracker.timer) {
          clearTimeout(tracker.timer);
        }
        this.activeTrackers.delete(articleId);
      }

      this.log('View recorded successfully for article:', articleId);
      
      return {
        success: true,
        message: 'View recorded successfully',
        view_id: data?.view_id,
        total_views: data?.total_views
      };

    } catch (error: any) {
      this.log('Error recording view:', error);

      // Retry logic
      if (retryCount < this.config.maxRetries) {
        this.log(`Retrying view recording (attempt ${retryCount + 1}/${this.config.maxRetries})`);
        
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(this.recordView(articleId, retryCount + 1));
          }, this.config.retryDelay * (retryCount + 1));
        });
      }

      return {
        success: false,
        error: error.message || 'Failed to record view after retries'
      };
    }
  }

  /**
   * Start tracking a view for an article
   */
  public async startTracking(articleId: string): Promise<void> {
    try {
      // Check if already tracking this article
      if (this.activeTrackers.has(articleId)) {
        this.log('Already tracking article:', articleId);
        return;
      }

      // Check if view has already been tracked
      const alreadyTracked = await this.hasViewBeenTracked(articleId);
      if (alreadyTracked) {
        this.log('View already tracked for article:', articleId);
        return;
      }

      this.log('Starting view tracking for article:', articleId);

      const startTime = Date.now();
      const sessionId = this.getSessionId();

      // Set up timer for minimum engagement time
      const timer = setTimeout(() => {
        this.recordView(articleId);
      }, this.config.minEngagementTime);

      // Store tracker info
      this.activeTrackers.set(articleId, {
        timer,
        startTime,
        isTracked: false,
        sessionId,
        articleId
      });

    } catch (error) {
      this.log('Error starting view tracking:', error);
    }
  }

  /**
   * Stop tracking a specific article
   */
  public stopTracking(articleId: string): void {
    const tracker = this.activeTrackers.get(articleId);
    if (tracker) {
      if (tracker.timer) {
        clearTimeout(tracker.timer);
      }
      this.activeTrackers.delete(articleId);
      this.log('Stopped tracking article:', articleId);
    }
  }

  /**
   * Get current tracking status for an article
   */
  public getTrackingStatus(articleId: string): {
    isTracking: boolean;
    timeElapsed: number;
    isTracked: boolean;
  } {
    const tracker = this.activeTrackers.get(articleId);
    if (!tracker) {
      return {
        isTracking: false,
        timeElapsed: 0,
        isTracked: false
      };
    }

    return {
      isTracking: true,
      timeElapsed: Date.now() - tracker.startTime,
      isTracked: tracker.isTracked
    };
  }

  /**
   * Cleanup all event listeners and trackers
   */
  public cleanup(): void {
    this.stopAllTrackers();
    
    if (this.visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    }
    
    if (this.beforeUnloadHandler) {
      window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    }
  }
}

// Create singleton instance
const viewTracker = new ViewTracker({
  enableDebugLogging: process.env.NODE_ENV === 'development'
});

// Export convenience functions
export const startViewTracking = (articleId: string) => viewTracker.startTracking(articleId);
export const stopViewTracking = (articleId: string) => viewTracker.stopTracking(articleId);
export const getViewTrackingStatus = (articleId: string) => viewTracker.getTrackingStatus(articleId);
export const cleanupViewTracking = () => viewTracker.cleanup();