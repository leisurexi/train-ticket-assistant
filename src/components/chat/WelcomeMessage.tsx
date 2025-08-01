import { Card } from "@/components/ui/card";
import { MessageCircle, MapPin, Calendar, Zap } from "lucide-react";

/**
 * 欢迎消息组件 - 显示使用说明和示例
 */
export function WelcomeMessage() {
  const examples = [
    "北京到上海，明天",
    "广州南到深圳北，2024年1月15日",
    "杭州东到南京南，下周五"
  ];

  const features = [
    {
      icon: MapPin,
      title: "智能识别",
      description: "自动识别始发地和目的地"
    },
    {
      icon: Calendar,
      title: "日期解析",
      description: "支持自然语言日期输入"
    },
    {
      icon: Zap,
      title: "实时查询",
      description: "快速获取最新票务信息"
    }
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              欢迎使用火车票助手！
            </h2>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              我可以帮您查询火车票信息
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              💡 使用示例：
            </h3>
            <div className="space-y-2">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-white/60 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
                >
                  <code className="text-sm text-blue-800 dark:text-blue-200">
                    {example}
                  </code>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-white/60 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
              >
                <feature.icon className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <div className="font-medium text-blue-900 dark:text-blue-100 text-sm">
                    {feature.title}
                  </div>
                  <div className="text-blue-700 dark:text-blue-300 text-xs">
                    {feature.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
