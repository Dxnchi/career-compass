// src/lib/apiClient.js

const DEFAULT_TIMEOUT_MS = 8000;

/**
 * Enterprise Fetch Wrapper with AbortController Timeout & Retry Logic.
 */
export const requestWithRetry = async (url, options = {}, retries = 2, timeoutMs = DEFAULT_TIMEOUT_MS) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });

      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timer);
      const isLastAttempt = attempt === retries;

      if (isLastAttempt) {
        console.error(`[APIClient] Request failed after ${retries + 1} attempts:`, error.message);
        throw error;
      }

      // Exponential backoff: wait 500ms, then 1000ms before retrying
      await new Promise((res) => setTimeout(res, 500 * (attempt + 1)));
    }
  }
};