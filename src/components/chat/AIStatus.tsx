import { Bot, Zap } from "lucide-react";

interface AIStatusProps {
  isUsingDify?: boolean;
}

/**
 * AI 状态指示器 - 显示当前使用的 AI 服务状态
 */
export function AIStatus({ isUsingDify = false }: AIStatusProps) {
  return (
    <div className="flex items-center gap-2">
      {isUsingDify ? (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-500/20 shadow-sm">
          <div className="relative">
            <Zap className="h-3.5 w-3.5 drop-shadow-sm" />
            <div className="absolute inset-0 animate-ping">
              <Zap className="h-3.5 w-3.5 opacity-30" />
            </div>
          </div>
          <span className="text-xs font-medium">Dify AI</span>
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        </div>
      ) : (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-slate-500/10 to-gray-500/10 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-500/20">
          <Bot className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">模拟模式</span>
          <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
        </div>
      )}
    </div>
  );
}
