'use client';

import { useState, useRef, useEffect, useCallback, FormEvent, KeyboardEvent, ClipboardEvent } from 'react';
import Image from 'next/image';
import { ArrowLeftIcon } from '@/shared/components';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

interface OtpFormProps {
  email: string;
  onBack: () => void;
  onSubmit?: (otp: string) => void;
}

export function OtpForm({ email, onBack, onSubmit }: OtpFormProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const updateDigit = useCallback((index: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;
    updateDigit(index, val.slice(-1));
    if (index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digits[index]) {
        updateDigit(index, '');
      } else if (index > 0) {
        updateDigit(index - 1, '');
        inputsRef.current[index - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => (next[i] = ch));
    setDigits(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[focusIdx]?.focus();
  };

  const otp = digits.join('');
  const isValid = otp.length === OTP_LENGTH;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit?.(otp);
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(RESEND_SECONDS);
    // TODO: call resend OTP API
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <p className="text-center text-sm text-[#717179]">
        Vui lòng xác nhận mã OTP đã được gửi đến
      </p>
      <p className="text-center text-sm font-semibold text-[#09090B]">{email}</p>

      <div className="flex justify-center gap-3">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={handleChange(i)}
            onKeyDown={handleKeyDown(i)}
            onPaste={i === 0 ? handlePaste : undefined}
            className="h-12 w-12 rounded-[6px] border border-gray-300 bg-white text-center text-lg font-semibold text-gray-900 shadow-sm outline-none ring-2 ring-transparent transition-all focus:border-gray-900 focus:ring-gray-900/20"
          />
        ))}
      </div>

      <p className="text-center text-sm text-gray-400">
        {countdown > 0 ? (
          <>Gửi lại OTP ({countdown}s)</>
        ) : (
          <button type="button" onClick={handleResend} className="cursor-pointer font-medium text-black hover:underline">
            Gửi lại OTP
          </button>
        )}
      </p>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex cursor-pointer items-center gap-1 text-sm text-gray-600 transition-colors hover:text-black"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="relative flex cursor-pointer items-center justify-center transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Image src="/images/auth/Button_mini.png" alt="" width={200} height={48} className="h-10 w-auto" draggable={false} />
          <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm font-semibold text-white">
            Tiếp tục
          </span>
        </button>
      </div>
    </form>
  );
}
