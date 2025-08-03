import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth-middleware';
import { connectToDatabase } from '@/lib/mongodb';
import { Session } from '@/models/Session';
import { validateObjectIdParam } from '@/lib/mongodb-utils';

/**
 * 获取单个会话详情 API
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
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
    const { sessionId } = await params;

    // 验证 sessionId
    const validation = validateObjectIdParam(sessionId, '会话ID');
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 连接数据库
    await connectToDatabase();

    // 查找会话，确保属于当前用户
    const session = await Session.findOne({ 
      _id: sessionId, 
      userId: user.id 
    }).lean();

    if (!session) {
      return NextResponse.json(
        { error: '会话不存在或无权访问' },
        { status: 404 }
      );
    }

    // 处理消息数据
    interface SessionMessage {
      role: string;
      content: string;
      timestamp: Date;
    }

    const sessionDoc = session as unknown as {
      _id: string;
      title: string;
      createdAt: Date;
      updatedAt: Date;
      lastMessageAt: Date;
      messages: SessionMessage[];
    };

    const processedMessages = sessionDoc.messages?.map(message => ({
      role: message.role,
      content: message.content,
      timestamp: message.timestamp
    })) || [];

    return NextResponse.json({
      success: true,
      message: '获取会话详情成功',
      data: {
        session: {
          id: sessionDoc._id.toString(),
          title: sessionDoc.title,
          createdAt: sessionDoc.createdAt,
          updatedAt: sessionDoc.updatedAt,
          lastMessageAt: sessionDoc.lastMessageAt,
          messages: processedMessages,
          messageCount: processedMessages.length
        }
      }
    });

  } catch (error) {
    console.error('获取会话详情错误:', error);
    return NextResponse.json(
      { error: '获取会话详情失败' },
      { status: 500 }
    );
  }
}

/**
 * 更新会话标题 API
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
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
    const { sessionId } = await params;
    const { title } = await request.json();

    // 验证 sessionId
    const validation = validateObjectIdParam(sessionId, '会话ID');
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: '会话标题不能为空' },
        { status: 400 }
      );
    }

    // 连接数据库
    await connectToDatabase();

    // 查找并更新会话
    const session = await Session.findOneAndUpdate(
      { _id: sessionId, userId: user.id },
      { title },
      { new: true }
    );

    if (!session) {
      return NextResponse.json(
        { error: '会话不存在或无权访问' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '更新会话标题成功',
      data: {
        session: {
          id: session._id.toString(),
          title: session.title,
          updatedAt: session.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('更新会话标题错误:', error);
    return NextResponse.json(
      { error: '更新会话标题失败' },
      { status: 500 }
    );
  }
}

/**
 * 删除会话 API
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
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
    const { sessionId } = await params;

    // 验证 sessionId
    const validation = validateObjectIdParam(sessionId, '会话ID');
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 连接数据库
    await connectToDatabase();

    // 查找并删除会话
    const session = await Session.findOneAndDelete({ 
      _id: sessionId, 
      userId: user.id 
    });

    if (!session) {
      return NextResponse.json(
        { error: '会话不存在或无权访问' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '删除会话成功'
    });

  } catch (error) {
    console.error('删除会话错误:', error);
    return NextResponse.json(
      { error: '删除会话失败' },
      { status: 500 }
    );
  }
}
