import { useUserStore } from "@/store";

/**
 * 权限指令
 * 用法：v-permission="'system:user:add'"
 * 如果用户没有指定权限，元素将被从DOM中移除
 */
export const permission = {
  mounted(el, binding) {
    const { value } = binding;
    const userStore = useUserStore();

    if (value && typeof value === "string") {
      const hasPermission = userStore.hasPermission(value);
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error("需要指定权限标识字符串");
    }
  },
};

/**
 * 任意权限指令
 * 用法：v-any-permission="['system:user:add', 'system:user:edit']"
 * 如果用户没有指定权限中的任意一个，元素将被从DOM中移除
 */
export const anyPermission = {
  mounted(el, binding) {
    const { value } = binding;
    const userStore = useUserStore();

    if (value && Array.isArray(value) && value.length > 0) {
      const hasPermission = userStore.hasAnyPermission(value);
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error("需要指定权限标识数组");
    }
  },
};

/**
 * 所有权限指令
 * 用法：v-all-permissions="['system:user:add', 'system:user:edit']"
 * 如果用户没有所有指定权限，元素将被从DOM中移除
 */
export const allPermissions = {
  mounted(el, binding) {
    const { value } = binding;
    const userStore = useUserStore();

    if (value && Array.isArray(value) && value.length > 0) {
      const hasPermission = userStore.hasAllPermissions(value);
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error("需要指定权限标识数组");
    }
  },
};

/**
 * 权限禁用指令
 * 用法：v-permission-disabled="'system:user:add'"
 * 如果用户没有指定权限，元素将被禁用
 */
export const permissionDisabled = {
  mounted(el, binding) {
    const { value } = binding;
    const userStore = useUserStore();

    if (value && typeof value === "string") {
      const hasPermission = userStore.hasPermission(value);
      if (!hasPermission) {
        el.disabled = true;
        el.classList.add("is-disabled");
        // 添加禁用样式
        el.style.cursor = "not-allowed";
        el.style.opacity = "0.6";
      }
    } else {
      throw new Error("需要指定权限标识字符串");
    }
  },
};

// 导出所有指令
export default {
  permission,
  anyPermission,
  allPermissions,
  permissionDisabled,
};
