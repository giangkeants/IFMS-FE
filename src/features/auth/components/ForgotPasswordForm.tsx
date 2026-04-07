'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdCardIcon,
} from '@/shared/components';
import { required, email, phoneVN, cccdVN, validate } from '@/shared/utils';

const INPUT_CLASS =
  'block w-full rounded-[6px] border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 outline-none ring-2 ring-transparent transition-all focus:border-gray-900 focus:ring-gray-900/20';

const INPUT_ERROR_CLASS =
  'block w-full rounded-[6px] border border-red-400 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 outline-none ring-2 ring-red-500/20 transition-all focus:border-red-500 focus:ring-red-500/30';

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSubmit?: (email: string) => void;
}

const fields = [
  { key: 'username', label: 'Tên đăng nhập', placeholder: 'Nhập tên đăng nhập', icon: UserIcon, rules: [required('Tên đăng nhập là bắt buộc')] },
  { key: 'email', label: 'Email', placeholder: 'Nhập email đã đăng ký', icon: EnvelopeIcon, rules: [required('Email là bắt buộc'), email()] },
  { key: 'phone', label: 'Số điện thoại', placeholder: 'Nhập số điện thoại đã đăng ký', icon: PhoneIcon, rules: [required('Số điện thoại là bắt buộc'), phoneVN()] },
  { key: 'idCard', label: 'Căn cước công dân', placeholder: 'Nhập số căn cước công dân', icon: IdCardIcon, rules: [required('CCCD là bắt buộc'), cccdVN()] },
] as const;

type FieldKey = (typeof fields)[number]['key'];

const INITIAL_VALUES = Object.fromEntries(fields.map((f) => [f.key, ''])) as Record<FieldKey, string>;
const INITIAL_TOUCHED = Object.fromEntries(fields.map((f) => [f.key, false])) as Record<FieldKey, boolean>;

export function ForgotPasswordForm({ onBack, onSubmit }: ForgotPasswordFormProps) {
  const [form, setForm] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState(INITIAL_TOUCHED);

  const errors = Object.fromEntries(
    fields.map((f) => [f.key, touched[f.key] ? validate(form[f.key], ...f.rules) : ''])
  ) as Record<FieldKey, string>;

  const isValid = fields.every((f) => validate(form[f.key], ...f.rules) === '');

  const handleChange = (key: FieldKey) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleBlur = (key: FieldKey) => () =>
    setTouched((prev) => ({ ...prev, [key]: true }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(fields.map((f) => [f.key, true])) as Record<FieldKey, boolean>;
    setTouched(allTouched);
    if (!isValid) return;
    onSubmit?.(form.email);
    // TODO: call forgot password API
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {fields.map(({ key, label, placeholder, icon: Icon }) => (
        <div key={key}>
          <label htmlFor={key} className="mb-1.5 block text-sm font-medium text-gray-700">
            {label} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon className="h-4 w-4" />
            </span>
            <input
              id={key}
              type="text"
              value={form[key]}
              onChange={handleChange(key)}
              onBlur={handleBlur(key)}
              placeholder={placeholder}
              className={errors[key] ? INPUT_ERROR_CLASS : INPUT_CLASS}
            />
          </div>
          {errors[key] && <p className="mt-1 text-sm text-red-500">{errors[key]}</p>}
        </div>
      ))}

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
