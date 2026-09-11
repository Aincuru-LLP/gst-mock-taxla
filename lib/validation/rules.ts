export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const MOBILE_REGEX = /^[6-9][0-9]{9}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PIN_REGEX = /^[1-9][0-9]{5}$/;
export const AADHAAR_REGEX = /^[2-9][0-9]{11}$/;
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export const CONSTITUTION_OPTIONS = [
  'Proprietorship',
  'Partnership',
  'LLP',
  'Private Limited Company',
  'Public Limited Company',
  'One Person Company',
  'HUF',
  'Trust',
  'Society',
  'Other'
];

export const TAXPAYER_TYPE_OPTIONS = [
  'Taxpayer',
  'Tax Deductor',
  'Tax Collector',
  'Non-Resident Taxable Person',
  'Input Service Distributor'
];

export const DEMO_OTP = '123456';
export const DEMO_CAPTCHA = '1234';
export const DISPLAY_CAPTCHA_TEXT = '7K9P2';

export function validatePan(pan: string): boolean {
  if (!pan) return false;
  return PAN_REGEX.test(pan.trim().toUpperCase());
}

export function validateMobile(mobile: string): boolean {
  if (!mobile) return false;
  return MOBILE_REGEX.test(mobile.trim());
}

export function validateEmail(email: string): boolean {
  if (!email) return false;
  return EMAIL_REGEX.test(email.trim());
}

export function validatePin(pin: string): boolean {
  if (!pin) return false;
  return PIN_REGEX.test(pin.trim());
}

export function validateIfsc(ifsc: string): boolean {
  if (!ifsc) return false;
  return IFSC_REGEX.test(ifsc.trim().toUpperCase());
}

export function validateOtp(enteredOtp: string, scenario: string = 'success'): boolean {
  if (scenario === 'otp-failure') return false;
  const clean = (enteredOtp || '').trim();
  return clean === DEMO_OTP || clean === '123456' || clean === '654321';
}

export function validateCaptcha(enteredCaptcha: string, scenario: string = 'success'): boolean {
  if (scenario === 'captcha-failure') return false;
  const clean = (enteredCaptcha || '').trim().toLowerCase();
  return clean === DEMO_CAPTCHA || clean === DISPLAY_CAPTCHA_TEXT.toLowerCase();
}
