import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth-middleware';
import { connectToDatabase } from '@/lib/mongodb';
import { Session } from '@/models/Session';

/**
 * 获取用户会话列表 API
 */
export async function GET(request: NextRequest) {
  try {
    // 验证用户认证
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status || 401 }
      );
    }

    const user = authResult.user!;

    // 连接数据库
    await connectToDatabase();

    // 获取用户的会话列表，按最后消息时间倒序
    const sessions = await Session.find({ userId: user.id })
      .select('title lastMessageAt createdAt messages')
      .sort({ lastMessageAt: -1 })
      .limit(50) // 限制返回最近50个会话
      .lean();

    // 处理会话数据，添加消息数量和最后消息预览
    const processedSessions = sessions.map(session => ({
      id: session._id.toString(),
      title: session.title,
      lastMessageAt: session.lastMessageAt,
      createdAt: session.createdAt,
      messageCount: session.messages?.length || 0,
      lastMessage: session.messages && session.messages.length > 0 
        ? session.messages[session.messages.length - 1].content.substring(0, 100) + 
          (session.messages[session.messages.length - 1].content.length > 100 ? '...' : '')
        : ''
    }));

    return NextResponse.json({
      success: true,
      message: '获取会话列表成功',
      data: {
        sessions: processedSessions,
        total: processedSessions.length
      }
    });

  } catch (error) {
    console.error('获取会话列表错误:', error);
    return NextResponse.json(
      { error: '获取会话列表失败' },
      { status: 500 }
    );
  }
}

/**
 * 创建新会话 API
 */
export async function POST(request: NextRequest) {
  try {
    // 验证用户认证
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status || 401 }
      );
    }

    const user = authResult.user!;
    const { title } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: '会话标题不能为空' },
        { status: 400 }
      );
    }

    // 连接数据库
    await connectToDatabase();

    // 创建新会话
    const session = await Session.create({
      userId: user.id,
      title,
      messages: [],
      lastMessageAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: '创建会话成功',
      data: {
        session: {
          id: session._id.toString(),
          title: session.title,
          createdAt: session.createdAt,
          lastMessageAt: session.lastMessageAt,
          messageCount: 0
        }
      }
    });

  } catch (error) {
    console.error('创建会话错误:', error);
    return NextResponse.json(
      { error: '创建会话失败' },
      { status: 500 }
    );
  }
}
