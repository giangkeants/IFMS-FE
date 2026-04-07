type Validator = (value: string) => string;

export const required =
  (message = 'Trường này là bắt buộc'): Validator =>
  (value) =>
    value.trim() ? '' : message;

export const email =
  (message = 'Email không hợp lệ'): Validator =>
  (value) =>
    !value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : message;

/**
 * Vietnam phone: 0[3|5|7|8|9]xxxxxxxx (10 digits)
 */
export const phoneVN =
  (message = 'Số điện thoại không hợp lệ'): Validator =>
  (value) =>
    !value.trim() || /^0(3|5|7|8|9)\d{8}$/.test(value) ? '' : message;

/**
 * Vietnam ID: 9 digits (old CMND) or 12 digits (new CCCD), numeric only
 */
export const cccdVN =
  (message = 'Số CMND/CCCD không hợp lệ (9 hoặc 12 chữ số)'): Validator =>
  (value) =>
    !value.trim() || /^[0-9]{9}$|^[0-9]{12}$/.test(value) ? '' : message;

export function validate(value: string, ...validators: Validator[]): string {
  for (const v of validators) {
    const error = v(value);
    if (error) return error;
  }
  return '';
}
