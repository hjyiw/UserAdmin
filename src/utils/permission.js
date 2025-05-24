/**
 * 数据权限工具类
 */
import { useUserStore } from "@/store";

// 数据权限类型
export const DATA_SCOPE_TYPES = {
  ALL: "1", // 全部数据权限
  CUSTOM: "2", // 自定义数据权限
  DEPT: "3", // 本部门数据权限
  DEPT_AND_CHILD: "4", // 本部门及以下数据权限
  SELF: "5", // 仅本人数据权限
};

/**
 * 检查用户是否有指定数据的操作权限
 * @param {Object} data - 要检查的数据对象
 * @param {String} actionType - 操作类型：view(查看), edit(编辑), delete(删除)
 * @returns {Boolean} - 是否有权限
 */
export function checkDataPermission(data, actionType = "view") {
  const userStore = useUserStore();
  const user = userStore.userInfo;
  const roles = userStore.roles || [];

  // 管理员拥有所有权限
  if (roles.includes("admin")) {
    return true;
  }

  // 获取用户的数据权限设置
  const dataScope = userStore.permissions?.dataScope || DATA_SCOPE_TYPES.SELF;

  // 全部数据权限
  if (dataScope === DATA_SCOPE_TYPES.ALL) {
    return true;
  }

  // 仅本人数据权限
  if (dataScope === DATA_SCOPE_TYPES.SELF) {
    return data.createBy === user.userId || data.userId === user.userId;
  }

  // 本部门数据权限
  if (dataScope === DATA_SCOPE_TYPES.DEPT) {
    return data.deptId === user.deptId;
  }

  // 本部门及以下数据权限
  if (dataScope === DATA_SCOPE_TYPES.DEPT_AND_CHILD) {
    // 这里需要部门树结构，简化处理，假设 data.deptPath 包含部门路径
    return data.deptPath && data.deptPath.startsWith(user.deptPath);
  }

  // 自定义数据权限
  if (dataScope === DATA_SCOPE_TYPES.CUSTOM) {
    // 假设用户的自定义权限部门列表存储在 user.deptIds 中
    return user.deptIds && user.deptIds.includes(data.deptId);
  }

  return false;
}

/**
 * 根据数据权限过滤数据列表
 * @param {Array} dataList - 数据列表
 * @returns {Array} - 过滤后的数据列表
 */
export function filterDataByPermission(dataList) {
  if (!Array.isArray(dataList)) {
    return [];
  }

  return dataList.filter((item) => checkDataPermission(item));
}

/**
 * 数据权限指令
 * 用法：v-permission:data="{ resource: data, action: 'edit' }"
 */
export const dataPermission = {
  mounted(el, binding) {
    const { resource, action = "view" } = binding.value || {};
    if (!resource) {
      return;
    }

    if (!checkDataPermission(resource, action)) {
      // 无权限时移除元素
      el.parentNode?.removeChild(el);
    }
  },
};
