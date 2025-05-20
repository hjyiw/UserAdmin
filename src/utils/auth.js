import Cookies from "js-cookie";

const TokenKey = "Admin-Token";

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
