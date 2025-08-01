import { Badge } from "@/components/ui/badge";
import { Bot, Zap } from "lucide-react";

interface AIStatusProps {
  isUsingDify?: boolean;
}

/**
 * AI 状态指示器 - 显示当前使用的 AI 服务状态
 */
export function AIStatus({ isUsingDify = false }: AIStatusProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1">
      <div className="flex items-center gap-1">
        <Bot className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">AI 服务:</span>
      </div>
      
      {isUsingDify ? (
        <Badge variant="default" className="text-xs h-5 px-2 bg-green-100 text-green-800 hover:bg-green-100">
          <Zap className="h-3 w-3 mr-1" />
          Dify AI
        </Badge>
      ) : (
        <Badge variant="secondary" className="text-xs h-5 px-2">
          模拟模式
        </Badge>
      )}
    </div>
  );
}
