import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from '@/lib/jwt';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * 认证中间件 - 验证请求中的 JWT Token
 */
export async function authenticateRequest(request: NextRequest): Promise<{
  success: boolean;
  user?: { id: string; email: string; name: string };
  error?: string;
  status?: number;
}> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        error: '未提供有效的认证信息',
        status: 401
      };
    }

    const token = authHeader.split(' ')[1];
    
    // 验证 Token
    let payload: JWTPayload;
    try {
      payload = verifyToken(token);
    } catch (error) {
      return {
        success: false,
        error: 'Token 无效或已过期',
        status: 401
      };
    }

    // 连接数据库
    await connectToDatabase();
    
    // 验证用户是否存在
    const user = await User.findById(payload.userId);
    
    if (!user) {
      return {
        success: false,
        error: '用户不存在',
        status: 404
      };
    }

    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name
      }
    };

  } catch (error) {
    console.error('认证中间件错误:', error);
    return {
      success: false,
      error: '认证验证失败',
      status: 500
    };
  }
}

/**
 * 要求认证的装饰器函数
 */
export function requireAuth<T extends any[]>(
  handler: (request: NextRequest, user: { id: string; email: string; name: string }, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    const authResult = await authenticateRequest(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status || 500 }
      );
    }

    return handler(request, authResult.user!, ...args);
  };
}
