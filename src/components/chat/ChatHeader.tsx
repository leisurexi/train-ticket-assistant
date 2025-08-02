'use client';

import { Card } from "@/components/ui/card";
import { Train, Sparkles } from "lucide-react";
import { AIStatus } from "./AIStatus";
import { useEffect, useState } from "react";

/**
 * 聊天页面头部组件
 */
export function ChatHeader() {
  const [isUsingDify, setIsUsingDify] = useState(false);

  useEffect(() => {
    // 检查 Dify 配置状态
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setIsUsingDify(data.difyConfigured))
      .catch(console.error);
  }, []);
  return (
    <div className="relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-xl" />

      <Card className="relative mx-4 mt-4 mb-2 p-6 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-start gap-4">
          {/* 图标区域 */}
          <div className="relative group-hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-inner group-hover:shadow-md transition-shadow duration-300">
              <Train className="h-6 w-6 text-primary drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
            </div>
            {/* 装饰性光点 */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-lg group-hover:animate-bounce" />
          </div>

          <div className="flex-1 min-w-0">
            {/* 标题区域 */}
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                火车票助手
              </h1>
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-amber-500 animate-pulse drop-shadow-sm" />
                <div className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-primary/20 to-primary/10 text-primary rounded-full border border-primary/20">
                  AI
                </div>
              </div>
            </div>

            {/* 描述文字 */}
            <p className="text-sm text-muted-foreground/90 leading-relaxed mb-3">
              🚄 智能查询火车票信息，支持自然语言输入
            </p>

            {/* 状态和功能标签 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <AIStatus isUsingDify={isUsingDify} />

              {/* 功能标签 - 移动端隐藏部分标签 */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500/10 text-green-600 dark:text-green-400 rounded-md border border-green-500/20">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="hidden xs:inline">实时查询</span>
                  <span className="xs:hidden">实时</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md border border-blue-500/20">
                  📱 移动适配
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部装饰线 */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </Card>
    </div>
  );
}
