/**
 * 自定义指令
 */
import { checkDataPermission, DATA_SCOPE_TYPES } from "./permission";
import { useUserStore } from "@/store";

/**
 * 数据权限指令
 * 用法：
 * 1. v-data-perm="'edit'" - 检查当前用户是否有编辑权限
 * 2. v-data-perm="{ resource: row, action: 'edit' }" - 检查当前用户是否有编辑指定资源的权限
 */
export const dataPermission = {
  mounted(el, binding) {
    const userStore = useUserStore();

    // 如果是管理员，则不进行权限控制
    if (userStore.roles.includes("admin")) {
      return;
    }

    let hasPermission = false;

    if (typeof binding.value === "string") {
      // 简单模式: v-data-perm="'edit'"
      // 这种模式只检查用户是否有全部数据权限或者自定义权限
      const action = binding.value;
      hasPermission = userStore.dataScope === DATA_SCOPE_TYPES.ALL;
    } else if (typeof binding.value === "object") {
      // 完整模式: v-data-perm="{ resource: row, action: 'edit' }"
      const { resource, action = "view" } = binding.value || {};
      if (!resource) {
        hasPermission = false;
      } else {
        hasPermission = checkDataPermission(resource, action);
      }
    }

    if (!hasPermission) {
      // 如果没有权限，则移除元素
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      } else {
        el.style.display = "none";
      }
    }
  },
};

/**
 * 注册所有自定义指令
 * @param {Object} app - Vue应用实例
 */
export function setupDirectives(app) {
  app.directive("data-perm", dataPermission);
}
