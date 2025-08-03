import { useState, useEffect } from 'react';
import { JWTPayload } from '@/lib/jwt';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

/**
 * 认证状态管理 Hook
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    token: null,
    isLoading: true,
  });

  // 初始化时检查本地存储的 Token
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      try {
        // 这里在客户端无法验证 JWT，所以只是解码
        // 实际验证应该在服务端进行
        const payload = JSON.parse(atob(token.split('.')[1])) as JWTPayload;
        
        // 检查 Token 是否过期
        if (payload.exp && payload.exp * 1000 > Date.now()) {
          setAuthState({
            isLoggedIn: true,
            user: {
              id: payload.userId,
              name: payload.name,
              email: payload.email,
            },
            token,
            isLoading: false,
          });
        } else {
          // Token 过期，清除本地存储
          localStorage.removeItem('auth_token');
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Token 解析失败:', error);
        localStorage.removeItem('auth_token');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('auth_token', token);
    setAuthState({
      isLoggedIn: true,
      user: userData,
      token,
      isLoading: false,
    });
  };

  const logout = async () => {
    try {
      // 调用退出登录 API
      if (authState.token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authState.token}`,
          },
        });
      }
    } catch (error) {
      console.error('退出登录错误:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setAuthState({
        isLoggedIn: false,
        user: null,
        token: null,
        isLoading: false,
      });
    }
  };

  return {
    ...authState,
    login,
    logout,
  };
}
