'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { loginUser } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Mail, Loader2 } from 'lucide-react';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 登录对话框组件
 */
export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('请输入邮箱地址');
      return;
    }

    if (!validateEmail(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 使用 API 工具函数登录
      const data = await loginUser(email);

      // 使用 AuthContext 的 login 方法
      if (data.data?.user && data.data?.token) {
        const userData = {
          id: data.data.user.id,
          name: data.data.user.name,
          email: data.data.user.email,
        };

        login(userData, data.data.token);
      } else {
        throw new Error('登录响应数据格式错误');
      }
      onOpenChange(false);
      setEmail('');
    } catch (err) {
      console.error('登录错误:', err);
      setError(err instanceof Error ? err.message : '登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      setEmail('');
      setError('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            登录账户
          </DialogTitle>
          <DialogDescription>
            输入您的邮箱地址即可快速登录火车票助手
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱地址</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="请输入您的邮箱地址"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className="pl-10"
                disabled={isLoading}
                autoComplete="email"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </Button>
          </DialogFooter>
        </form>

        {/* 底部提示 */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            首次登录将自动创建账户
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
