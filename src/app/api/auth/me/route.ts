import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { verifyToken } from '@/lib/jwt';

/**
 * 获取当前用户信息 API
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未提供有效的认证信息' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // 验证 Token
    const payload = verifyToken(token);
    
    // 连接数据库
    await connectToDatabase();
    
    // 根据 Token 中的用户 ID 查找用户
    const user = await User.findById(payload.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date();
    await user.save();

    return NextResponse.json({
      success: true,
      message: '获取用户信息成功',
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
        }
      }
    });

  } catch (error) {
    console.error('获取用户信息错误:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Token') || error.message.includes('JWT')) {
        return NextResponse.json(
          { error: 'Token 无效或已过期' },
          { status: 401 }
        );
      }
    }
    
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}
