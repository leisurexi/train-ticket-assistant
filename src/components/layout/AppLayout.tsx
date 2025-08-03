'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { AuthProvider } from '@/contexts/AuthContext';
import { getSessionDetail } from '@/lib/api';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { Menu, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 应用主布局组件 - 管理侧边栏和主内容区域
 */
export function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(undefined);
  const [sessionMessages, setSessionMessages] = useState<ChatMessageType[]>([]);
  const [isLoadingSession, setIsLoadingSession] = useState(false);

  const handleNewChat = () => {
    // 重置当前会话ID和消息，让服务端自动创建新会话
    setCurrentSessionId(undefined);
    setSessionMessages([]);
    console.log('开始新对话，将由服务端自动创建会话');
  };

  const handleSelectSession = async (sessionId: string) => {
    try {
      setIsLoadingSession(true);
      setCurrentSessionId(sessionId);
      setIsMobileSidebarOpen(false); // 移动端选择会话后关闭侧边栏

      // 获取会话详情
      const data = await getSessionDetail(sessionId);

      if (data.data?.session) {
        // 转换消息格式
        const messages: ChatMessageType[] = data.data.session.messages.map((msg, index) => ({
          id: `${sessionId}-${index}`,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp)
        }));

        setSessionMessages(messages);
        console.log('加载会话成功:', sessionId, messages.length, '条消息');
      }
    } catch (error) {
      console.error('加载会话失败:', error);
      // 可以在这里添加错误提示
    } finally {
      setIsLoadingSession(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <AuthProvider>
      <div className="flex h-screen bg-background overflow-hidden safe-area-top">
      {/* 桌面端侧边栏 */}
      <div className={cn(
        "hidden lg:flex transition-all duration-300",
        isSidebarCollapsed ? "w-16" : "w-80"
      )}>
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          currentSessionId={currentSessionId}
          isLoadingSession={isLoadingSession}
        />
      </div>

      {/* 移动端侧边栏遮罩 */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* 移动端侧边栏 */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-80 bg-background z-50 transform transition-transform duration-300 lg:hidden",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          currentSessionId={currentSessionId}
          isLoadingSession={isLoadingSession}
        />
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 移动端顶部栏 */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileSidebar}
            className="h-9 w-9 p-0"
            title="打开侧边栏"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <h1 className="text-lg font-semibold">火车票助手</h1>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewChat}
            className="h-9 w-9 p-0"
            title="新建对话"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>



        {/* 聊天容器 */}
        <div className="flex-1 min-h-0 relative">
          <ChatContainer
            sessionId={currentSessionId}
            initialMessages={sessionMessages}
            isLoadingSession={isLoadingSession}
          />
        </div>
      </div>
      </div>
    </AuthProvider>
  );
}
