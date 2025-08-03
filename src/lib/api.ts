/**
 * API 请求工具函数
 */

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * 发送认证请求
 */
export async function authRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // 如果是认证错误，清除本地 Token
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
      }
      
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API 请求失败 (${url}):`, error);
    throw error;
  }
}

/**
 * 用户登录
 */
export async function loginUser(email: string) {
  return authRequest<{
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      createdAt: string;
      lastLoginAt: string;
    };
    token: string;
    expiresIn: string;
  }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser() {
  return authRequest<{
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      createdAt: string;
      lastLoginAt: string;
    };
  }>('/api/auth/me');
}

/**
 * 用户退出登录
 */
export async function logoutUser() {
  return authRequest('/api/auth/logout', {
    method: 'POST',
  });
}

/**
 * 发送聊天消息
 */
export async function sendChatMessage(message: string, sessionId?: string) {
  const body: { message: string; sessionId?: string } = { message };

  // 只有当 sessionId 存在且有效时才添加到请求体中
  if (sessionId) {
    body.sessionId = sessionId;
  }

  return fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    },
    body: JSON.stringify(body),
  });
}

/**
 * 获取用户会话列表
 */
export async function getUserSessions() {
  return authRequest<{
    sessions: Array<{
      id: string;
      title: string;
      lastMessageAt: string;
      createdAt: string;
      messageCount: number;
      lastMessage: string;
    }>;
    total: number;
  }>('/api/sessions');
}

/**
 * 获取会话详情
 */
export async function getSessionDetail(sessionId: string) {
  return authRequest<{
    session: {
      id: string;
      title: string;
      createdAt: string;
      updatedAt: string;
      lastMessageAt: string;
      messages: Array<{
        role: 'user' | 'assistant';
        content: string;
        timestamp: string;
      }>;
      messageCount: number;
    };
  }>(`/api/sessions/${sessionId}`);
}

/**
 * 创建新会话
 */
export async function createSession(title: string) {
  return authRequest<{
    session: {
      id: string;
      title: string;
      createdAt: string;
      lastMessageAt: string;
      messageCount: number;
    };
  }>('/api/sessions', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

/**
 * 更新会话标题
 */
export async function updateSessionTitle(sessionId: string, title: string) {
  return authRequest<{
    session: {
      id: string;
      title: string;
      updatedAt: string;
    };
  }>(`/api/sessions/${sessionId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title }),
  });
}

/**
 * 删除会话
 */
export async function deleteSession(sessionId: string) {
  return authRequest(`/api/sessions/${sessionId}`, {
    method: 'DELETE',
  });
}
