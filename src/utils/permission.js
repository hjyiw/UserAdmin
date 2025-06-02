import { useUserStore } from "@/store";
import { ElMessage } from "element-plus";

/**
 * 检查用户是否有指定权限
 * @param {string} permission - 需要检查的权限标识
 * @param {boolean} showTip - 是否在没有权限时显示提示，默认为true
 * @returns {boolean} - 是否有权限
 */
export function checkPermission(permission, showTip = true) {
  const userStore = useUserStore();
  const hasPermission = userStore.hasPermission(permission);

  if (!hasPermission && showTip) {
    ElMessage.error("权限不足，无法执行此操作");
  }

  return hasPermission;
}

/**
 * 检查用户是否有多个权限中的任意一个
 * @param {string[]} permissions - 需要检查的权限标识数组
 * @param {boolean} showTip - 是否在没有权限时显示提示，默认为true
 * @returns {boolean} - 是否有权限
 */
export function checkAnyPermission(permissions, showTip = true) {
  const userStore = useUserStore();
  const hasPermission = userStore.hasAnyPermission(permissions);

  if (!hasPermission && showTip) {
    ElMessage.error("权限不足，无法执行此操作");
  }

  return hasPermission;
}

/**
 * 检查用户是否有所有指定权限
 * @param {string[]} permissions - 需要检查的权限标识数组
 * @param {boolean} showTip - 是否在没有权限时显示提示，默认为true
 * @returns {boolean} - 是否有权限
 */
export function checkAllPermissions(permissions, showTip = true) {
  const userStore = useUserStore();
  const hasPermission = userStore.hasAllPermissions(permissions);

  if (!hasPermission && showTip) {
    ElMessage.error("权限不足，无法执行此操作");
  }

  return hasPermission;
}

/**
 * 创建权限检查函数
 * @param {string} permission - 需要检查的权限标识
 * @returns {Function} - 返回一个函数，用于在组件中检查权限
 */
export function withPermission(permission) {
  return () => checkPermission(permission);
}

/**
 * 根据权限控制按钮是否禁用
 * @param {string} permission - 需要检查的权限标识
 * @returns {boolean} - 是否禁用
 */
export function disableWithoutPermission(permission) {
  const userStore = useUserStore();
  return !userStore.hasPermission(permission);
}
