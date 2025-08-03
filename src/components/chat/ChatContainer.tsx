'use client';

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage as ChatMessageType, ChatStatus } from "@/types/chat";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { WelcomeMessage } from "./WelcomeMessage";
import { QuickActions } from "./QuickActions";
import { useAuth } from "@/contexts/AuthContext";
import { sendChatMessage } from "@/lib/api";
import { LoginDialog } from "@/components/auth/LoginDialog";

interface ChatContainerProps {
  sessionId?: string;
  initialMessages?: ChatMessageType[];
  isLoadingSession?: boolean;
}

/**
 * 聊天容器组件 - 管理整个聊天界面的状态和交互
 */
export function ChatContainer({
  sessionId,
  initialMessages = [],
  isLoadingSession = false
}: ChatContainerProps = {}) {
  const { isLoggedIn, token } = useAuth();
  const [messages, setMessages] = useState<ChatMessageType[]>(initialMessages);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(sessionId);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  // 监听 initialMessages 变化，更新本地消息状态
  useEffect(() => {
    setMessages(initialMessages);
    setCurrentSessionId(sessionId);
  }, [initialMessages, sessionId]);

  // 监听消息变化，自动滚动到底部
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages]);

  // 监听登录状态变化，登录成功后关闭登录对话框
  useEffect(() => {
    if (isLoggedIn && showLoginDialog) {
      setShowLoginDialog(false);
    }
  }, [isLoggedIn, showLoginDialog]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息处理
  const handleSendMessage = async (content: string) => {
    // 检查用户是否已登录，未登录时弹出登录框
    if (!isLoggedIn || !token) {
      setShowLoginDialog(true);
      return;
    }

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setStatus('loading');

    // 滚动到底部显示新消息
    setTimeout(scrollToBottom, 100);

    try {
      // 创建AI回复消息
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStatus('streaming');

      // 滚动到底部显示助手消息
      setTimeout(scrollToBottom, 100);

      // 调用认证的聊天API
      // 只有当存在有效的 sessionId 时才传递，否则让服务端创建新会话
      const response = await sendChatMessage(content, currentSessionId || undefined);

      if (!response.ok) {
        throw new Error('网络请求失败');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let accumulatedContent = '';

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                // 流式传输完成
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMessage.id
                      ? { ...msg, isStreaming: false }
                      : msg
                  )
                );
                setStatus('idle');

                // 确保最终滚动到底部
                setTimeout(scrollToBottom, 100);
                return;
              }

              try {
                const parsed = JSON.parse(data);

                // 处理会话ID
                if (parsed.type === 'session' && parsed.sessionId) {
                  setCurrentSessionId(parsed.sessionId);
                }

                // 处理消息内容
                if (parsed.type === 'content' && parsed.content) {
                  accumulatedContent += parsed.content;

                  // 更新消息内容
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: accumulatedContent }
                        : msg
                    )
                  );

                  // 自动滚动到底部
                  setTimeout(scrollToBottom, 50);
                }

                // 兼容旧格式
                if (!parsed.type && parsed.content) {
                  accumulatedContent += parsed.content;

                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: accumulatedContent }
                        : msg
                    )
                  );

                  // 自动滚动到底部
                  setTimeout(scrollToBottom, 50);
                }
              } catch (e) {
                console.error('解析SSE数据失败:', e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      setStatus('error');
      
      // 添加错误消息
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: '抱歉，服务暂时不可用，请稍后再试。',
        timestamp: new Date()
      };

      setMessages(prev => {
        // 移除流式消息，添加错误消息
        const filtered = prev.filter(msg => msg.id !== (Date.now() + 1).toString());
        return [...filtered, errorMessage];
      });

      // 滚动到底部显示错误消息
      setTimeout(scrollToBottom, 100);
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* 主容器 - 在大屏幕上居中显示 */}
      <div className="flex flex-col h-full max-w-4xl mx-auto w-full lg:shadow-2xl lg:bg-background/95 lg:backdrop-blur-sm">
        {/* 头部 - 只在没有消息时显示 */}
        {messages.length === 0 && <ChatHeader />}

        {/* 消息区域 - 使用 flex-1 和 min-h-0 确保可滚动 */}
        <div className="flex-1 min-h-0 relative">
          <ScrollArea ref={scrollAreaRef} className="h-full">
            <div className="p-4 space-y-4">
              {isLoadingSession ? (
                // 加载会话状态
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>加载会话中...</span>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="space-y-6">
                  <WelcomeMessage />
                  <QuickActions
                    onQuickAction={handleSendMessage}
                    disabled={status === 'loading' || status === 'streaming'}
                  />
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))
              )}
              {/* 底部留白，确保最后一条消息不被输入框遮挡 */}
              <div className="h-4" />
            </div>
          </ScrollArea>
        </div>

        {/* 输入区域 - 固定在底部 */}
        <div className="shrink-0">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={status === 'error'}
            isLoading={status === 'loading' || status === 'streaming'}
          />
        </div>
      </div>

      {/* 登录对话框 */}
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
      />
    </div>
  );
}
