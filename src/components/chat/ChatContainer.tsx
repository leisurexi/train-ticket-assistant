'use client';

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage as ChatMessageType, ChatStatus } from "@/types/chat";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { WelcomeMessage } from "./WelcomeMessage";
import { QuickActions } from "./QuickActions";

/**
 * 聊天容器组件 - 管理整个聊天界面的状态和交互
 */
export function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息处理
  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setStatus('loading');

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

      // 调用SSE API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

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
                return;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  accumulatedContent += parsed.content;
                  
                  // 更新消息内容
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === assistantMessage.id 
                        ? { ...msg, content: accumulatedContent }
                        : msg
                    )
                  );
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
      
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* 主容器 - 在大屏幕上居中显示 */}
      <div className="flex flex-col h-full max-w-4xl mx-auto w-full lg:shadow-2xl lg:bg-background/95 lg:backdrop-blur-sm">
        {/* 头部 */}
        <ChatHeader />

        {/* 消息区域 */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-0">
          <div className="min-h-full">
            {messages.length === 0 ? (
              <>
                <WelcomeMessage />
                <QuickActions
                  onQuickAction={handleSendMessage}
                  disabled={status === 'loading' || status === 'streaming'}
                />
              </>
            ) : (
              <div className="pb-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* 输入区域 */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={status === 'error'}
          isLoading={status === 'loading' || status === 'streaming'}
        />
      </div>
    </div>
  );
}
