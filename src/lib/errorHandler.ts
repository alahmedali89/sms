import { logger } from './logger';

export function handleAppwriteError(action: string, err: any): string {
  // Log the raw and detailed error to the debug console
  logger.error(`Appwrite Error during ${action}`, {
    message: err?.message,
    code: err?.code,
    type: err?.type,
    response: err?.response,
    raw: err
  });

  // Handle specific known error scenarios based on Appwrite API formats
  if (err?.message === 'Failed to fetch') {
    return 'Network error. Please check your internet connection and try again.';
  }

  switch (err?.code) {
    case 400:
      // Includes Appwrite type: param_invalid or similar
      return 'Invalid information provided. Please check your input and try again.';
    case 401:
      // Includes Appwrite type: user_invalid_token or user_session_already_exists
      if (err?.type === 'user_session_already_exists') {
        return 'An active session already exists. Try refreshing the page.';
      }
      return 'Unauthorized. The code or phone number field might be incorrect or expired.';
    case 403:
      return 'Access denied to perform this action.';
    case 404:
      return 'Requested resource could not be found.';
    case 429:
      // Includes Appwrite type: rate_limit_exceeded
      return 'Too many attempts. Please wait a moment and try again later.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Our servers are experiencing issues. Please try again later.';
    default:
      // Fallback to the message provided by Appwrite, or a generic one
      return err?.message || `An unexpected error occurred during ${action}.`;
  }
}
