/**
 * Dify AI 服务集成
 */

interface DifyConfig {
  apiKey: string;
  baseUrl: string;
  appId: string;
}

interface DifyMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface DifyStreamResponse {
  event: string;
  task_id: string;
  id: string;
  message_id: string;
  conversation_id: string;
  mode: string;
  answer: string;
  created_at: number;
}

/**
 * Dify AI 客户端类
 */
export class DifyClient {
  private config: DifyConfig;

  constructor(config: DifyConfig) {
    this.config = config;
  }

  /**
   * 发送流式聊天请求到 Dify AI
   */
  async *streamChat(
    message: string,
    conversationId?: string,
    userId: string = 'anonymous'
  ): AsyncGenerator<string, void, unknown> {
    try {
      // 使用 app_id 构建正确的 API 端点
      const response = await fetch(`${this.config.baseUrl}/chat-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {},
          query: message,
          response_mode: 'streaming',
          conversation_id: conversationId,
          user: userId,
          auto_generate_name: false
        }),
      });

      if (!response.ok) {
        throw new Error(`Dify API 请求失败: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('无法获取响应流');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // 保留最后一行（可能不完整）
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed: DifyStreamResponse = JSON.parse(data);
              
              // 处理不同类型的事件
              if (parsed.event === 'message') {
                yield parsed.answer || '';
              } else if (parsed.event === 'message_replace') {
                // 对于替换类型的消息，返回完整内容
                yield parsed.answer || '';
              }
            } catch (e) {
              console.warn('解析 Dify 响应失败:', e, data);
            }
          }
        }
      }
    } catch (error) {
      console.error('Dify 流式请求失败:', error);
      throw error;
    }
  }

  /**
   * 发送普通聊天请求到 Dify AI
   */
  async chat(
    message: string,
    conversationId?: string,
    userId: string = 'anonymous'
  ): Promise<string> {
    try {
      // 使用 app_id 构建正确的 API 端点
      const response = await fetch(`${this.config.baseUrl}/chat-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {},
          query: message,
          response_mode: 'blocking',
          conversation_id: conversationId,
          user: userId,
          auto_generate_name: false
        }),
      });

      if (!response.ok) {
        throw new Error(`Dify API 请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.answer || '抱歉，我无法处理您的请求。';
    } catch (error) {
      console.error('Dify 请求失败:', error);
      throw error;
    }
  }
}

/**
 * 创建 Dify 客户端实例
 */
export function createDifyClient(): DifyClient | null {
  const apiKey = process.env.DIFY_API_KEY;
  const baseUrl = process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1';
  const appId = process.env.DIFY_APP_ID;

  if (!apiKey || !appId) {
    console.warn('Dify 配置不完整，将使用模拟响应');
    return null;
  }

  return new DifyClient({
    apiKey,
    baseUrl,
    appId
  });
}

/**
 * 检查 Dify 配置是否可用
 */
export function isDifyConfigured(): boolean {
  return !!(process.env.DIFY_API_KEY && process.env.DIFY_APP_ID);
}
