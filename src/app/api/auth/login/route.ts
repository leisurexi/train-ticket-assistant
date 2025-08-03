import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { generateToken } from '@/lib/jwt';

/**
 * 用户登录 API
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // 验证输入
    if (!email) {
      return NextResponse.json(
        { error: '邮箱地址是必需的' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 连接数据库
    await connectToDatabase();

    // 生成用户名（从邮箱提取）
    const username = email.split('@')[0];
    const name = username.charAt(0).toUpperCase() + username.slice(1);

    // 查找或创建用户
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name });
    }

    // 生成 JWT Token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    // 返回用户信息和 Token
    return NextResponse.json({
      success: true,
      message: user.createdAt.getTime() === user.updatedAt.getTime() 
        ? '注册成功' 
        : '登录成功',
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
        },
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      },
    });

  } catch (error) {
    console.error('登录 API 错误:', error);

    // 处理数据库错误
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: '该邮箱已被注册' },
          { status: 409 }
        );
      }
      
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { error: '输入数据格式错误' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    );
  }
}
