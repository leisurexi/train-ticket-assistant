import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * 错误消息组件 - 显示错误信息和重试按钮
 */
export function ErrorMessage({ 
  message = "抱歉，服务暂时不可用，请稍后再试。", 
  onRetry 
}: ErrorMessageProps) {
  return (
    <Card className="mx-4 my-4 p-4 border-destructive/20 bg-destructive/5">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/10 shrink-0">
          <AlertCircle className="h-4 w-4 text-destructive" />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="text-sm text-destructive font-medium">
            出现错误
          </div>
          <div className="text-sm text-muted-foreground">
            {message}
          </div>
          
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-2 h-8 px-3 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              重试
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
