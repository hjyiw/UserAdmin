import Cookies from "js-cookie";

const TokenKey = "Admin-Token";
const UsernameKey = "Admin-Username";
const PasswordKey = "Admin-Password";
const RememberMeKey = "Admin-RememberMe";

/**
 * 获取token
 * @returns {string} token值
 */
export function getToken() {
  return Cookies.get(TokenKey);
}

/**
 * 设置token
 * @param {string} token - 要设置的token值
 * @returns {string} 设置的token值
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

/**
 * 移除token
 * @returns {void}
 */
export function removeToken() {
  return Cookies.remove(TokenKey);
}

/**
 * 获取存储的用户名
 * @returns {string} 用户名
 */
export function getUsername() {
  return Cookies.get(UsernameKey);
}

/**
 * 设置用户名
 * @param {string} username - 用户名
 * @param {number} expires - 过期时间(天)，默认7天
 * @returns {string} 设置的用户名
 */
export function setUsername(username, expires = 7) {
  return Cookies.set(UsernameKey, username, { expires });
}

/**
 * 移除存储的用户名
 * @returns {void}
 */
export function removeUsername() {
  return Cookies.remove(UsernameKey);
}

/**
 * 获取存储的密码
 * @returns {string} 密码
 */
export function getPassword() {
  return Cookies.get(PasswordKey);
}

/**
 * 设置密码
 * @param {string} password - 密码
 * @param {number} expires - 过期时间(天)，默认7天
 * @returns {string} 设置的密码
 */
export function setPassword(password, expires = 7) {
  return Cookies.set(PasswordKey, password, { expires });
}

/**
 * 移除存储的密码
 * @returns {void}
 */
export function removePassword() {
  return Cookies.remove(PasswordKey);
}

/**
 * 获取记住我状态
 * @returns {boolean} 记住我状态
 */
export function getRememberMe() {
  return Cookies.get(RememberMeKey) === "true";
}

/**
 * 设置记住我状态
 * @param {boolean} rememberMe - 记住我状态
 * @param {number} expires - 过期时间(天)，默认7天
 * @returns {string} 设置的状态
 */
export function setRememberMe(rememberMe, expires = 7) {
  return Cookies.set(RememberMeKey, rememberMe, { expires });
}

/**
 * 移除记住我状态
 * @returns {void}
 */
export function removeRememberMe() {
  return Cookies.remove(RememberMeKey);
}

/**
 * 清除所有保存的登录信息
 * @returns {void}
 */
export function clearLoginInfo() {
  removeToken();
  removeUsername();
  removePassword();
  removeRememberMe();
}
