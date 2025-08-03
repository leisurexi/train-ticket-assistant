'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * 认证调试组件 - 用于开发时调试认证状态
 */
export function AuthDebug() {
  const { isLoggedIn, user, token, isLoading, refreshUser } = useAuth();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 p-4 max-w-sm bg-background/95 backdrop-blur-sm border shadow-lg z-50">
      <h3 className="font-semibold mb-2">🔍 认证状态调试</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>加载状态:</strong> {isLoading ? '加载中...' : '已完成'}
        </div>
        
        <div>
          <strong>登录状态:</strong> {isLoggedIn ? '✅ 已登录' : '❌ 未登录'}
        </div>
        
        {user && (
          <div>
            <strong>用户信息:</strong>
            <div className="ml-2 text-xs">
              <div>ID: {user.id}</div>
              <div>姓名: {user.name}</div>
              <div>邮箱: {user.email}</div>
            </div>
          </div>
        )}
        
        <div>
          <strong>Token:</strong> {token ? '✅ 存在' : '❌ 不存在'}
        </div>
        
        {token && (
          <div className="text-xs">
            <strong>Token 预览:</strong>
            <div className="font-mono bg-muted p-1 rounded mt-1 break-all">
              {token.substring(0, 20)}...
            </div>
          </div>
        )}
        
        <div className="pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={refreshUser}
            disabled={!token}
            className="w-full"
          >
            刷新用户信息
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          本组件仅在开发环境显示
        </div>
      </div>
    </Card>
  );
}
