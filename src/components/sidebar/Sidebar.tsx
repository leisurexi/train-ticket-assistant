'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageSquare,
  Plus,
  User,
  LogIn,
  LogOut,
  History,
  MoreHorizontal,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  onNewChat?: () => void;
  onSelectSession?: (sessionId: string) => void;
  currentSessionId?: string;
}

/**
 * 侧边栏组件 - 包含历史会话和用户功能
 */
export function Sidebar({
  isCollapsed = false,
  onToggle,
  onNewChat,
  onSelectSession,
  currentSessionId
}: SidebarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // 模拟历史会话数据
  const [sessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: '北京到上海火车票查询',
      lastMessage: '为您找到了3趟高铁列车...',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
      messageCount: 8
    },
    {
      id: '2', 
      title: '广州到深圳城际列车',
      lastMessage: '广深城际列车班次密集...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
      messageCount: 5
    },
    {
      id: '3',
      title: '杭州到南京火车票',
      lastMessage: '正在为您查询杭州东到南京南...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1天前
      messageCount: 12
    }
  ]);

  const handleLogin = () => {
    // 模拟登录
    setIsLoggedIn(true);
    setUser({ name: '张三', email: 'zhangsan@example.com' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${days}天前`;
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-background border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-80"
    )}>

      {/* 顶部控制区域 */}
      <div className="p-4 space-y-3">
        {/* 收起/展开按钮 */}
        <div className={cn(
          "flex",
          isCollapsed ? "justify-center" : "justify-end"
        )}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
            title={isCollapsed ? "展开侧边栏" : "收起侧边栏"}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* 新建对话按钮 */}
        <Button
          onClick={onNewChat}
          className={cn(
            "gap-2 transition-all duration-200",
            isCollapsed ? "w-10 h-10 p-0" : "w-full justify-start"
          )}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && "新建对话"}
        </Button>
      </div>

      {/* 历史会话列表 - 仅在展开状态下显示 */}
      {!isCollapsed && (
        <div className="flex-1 overflow-hidden">
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <History className="h-4 w-4" />
              历史会话
            </div>
          </div>

          <ScrollArea className="h-full px-2">
            <div className="space-y-1 pb-4">
              {sessions.map((session) => (
                <Card
                  key={session.id}
                  className={cn(
                    "p-3 cursor-pointer transition-all duration-200 hover:bg-muted/50",
                    currentSessionId === session.id && "bg-muted border-primary/50"
                  )}
                  onClick={() => onSelectSession?.(session.id)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-medium line-clamp-1">
                        {session.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {session.lastMessage}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatTime(session.timestamp)}</span>
                      <span>{session.messageCount} 条消息</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* 收起状态下的占位空间，确保用户信息固定在底部 */}
      {isCollapsed && <div className="flex-1" />}

      {/* 底部用户区域 */}
      <div className="p-4 border-t border-border">
        {isLoggedIn && user ? (
          <div className={cn(
            "flex items-center transition-all duration-200",
            isCollapsed ? "justify-center" : "gap-3"
          )}>
            {/* 用户头像 */}
            <div
              className={cn(
                "w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0",
                isCollapsed && "cursor-pointer hover:bg-gradient-to-br hover:from-primary/30 hover:to-primary/20 transition-all duration-200"
              )}
              onClick={isCollapsed ? handleLogout : undefined}
              title={isCollapsed ? "点击退出登录" : undefined}
            >
              <User className="h-5 w-5 text-primary" />
            </div>

            {/* 用户信息 - 仅展开状态显示 */}
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="h-8 w-8 p-0"
                  title="退出登录"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        ) : (
          /* 未登录状态 */
          <div className="flex justify-center">
            {isCollapsed ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogin}
                className="h-10 w-10 p-0"
                title="登录账户"
              >
                <LogIn className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleLogin}
                className="w-full justify-start gap-2"
                variant="outline"
              >
                <LogIn className="h-4 w-4" />
                登录账户
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
