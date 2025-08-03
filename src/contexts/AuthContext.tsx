'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, logoutUser } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 认证上下文提供者
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时检查登录状态
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');

        if (storedToken) {
          // 调用 API 验证 Token 并获取用户信息
          const data = await getCurrentUser();

          if (data.data?.user) {
            const userData: User = {
              id: data.data.user.id,
              name: data.data.user.name,
              email: data.data.user.email,
            };

            setIsLoggedIn(true);
            setUser(userData);
            setToken(storedToken);
          }
        }
      } catch (error) {
        console.error('检查登录状态失败:', error);
        // getCurrentUser 内部已经处理了 Token 清除
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = (userData: User, authToken: string) => {
    localStorage.setItem('auth_token', authToken);
    setIsLoggedIn(true);
    setUser(userData);
    setToken(authToken);
  };

  const logout = async () => {
    try {
      // 调用退出登录 API
      if (token) {
        await logoutUser();
      }
    } catch (error) {
      console.error('退出登录错误:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setIsLoggedIn(false);
      setUser(null);
      setToken(null);
    }
  };

  const refreshUser = async () => {
    try {
      const storedToken = localStorage.getItem('auth_token');

      if (!storedToken) {
        return;
      }

      const data = await getCurrentUser();

      if (data.data?.user) {
        const userData: User = {
          id: data.data.user.id,
          name: data.data.user.name,
          email: data.data.user.email,
        };

        setUser(userData);
      }
    } catch (error) {
      console.error('刷新用户信息失败:', error);
      await logout();
    }
  };

  const value: AuthContextType = {
    isLoggedIn,
    user,
    token,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 使用认证上下文的 Hook
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  return context;
}
