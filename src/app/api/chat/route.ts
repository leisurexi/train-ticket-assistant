import { NextRequest } from 'next/server';
import { createDifyClient, isDifyConfigured } from '@/lib/dify';

/**
 * 聊天API路由 - 处理用户消息并返回流式响应
 */
export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return new Response('消息内容不能为空', { status: 400 });
    }

    // 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 检查是否配置了 Dify AI
          if (isDifyConfigured()) {
            const difyClient = createDifyClient();
            if (difyClient) {
              // 使用 Dify AI 进行流式响应
              const stream = difyClient.streamChat(message);

              for await (const chunk of stream) {
                if (chunk) {
                  const data = JSON.stringify({ content: chunk });
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                }
              }

              // 发送结束信号
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
              return;
            }
          }

          // 回退到模拟响应
          const response = await generateTrainTicketResponse(message);

          // 将响应分块发送，模拟流式输出
          const chunks = splitIntoChunks(response, 10);

          for (const chunk of chunks) {
            const data = JSON.stringify({ content: chunk });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));

            // 模拟延迟
            await new Promise(resolve => setTimeout(resolve, 50));
          }

          // 发送结束信号
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('生成响应时出错:', error);
          const errorData = JSON.stringify({ 
            content: '抱歉，处理您的请求时出现了错误。' 
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API路由错误:', error);
    return new Response('服务器内部错误', { status: 500 });
  }
}

/**
 * 生成火车票查询响应
 */
async function generateTrainTicketResponse(message: string): Promise<string> {
  // 这里可以集成真实的大模型API
  // 目前使用模拟响应
  
  const lowerMessage = message.toLowerCase();
  
  // 简单的关键词匹配
  if (lowerMessage.includes('北京') && lowerMessage.includes('上海')) {
    return `# 🚄 北京到上海火车票查询结果

## 高速动车组列车

| 车次 | 出发站 | 到达站 | 发车时间 | 到达时间 | 二等座 | 一等座 | 商务座 |
|------|--------|--------|----------|----------|--------|--------|--------|
| **G1次** | 北京南 | 上海虹桥 | 06:00 | 10:28 | ¥553 | ¥933 | ¥1748 |
| **G3次** | 北京南 | 上海虹桥 | 07:00 | 11:28 | ¥553 | ¥933 | ¥1748 |
| **G5次** | 北京南 | 上海虹桥 | 08:00 | 12:28 | ¥553 | ¥933 | ¥1748 |

## 💡 购票建议

- **提前购票**：建议提前30天购票，票源更充足
- **价格优势**：工作日票价相对较低
- **官方渠道**：可关注 [12306官网](https://www.12306.cn) 获取最新信息

> **温馨提示**：以上信息仅供参考，实际票价和余票情况请以12306官网为准。

---

需要我帮您查询其他日期或车次信息吗？`;
  }
  
  if (lowerMessage.includes('广州') && lowerMessage.includes('深圳')) {
    return `# 🚄 广州到深圳城际列车查询

## 城际高速列车时刻表

| 车次 | 出发站 | 到达站 | 发车时间 | 到达时间 | 运行时长 | 二等座 | 一等座 |
|------|--------|--------|----------|----------|----------|--------|--------|
| **C7001** | 广州南 | 深圳北 | 06:20 | 06:55 | 35分钟 | ¥74.5 | ¥89.5 |
| **C7003** | 广州南 | 深圳北 | 06:40 | 07:15 | 35分钟 | ¥74.5 | ¥89.5 |
| **C7005** | 广州南 | 深圳北 | 07:00 | 07:35 | 35分钟 | ¥74.5 | ¥89.5 |

## ✨ 城际列车特色

- **班次密集**：约15-20分钟一班，无需担心错过
- **快速便捷**：全程仅需35分钟
- **电子票务**：支持刷身份证直接进站

\`\`\`
💳 购票方式
• 12306官网/APP
• 车站自助售票机
• 人工售票窗口
\`\`\`

> **小贴士**：广深城际是粤港澳大湾区的重要交通纽带，连接广州和深圳两大核心城市。

还需要查询其他时间段的班次吗？`;
  }
  
  // 默认响应
  return `# 🤖 火车票智能助手

您好！我已收到您的查询请求：

> "${message}"

## 🔍 正在智能解析...

我正在努力识别您的出行需求，包括：

- **出发地和目的地** 🚩
- **出行日期** 📅
- **座位偏好** 🎫

## 💡 查询建议

为了更好地为您服务，请提供更详细的信息：

### 推荐格式

\`\`\`
北京到上海，明天上午出发
广州南到深圳北，1月15日
杭州东到南京南，下周五下午
\`\`\`

### 车次类型

- **高铁** (G字头) - 速度最快，价格较高
- **动车** (D字头) - 速度较快，价格适中
- **城际** (C字头) - 短途首选，班次密集
- **普通列车** (K/T字头) - 价格实惠，时间较长

---

**需要我帮您重新查询吗？** 😊`;
}

/**
 * 将文本分割成小块，用于流式输出
 */
function splitIntoChunks(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}
