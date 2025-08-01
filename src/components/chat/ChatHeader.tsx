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
    <Card className="mx-4 mt-4 mb-2 p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <Train className="h-5 w-5 text-primary" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-foreground">
              火车票助手
            </h1>
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground">
            智能查询火车票信息，支持自然语言输入
          </p>
          <div className="mt-2">
            <AIStatus isUsingDify={isUsingDify} />
          </div>
        </div>
      </div>
    </Card>
  );
}
