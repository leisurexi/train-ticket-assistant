import { NextRequest, NextResponse } from 'next/server';

/**
 * 用户退出登录 API
 */
export async function POST(request: NextRequest) {
  try {
    // 由于使用 JWT，服务端无状态，主要是清除客户端存储的 Token
    // 这里可以添加 Token 黑名单逻辑（如果需要的话）
    
    return NextResponse.json({
      success: true,
      message: '退出登录成功',
    });

  } catch (error) {
    console.error('退出登录 API 错误:', error);
    return NextResponse.json(
      { error: '退出登录失败' },
      { status: 500 }
    );
  }
}
