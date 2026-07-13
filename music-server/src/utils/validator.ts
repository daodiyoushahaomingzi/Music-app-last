/**
 * 验证邮箱格式
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证用户名（3-30字符，只允许字母、数字、下划线）
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

/**
 * 验证密码（至少6字符）
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * 验证手机号（中国）
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 验证URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 验证是否为有效的ObjectId
 */
export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * 验证请求体
 */
export const validateRequired = (data: any, fields: string[]): string | null => {
  for (const field of fields) {
    if (!data[field] || data[field].trim() === '') {
      return `${field} 是必填字段`;
    }
  }
  return null;
};