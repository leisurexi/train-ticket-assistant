import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface QuickActionsProps {
  onQuickAction: (message: string) => void;
  disabled?: boolean;
}

/**
 * 快捷操作组件 - 提供常用查询的快捷按钮
 */
export function QuickActions({ onQuickAction, disabled = false }: QuickActionsProps) {
  const quickActions = [
    {
      label: "北京 → 上海",
      message: "北京到上海，明天"
    },
    {
      label: "广州 → 深圳", 
      message: "广州南到深圳北，今天下午"
    },
    {
      label: "杭州 → 南京",
      message: "杭州东到南京南，下周五"
    }
  ];

  return (
    <Card className="mx-4 mb-4 p-4">
      <div className="mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          💡 试试这些查询
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onQuickAction(action.message)}
            disabled={disabled}
            className="text-xs h-8 px-3 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
          >
            {action.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
