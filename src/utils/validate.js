/**
 * 表单验证规则
 */

// 用户名验证规则：字母开头，允许5-20字节，允许字母数字下划线
export const usernamePattern = /^[a-zA-Z][a-zA-Z0-9_]{4,19}$/;

// 密码强度验证：至少8位，包括至少1个大写字母，1个小写字母，1个数字和1个特殊字符
export const strongPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// 简单密码验证：至少6位
export const simplePasswordPattern = /^.{6,}$/;

// 手机号验证规则（中国大陆）
export const phonePattern = /^1[3-9]\d{9}$/;

// 邮箱验证规则
export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 身份证号验证规则（18位）
export const idCardPattern = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

/**
 * 验证用户名是否符合规则
 * @param {string} username - 用户名
 * @returns {boolean} - 是否符合规则
 */
export function validateUsername(username) {
  return usernamePattern.test(username);
}

/**
 * 验证密码是否符合强密码规则
 * @param {string} password - 密码
 * @returns {boolean} - 是否符合规则
 */
export function validateStrongPassword(password) {
  return strongPasswordPattern.test(password);
}

/**
 * 验证密码是否符合简单密码规则
 * @param {string} password - 密码
 * @returns {boolean} - 是否符合规则
 */
export function validateSimplePassword(password) {
  return simplePasswordPattern.test(password);
}

/**
 * 验证手机号是否符合规则
 * @param {string} phone - 手机号
 * @returns {boolean} - 是否符合规则
 */
export function validatePhone(phone) {
  return phonePattern.test(phone);
}

/**
 * 验证邮箱是否符合规则
 * @param {string} email - 邮箱
 * @returns {boolean} - 是否符合规则
 */
export function validateEmail(email) {
  return emailPattern.test(email);
}

/**
 * 验证身份证号是否符合规则
 * @param {string} idCard - 身份证号
 * @returns {boolean} - 是否符合规则
 */
export function validateIdCard(idCard) {
  return idCardPattern.test(idCard);
}

/**
 * 自定义表单验证规则
 */
export const formRules = {
  // 用户名验证规则
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      pattern: usernamePattern,
      message: "用户名必须以字母开头，5-20个字符，只能包含字母、数字和下划线",
      trigger: "blur",
    },
  ],
  // 密码验证规则（简单）
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern: simplePasswordPattern,
      message: "密码长度不能小于6位",
      trigger: "blur",
    },
  ],
  // 密码验证规则（强密码）
  strongPassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern: strongPasswordPattern,
      message: "密码至少8位，必须包含大小写字母、数字和特殊字符",
      trigger: "blur",
    },
  ],
  // 手机号验证规则
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: phonePattern, message: "请输入正确的手机号", trigger: "blur" },
  ],
  // 邮箱验证规则
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { pattern: emailPattern, message: "请输入正确的邮箱地址", trigger: "blur" },
  ],
};
