import { NextResponse } from 'next/server';
import { isDifyConfigured } from '@/lib/dify';

/**
 * 状态检查API - 返回系统配置状态
 */
export async function GET() {
  try {
    const status = {
      difyConfigured: isDifyConfigured(),
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0'
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error('状态检查失败:', error);
    return NextResponse.json(
      { error: '状态检查失败' },
      { status: 500 }
    );
  }
}
