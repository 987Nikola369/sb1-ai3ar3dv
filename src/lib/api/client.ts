import { storage } from '../storage';

interface ApiClientConfig {
  baseUrl: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return response.json();
  }

  // Auth methods
  auth = {
    signUp: (email: string, password: string) =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    signIn: (email: string, password: string) =>
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    signOut: () =>
      this.request('/auth/logout', {
        method: 'POST',
      }),
  };

  // Storage methods
  storage = {
    upload: (bucket: string, path: string, file: File) =>
      storage.upload(bucket, path, file),
    
    getUrl: (bucket: string, path: string) =>
      storage.getUrl(bucket, path),
    
    remove: (bucket: string, path: string) =>
      storage.remove(bucket, path),
  };
}

export const api = new ApiClient({
  baseUrl: 'http://localhost:3000/api',
});