// 权限管理模块
import { defineStore } from "pinia";
import { publicRoutes, permissionRoutes } from "@/router";
import router from "@/router"; // 导入router实例

/**
 * 过滤路由
 * @param {Array} routes - 路由
 * @param {Array} roles - 用户角色
 * @returns {Array} - 返回 可访问路由
 */
function filterAsyncRoutes(routes, roles) {
  const res = [];

  routes.forEach((route) => {
    const tmp = { ...route }; // 深拷贝当前路由对象
    // 检查是否有权限访问该路由
    if (hasRolePermission(roles, tmp)) {
      // 如果有子路由，递归过滤
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

/**
 * 判断角色是否有权限
 * @param {Array} roles - 用户角色
 * @param {Object} route - 路由
 * @returns {Boolean} - 返回 是否可访问
 */
function hasRolePermission(roles, route) {
  // 如果路由没有设置meta，则默认可访问
  if (!route.meta) {
    return true;
  }

  // 如果路由没有设置roles，则默认可访问
  if (!route.meta.roles) {
    return true;
  }

  // 判断用户角色是否有权限访问
  return roles.some((role) => route.meta.roles.includes(role));
}

export const usePermissionStore = defineStore("permission", {
  state: () => ({
    routes: [], // 所有路由
    addRoutes: [], // 动态路由
    roles: [], // 用户角色
  }),

  getters: {
    // 获取所有路由
    getRoutes: (state) => state.routes,
    // 获取用户角色
    getRoles: (state) => state.roles,
  },

  actions: {
    // 设置路由
    setRoutes(routes) {
      this.addRoutes = routes; // 设置动态路由
      this.routes = publicRoutes.concat(routes); // 合并公共路由和动态路由
    },

    // 设置角色
    setRoles(roles) {
      this.roles = roles; // 设置用户角色
    },

    /**
     * 生成路由
     * @param {Array} permissions - 用户权限（为了保持接口兼容，不使用）
     * @param {Array} roles - 用户角色
     * @returns {Promise} - 返回 可访问路由
     */
    generateRoutes(permissions, roles) {
      return new Promise((resolve) => {
        // 保存角色
        this.setRoles(roles);

        let accessedRoutes;
        // 如果用户拥有管理员角色，可以访问所有路由
        if (roles.includes("管理员")) {
          accessedRoutes = permissionRoutes || [];
        } else {
          // 根据角色过滤路由
          accessedRoutes = filterAsyncRoutes(permissionRoutes, roles);
        }

        // 设置路由
        this.setRoutes(accessedRoutes);
        resolve(accessedRoutes);
      });
    },

    // 重置路由
    resetRoutes() {
      // 记录当前已添加的动态路由
      const currentRoutes = [...this.addRoutes];

      // 清空状态
      this.routes = [];
      this.addRoutes = [];
      this.roles = [];

      // 从路由实例中移除动态添加的路由
      currentRoutes.forEach((route) => {
        if (route.name) {
          router.hasRoute(route.name) && router.removeRoute(route.name);
        }
      });

      // 检查是否还有其他动态添加的路由
      const remainingRoutes = router.getRoutes();
      console.log(
        "Routes after reset:",
        remainingRoutes.map((r) => r.path)
      );
    },

    // 清除路由 (别名方法，与resetRoutes功能相同)
    clearRoutes() {
      this.resetRoutes();
    },
  },
});
