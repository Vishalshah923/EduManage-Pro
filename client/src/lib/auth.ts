import { User } from "@shared/schema";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

class AuthService {
  private currentUser: AuthUser | null = null;

  async login(username: string, password: string): Promise<AuthUser> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    this.currentUser = data.user;
    localStorage.setItem("auth_user", JSON.stringify(data.user));
    return data.user;
  }

  async register(userData: { username: string; password: string; email: string; role?: string }): Promise<AuthUser> {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const data = await response.json();
    this.currentUser = data.user;
    localStorage.setItem("auth_user", JSON.stringify(data.user));
    return data.user;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem("auth_user");
  }

  getCurrentUser(): AuthUser | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    const stored = localStorage.getItem("auth_user");
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }

    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
}

export const authService = new AuthService();
