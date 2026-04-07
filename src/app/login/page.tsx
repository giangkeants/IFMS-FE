'use client';

import { useState } from 'react';
import { Squircle } from 'corner-smoothing';
import { LoginForm, ForgotPasswordForm, OtpForm } from '@/features/auth';
import { PhoneIcon, MailIcon } from '@/shared/components';

type View = 'login' | 'forgot' | 'otp';

const HEADINGS: Record<View, { title: string; subtitle?: string }> = {
  login: { title: 'Chào mừng', subtitle: 'Nền tảng thông minh cho quản lý tài sản.' },
  forgot: { title: 'Quên mật khẩu', subtitle: 'Vui lòng nhập tất cả thông tin bên dưới' },
  otp: { title: 'Xác nhận OTP' },
};

export default function LoginPage() {
  const [view, setView] = useState<View>('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const heading = HEADINGS[view];

  const handleForgotSubmit = (email: string) => {
    setForgotEmail(email);
    setView('otp');
  };

  return (
    <div className="isometric-bg flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="glow-border">
          <Squircle
            cornerRadius={32}
            cornerSmoothing={1}
            className="relative z-1 border border-white/60 bg-white/50 p-8 shadow-md"
          >
            <h2 className={`mb-1 text-center font-bold text-[#09090B] ${view === 'login' ? 'text-[44px]' : 'text-[24px]'}`}>
              {heading.title}
            </h2>
            {heading.subtitle && (
              <p className="mb-6 text-center text-sm text-[#717179]">{heading.subtitle}</p>
            )}

            {view === 'login' && (
              <LoginForm onForgotPassword={() => setView('forgot')} />
            )}
            {view === 'forgot' && (
              <ForgotPasswordForm onBack={() => setView('login')} onSubmit={handleForgotSubmit} />
            )}
            {view === 'otp' && (
              <OtpForm email={forgotEmail} onBack={() => setView('forgot')} />
            )}
          </Squircle>
        </div>

        <div className="mt-6 flex gap-4">
          <a
            href="tel:09111111123"
            className="flex flex-1 items-center justify-center gap-2 rounded-[6px] border border-white/60 bg-white/50 px-2 py-2 text-sm font-medium shadow-sm backdrop-blur-sm transition-colors hover:bg-white/70"
          >
            <PhoneIcon />
            <span>HOTLINE: <strong className="text-[#439288]">09111111123</strong></span>
          </a>
          <a
            href="mailto:hotro@ifms.com"
            className="flex flex-1 items-center justify-center gap-2 rounded-[6px] border border-white/60 bg-white/50 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm transition-colors hover:bg-white/70"
          >
            <MailIcon />
            <span>EMAIL: <strong className="text-[#439288]">hotro@ifms.com</strong></span>
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} IFMS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
