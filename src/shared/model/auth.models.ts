export interface ConduitUser {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
}

export interface LoginRequest {
  user: { email: string; password: string };
}

export interface LoginResponse {
  user: ConduitUser;
}
