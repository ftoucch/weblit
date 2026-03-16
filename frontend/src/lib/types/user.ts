export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: 'guest' | 'user' | 'admin';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface AuthTokens {
  accessToken: string;
  tokenType: string;
}
