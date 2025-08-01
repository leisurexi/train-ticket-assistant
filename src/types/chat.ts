/**
 * 聊天消息类型定义
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

/**
 * 火车票查询参数
 */
export interface TrainTicketQuery {
  from: string;
  to: string;
  date: string;
}

/**
 * 聊天状态
 */
export type ChatStatus = 'idle' | 'loading' | 'streaming' | 'error';
