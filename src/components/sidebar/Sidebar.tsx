'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { useAuth } from '@/contexts/AuthContext';
import { getUserSessions } from '@/lib/api';
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
  isLoadingSession?: boolean;
}

/**
 * 侧边栏组件 - 包含历史会话和用户功能
 */
export function Sidebar({
  isCollapsed = false,
  onToggle,
  onNewChat,
  onSelectSession,
  currentSessionId,
  isLoadingSession = false
}: SidebarProps) {
  const { isLoggedIn, user, isLoading, logout } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  // 加载用户会话列表
  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      loadSessions();
    } else {
      setSessions([]);
    }
  }, [isLoggedIn, isLoading]);

  const loadSessions = async () => {
    try {
      setSessionsLoading(true);
      const data = await getUserSessions();
      if (data.data?.sessions) {
        const formattedSessions = data.data.sessions.map(session => ({
          id: session.id,
          title: session.title,
          lastMessage: session.lastMessage,
          timestamp: new Date(session.lastMessageAt),
          messageCount: session.messageCount
        }));
        setSessions(formattedSessions);
      }
    } catch (error) {
      console.error('加载会话列表失败:', error);
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleLoginClick = () => {
    setShowLoginDialog(true);
  };

  const handleLogout = async () => {
    await logout();
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
              {sessionsLoading ? (
                // 加载状态
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="p-3 animate-pulse">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="flex justify-between">
                        <div className="h-3 bg-muted rounded w-16" />
                        <div className="h-3 bg-muted rounded w-12" />
                      </div>
                    </div>
                  </Card>
                ))
              ) : sessions.length > 0 ? (
                sessions.map((session) => (
                  <Card
                    key={session.id}
                    className={cn(
                      "p-3 cursor-pointer transition-all duration-200 hover:bg-muted/50",
                      currentSessionId === session.id && "bg-muted border-primary/50",
                      isLoadingSession && currentSessionId === session.id && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => !isLoadingSession && onSelectSession?.(session.id)}
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
                ))
              ) : (
                // 空状态
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">暂无会话记录</p>
                  <p className="text-xs text-muted-foreground mt-1">开始新对话来创建会话</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* 收起状态下的占位空间，确保用户信息固定在底部 */}
      {isCollapsed && <div className="flex-1" />}

      {/* 底部用户区域 */}
      <div className="p-4 border-t border-border">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            {!isCollapsed && (
              <div className="ml-3 space-y-1">
                <div className="h-4 bg-muted rounded animate-pulse w-20" />
                <div className="h-3 bg-muted rounded animate-pulse w-32" />
              </div>
            )}
          </div>
        ) : isLoggedIn && user ? (
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
                onClick={handleLoginClick}
                className="h-10 w-10 p-0"
                title="登录账户"
              >
                <LogIn className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleLoginClick}
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

      {/* 登录对话框 */}
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
      />
    </div>
  );
}
