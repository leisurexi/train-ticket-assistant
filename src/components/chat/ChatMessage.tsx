import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

/**
 * 聊天消息组件 - 显示用户和AI助手的消息
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isStreaming = message.isStreaming;

  return (
    <div className={cn(
      "flex w-full gap-3 px-4 py-3",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col gap-1 max-w-[85%] sm:max-w-[70%]",
        isUser && "items-end"
      )}>
        <Card className={cn(
          "px-3 py-2 text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted",
          isStreaming && "animate-pulse"
        )}>
          <div className="break-words">
            {isUser ? (
              // 用户消息保持简单格式
              <div className="whitespace-pre-wrap">
                {message.content}
              </div>
            ) : (
              // AI 消息使用 Markdown 渲染
              <div className="markdown-wrapper">
                <Markdown
                  content={message.content}
                  className={cn(
                    "text-sm",
                    isStreaming && "animate-pulse"
                  )}
                />
                {isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                )}
              </div>
            )}
          </div>
        </Card>
        
        <span className="text-xs text-muted-foreground px-1">
          {message.timestamp.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
