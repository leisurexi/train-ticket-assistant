'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/lib/utils';

interface MarkdownProps {
  content: string;
  className?: string;
}

/**
 * Markdown 渲染组件 - 用于渲染 AI 回复中的 Markdown 格式内容
 */
export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn('markdown-content', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // 自定义标题样式
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-3 text-foreground border-b border-border pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mb-2 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium mb-2 text-foreground">
              {children}
            </h3>
          ),
          
          // 自定义段落样式
          p: ({ children }) => (
            <p className="mb-3 text-foreground leading-relaxed last:mb-0">
              {children}
            </p>
          ),
          
          // 自定义列表样式
          ul: ({ children }) => (
            <ul className="mb-3 ml-4 space-y-1 list-disc text-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 ml-4 space-y-1 list-decimal text-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground leading-relaxed">
              {children}
            </li>
          ),
          
          // 自定义代码块样式
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            
            if (inline) {
              return (
                <code 
                  className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            
            return (
              <div className="mb-3">
                <pre className="p-4 rounded-lg bg-muted overflow-x-auto">
                  <code 
                    className={cn(
                      'font-mono text-sm text-muted-foreground',
                      match && `language-${match[1]}`
                    )}
                    {...props}
                  >
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          
          // 自定义引用样式
          blockquote: ({ children }) => (
            <blockquote className="mb-3 pl-4 border-l-4 border-primary/30 bg-muted/30 py-2 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          
          // 自定义表格样式
          table: ({ children }) => (
            <div className="mb-3 overflow-x-auto">
              <table className="w-full border-collapse border border-border rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border border-border px-3 py-2 text-left font-medium text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-2 text-foreground">
              {children}
            </td>
          ),
          
          // 自定义链接样式
          a: ({ children, href }) => (
            <a 
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline underline-offset-2"
            >
              {children}
            </a>
          ),
          
          // 自定义分割线样式
          hr: () => (
            <hr className="my-4 border-border" />
          ),
          
          // 自定义强调样式
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
